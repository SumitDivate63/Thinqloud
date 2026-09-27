const functions = require('firebase-functions');
const admin = require('firebase-admin');
const crypto = require('crypto');

admin.initializeApp();
const db = admin.firestore();

const ADMIN_EMAIL = 'sumitdivate3@gmail.com';
const PASS_SECRET = process.env.PASS_SECRET;
if (!PASS_SECRET) {
  console.warn("WARNING: PASS_SECRET environment variable is missing. Set it via firebase functions:config:set pass.secret or process.env.PASS_SECRET.");
}

/**
 * 1. Auth Trigger & Callable: Assign Role Custom Claim
 * Hardcoded rule: sumitdivate3@gmail.com => role: 'admin', else role: 'user'
 */
exports.setUserRoleOnCreate = functions.auth.user().onCreate(async (user) => {
  const email = user.email ? user.email.toLowerCase() : '';
  const role = email === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'user';

  try {
    await admin.auth().setCustomUserClaims(user.uid, { role });
    await db.collection('users').doc(user.uid).set({
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || 'User',
      photoURL: user.photoURL || '',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      roleMirror: role
    }, { merge: true });
    console.log(`Custom claim { role: "${role}" } set for user ${user.uid} (${email})`);
  } catch (err) {
    console.error(`Error setting custom claim for user ${user.uid}:`, err);
  }
});

exports.refreshUserRole = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated.');
  }

  const email = (context.auth.token.email || '').toLowerCase();
  const role = email === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'user';

  await admin.auth().setCustomUserClaims(context.auth.uid, { role });
  return { success: true, role };
});

/**
 * Helper to verify Admin claim
 */
function assertAdmin(context) {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated.');
  }
  const role = context.auth.token.role;
  const email = (context.auth.token.email || '').toLowerCase();
  
  if (role !== 'admin' && email !== ADMIN_EMAIL.toLowerCase()) {
    throw new functions.https.HttpsError('permission-denied', 'Only the hardcoded admin (sumitdivate3@gmail.com) can perform this operation.');
  }
}

/**
 * 2. Admin Event CRUD Cloud Functions
 */
exports.createEvent = functions.https.onCall(async (data, context) => {
  assertAdmin(context);

  const { title, description, venue, bannerUrl, startAt, endAt, capacity, sessions } = data;
  if (!title || !venue || !capacity) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing required event fields.');
  }

  const eventRef = db.collection('events').doc();
  const eventData = {
    eventId: eventRef.id,
    title,
    description: description || '',
    venue,
    bannerUrl: bannerUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    startAt: startAt || new Date().toISOString(),
    endAt: endAt || new Date().toISOString(),
    capacity: parseInt(capacity, 10),
    status: 'PUBLISHED',
    createdBy: context.auth.uid,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    registrationCount: 0,
    attendanceCount: 0,
    sessions: sessions || []
  };

  await eventRef.set(eventData);
  return { success: true, eventId: eventRef.id };
});

exports.updateEvent = functions.https.onCall(async (data, context) => {
  assertAdmin(context);

  const { eventId, updates } = data;
  if (!eventId || !updates) {
    throw new functions.https.HttpsError('invalid-argument', 'EventId and updates required.');
  }

  await db.collection('events').doc(eventId).update({
    ...updates,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  return { success: true };
});

exports.deleteEvent = functions.https.onCall(async (data, context) => {
  assertAdmin(context);
  const { eventId } = data;
  if (!eventId) throw new functions.https.HttpsError('invalid-argument', 'Event ID required.');

  await db.collection('events').doc(eventId).delete();
  return { success: true };
});

/**
 * 3. User Registration & Digital Pass Generator
 */
exports.registerForEvent = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated.');
  }

  const { eventId } = data;
  const uid = context.auth.uid;
  const email = context.auth.token.email || '';
  const name = context.auth.token.name || email.split('@')[0];

  if (!eventId) throw new functions.https.HttpsError('invalid-argument', 'Event ID required.');

  const registrationId = `${uid}_${eventId}`;
  const regRef = db.collection('registrations').doc(registrationId);

  // Use Firestore transaction for capacity & duplicate check
  return await db.runTransaction(async (transaction) => {
    const regDoc = await transaction.get(regRef);
    if (regDoc.exists) {
      return {
        alreadyRegistered: true,
        passToken: regDoc.data().passToken,
        registrationId
      };
    }

    const eventRef = db.collection('events').doc(eventId);
    const eventDoc = await transaction.get(eventRef);
    if (!eventDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Event does not exist.');
    }

    const eventData = eventDoc.data();
    if (eventData.registrationCount >= eventData.capacity) {
      throw new functions.https.HttpsError('resource-exhausted', 'Event capacity is full.');
    }

    // Generate signed opaque pass token
    const payload = JSON.stringify({ registrationId, uid, eventId, ts: Date.now() });
    const signature = crypto.createHmac('sha256', PASS_SECRET).update(payload).digest('hex');
    const passToken = Buffer.from(JSON.stringify({ payload, signature })).toString('base64');

    transaction.set(regRef, {
      registrationId,
      uid,
      eventId,
      userEmail: email,
      userName: name,
      registeredAt: admin.firestore.FieldValue.serverTimestamp(),
      passToken
    });

    transaction.update(eventRef, {
      registrationCount: admin.firestore.FieldValue.increment(1)
    });

    return {
      success: true,
      passToken,
      registrationId
    };
  });
});

/**
 * 4. KEY FEATURE: Admin Live Camera Attendance Scanner
 * Idempotent QR scan / Manual override validation
 */
exports.markAttendance = functions.https.onCall(async (data, context) => {
  assertAdmin(context);

  const { passToken, eventId: targetEventId, method = 'qr', manualUid } = data;
  const adminUid = context.auth.uid;

  let uid, eventId, registrationId;

  if (method === 'manual' && manualUid && targetEventId) {
    uid = manualUid;
    eventId = targetEventId;
    registrationId = `${uid}_${eventId}`;
  } else if (passToken) {
    try {
      const decoded = JSON.parse(Buffer.from(passToken, 'base64').toString('utf8'));
      const { payload, signature } = decoded;
      
      const expectedSig = crypto.createHmac('sha256', PASS_SECRET).update(payload).digest('hex');
      if (signature !== expectedSig) {
        throw new Error('Pass token signature mismatch (tampered).');
      }

      const parsedPayload = JSON.parse(payload);
      uid = parsedPayload.uid;
      eventId = parsedPayload.eventId;
      registrationId = parsedPayload.registrationId;
    } catch (e) {
      throw new functions.https.HttpsError('invalid-argument', 'Invalid or expired event pass token.');
    }
  } else {
    throw new functions.https.HttpsError('invalid-argument', 'Pass token or manual verification params required.');
  }

  const attendanceId = `${uid}_${eventId}`;
  const attRef = db.collection('attendance').doc(attendanceId);
  const regRef = db.collection('registrations').doc(registrationId);

  return await db.runTransaction(async (transaction) => {
    // 1. Check if user is registered
    const regDoc = await transaction.get(regRef);
    if (!regDoc.exists) {
      throw new functions.https.HttpsError('failed-precondition', 'User is not registered for this event.');
    }

    const regData = regDoc.data();

    // 2. Check if already checked in (Idempotent)
    const attDoc = await transaction.get(attRef);
    if (attDoc.exists) {
      const existing = attDoc.data();
      const timeStr = existing.markedAt ? new Date(existing.markedAt.toDate()).toLocaleTimeString() : 'earlier';
      return {
        alreadyCheckedIn: true,
        attendeeName: regData.userName || regData.userEmail,
        attendeeEmail: regData.userEmail,
        markedAtTime: timeStr,
        message: `Already checked in at ${timeStr}`
      };
    }

    // 3. Mark Present
    const nowTimestamp = admin.firestore.FieldValue.serverTimestamp();
    transaction.set(attRef, {
      attendanceId,
      uid,
      eventId,
      userEmail: regData.userEmail,
      userName: regData.userName,
      markedAt: nowTimestamp,
      markedBy: adminUid,
      method
    });

    const eventRef = db.collection('events').doc(eventId);
    transaction.update(eventRef, {
      attendanceCount: admin.firestore.FieldValue.increment(1)
    });

    return {
      success: true,
      alreadyCheckedIn: false,
      attendeeName: regData.userName || regData.userEmail,
      attendeeEmail: regData.userEmail,
      markedAtTime: new Date().toLocaleTimeString(),
      message: 'Attendance Verified!'
    };
  });
});

/**
 * 5. Post-Attendance Feedback
 */
exports.submitFeedback = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated.');
  }

  const { eventId, rating, comment } = data;
  const uid = context.auth.uid;
  if (!eventId || !rating) throw new functions.https.HttpsError('invalid-argument', 'EventId and rating required.');

  // Check if user attended
  const attDoc = await db.collection('attendance').doc(`${uid}_${eventId}`).get();
  if (!attDoc.exists) {
    throw new functions.https.HttpsError('failed-precondition', 'Feedback is unlocked only after attending the event.');
  }

  const feedbackId = `${uid}_${eventId}`;
  await db.collection('feedback').doc(feedbackId).set({
    feedbackId,
    uid,
    eventId,
    userEmail: context.auth.token.email || '',
    rating: parseInt(rating, 10),
    comment: comment || '',
    submittedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  return { success: true };
});
