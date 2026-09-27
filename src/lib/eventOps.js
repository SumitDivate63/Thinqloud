import { db } from '../firebase';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getCountFromServer,
  serverTimestamp
} from 'firebase/firestore';

// Digital pass token: base64 JSON of the stable identifiers needed to look the
// registration back up in Firestore. Not cryptographically signed (there is no
// trusted server component deployed for this project) - the admin scanner
// treats a decoded token as a *claim*, then verifies it against the real
// registrations/attendance documents before marking anyone present.
export function buildPassToken({ uid, eventId, registrationId }) {
  return btoa(JSON.stringify({ uid, eventId, registrationId }));
}

export function decodePassToken(token) {
  try {
    const decoded = JSON.parse(atob(String(token).trim()));
    if (decoded && decoded.uid && decoded.eventId && decoded.registrationId) {
      return decoded;
    }
  } catch (e) {
    // not a valid pass token
  }
  return null;
}

export async function getEventRegistrationCount(eventId) {
  const q = query(collection(db, 'registrations'), where('eventId', '==', eventId));
  const snap = await getCountFromServer(q);
  return snap.data().count;
}

export async function getEventAttendanceCount(eventId) {
  const q = query(collection(db, 'attendance'), where('eventId', '==', eventId));
  const snap = await getCountFromServer(q);
  return snap.data().count;
}

// Registers `user` for `event`. Idempotent: calling it again for an existing
// registration just returns the same pass instead of erroring.
//
// This does NOT pre-check whether a registration already exists via getDoc -
// firestore.rules denies `update` on registrations entirely, so attempting to
// write over an existing one always comes back permission-denied. That is
// used directly as the "already registered" signal, rather than reading the
// document first (a get() on a not-yet-existing doc under an owner-only read
// rule is its own separate hazard - see firestore.rules for the exists()
// docs on the read rule, which is why other checks in this file still need it).
export async function registerUserForEvent(user, event) {
  if (!user) throw new Error('Sign in required to register.');

  const eventId = event.id || event.eventId;
  const registrationId = `${user.uid}_${eventId}`;
  const regRef = doc(db, 'registrations', registrationId);
  const passToken = buildPassToken({ uid: user.uid, eventId, registrationId });

  const capacity = Number(event.capacity);
  if (Number.isFinite(capacity)) {
    const currentCount = await getEventRegistrationCount(eventId);
    if (currentCount >= capacity) {
      throw new Error('This event has reached full capacity.');
    }
  }

  const registrationData = {
    registrationId,
    uid: user.uid,
    eventId,
    userEmail: user.email || '',
    userName: user.displayName || (user.email ? user.email.split('@')[0] : 'Attendee'),
    registeredAt: serverTimestamp()
  };

  try {
    await setDoc(regRef, registrationData);
  } catch (err) {
    if (err.code === 'permission-denied') {
      return { alreadyRegistered: true, registrationId, passToken };
    }
    throw err;
  }

  return { alreadyRegistered: false, registrationId, passToken };
}

// Admin-only: verifies a scanned/manual pass against the real registration
// record and marks attendance. Idempotent duplicate-scan handling built in.
export async function markAttendanceForPass({ uid, eventId, registrationId, adminUid, method = 'qr' }) {
  const regRef = doc(db, 'registrations', registrationId);
  const regSnap = await getDoc(regRef);
  if (!regSnap.exists()) {
    throw new Error('No matching registration found for this pass.');
  }

  const regData = regSnap.data();
  if (regData.uid !== uid || regData.eventId !== eventId) {
    throw new Error('Pass details do not match any registration record.');
  }

  const attendanceId = `${uid}_${eventId}`;
  const attRef = doc(db, 'attendance', attendanceId);

  // Same reasoning as registerUserForEvent: firestore.rules denies `update`
  // on attendance, so a second write for the same attendanceId is denied -
  // that denial is the "already checked in" signal, no pre-read needed.
  try {
    await setDoc(attRef, {
      attendanceId,
      uid,
      eventId,
      userEmail: regData.userEmail,
      userName: regData.userName,
      markedAt: serverTimestamp(),
      markedBy: adminUid,
      method
    });
  } catch (err) {
    if (err.code === 'permission-denied') {
      return {
        alreadyCheckedIn: true,
        attendeeName: regData.userName,
        attendeeEmail: regData.userEmail
      };
    }
    throw err;
  }

  return {
    alreadyCheckedIn: false,
    attendeeName: regData.userName,
    attendeeEmail: regData.userEmail
  };
}

// Participant feedback, gated on a real attendance record existing (also
// enforced independently by firestore.rules). Duplicate submission is
// detected the same way as registration/attendance: firestore.rules denies
// `update` on feedback for non-admins, so a second write is denied rather
// than needing a pre-read of the (possibly not-yet-existing) feedback doc.
export async function submitEventFeedback({ uid, eventId, rating, comment }) {
  const attRef = doc(db, 'attendance', `${uid}_${eventId}`);
  const attSnap = await getDoc(attRef);
  if (!attSnap.exists()) {
    throw new Error('Feedback unlocks only after the admin verifies your attendance.');
  }

  const feedbackRef = doc(db, 'feedback', `${uid}_${eventId}`);
  try {
    await setDoc(feedbackRef, {
      feedbackId: `${uid}_${eventId}`,
      uid,
      eventId,
      rating: Number(rating),
      comment: comment || '',
      submittedAt: serverTimestamp()
    });
  } catch (err) {
    if (err.code === 'permission-denied') {
      throw new Error('You already submitted feedback for this event.');
    }
    throw err;
  }
}
