import { db } from '../firebase';
import { collection, getDocs, doc, setDoc, writeBatch } from 'firebase/firestore';
import { SESSIONS, SPEAKERS, CONFERENCE_INFO, INITIAL_QA, SPONSORS } from '../data/conferenceData';

export async function seedFirestoreDatabase() {
  try {
    console.log("Starting Firebase Firestore initialization...");

    // 1. Seed Users Collection
    const sampleUsers = [
      {
        uid: 'usr-admin-01',
        email: 'admin@thinqsummit.io',
        displayName: 'Campus Admin',
        role: 'admin',
        passType: 'vip',
        createdAt: new Date().toISOString()
      },
      {
        uid: 'usr-org-01',
        email: 'organizer@thinqsummit.io',
        displayName: 'ThinqCloud Organizer',
        role: 'organizer',
        passType: 'vip',
        createdAt: new Date().toISOString()
      },
      {
        uid: 'usr-part-01',
        email: 'participant@thinqsummit.io',
        displayName: 'Alex Rivers',
        role: 'participant',
        passType: 'standard',
        createdAt: new Date().toISOString()
      }
    ];

    for (const u of sampleUsers) {
      await setDoc(doc(db, 'users', u.uid), u, { merge: true });
    }

    // 2. Seed Events Collection
    await setDoc(doc(db, 'events', 'event-2026-sf'), {
      eventId: 'event-2026-sf',
      title: CONFERENCE_INFO.name,
      tagline: CONFERENCE_INFO.tagline,
      location: CONFERENCE_INFO.location,
      dateRange: CONFERENCE_INFO.dateRange,
      status: 'PUBLISHED',
      createdAt: new Date().toISOString()
    }, { merge: true });

    // 3. Seed Speakers Collection
    for (const spk of SPEAKERS) {
      await setDoc(doc(db, 'speakers', spk.id), spk, { merge: true });
    }

    // 4. Seed Sessions Collection
    for (const sess of SESSIONS) {
      await setDoc(doc(db, 'sessions', sess.id), sess, { merge: true });
    }

    // 5. Seed Q&A Collection
    for (const qa of INITIAL_QA) {
      await setDoc(doc(db, 'conference_qa', qa.id), qa, { merge: true });
    }

    console.log("Firestore Database successfully seeded!");
    return { success: true, message: "Firestore database successfully initialized with Users, Events, Sessions, Speakers, and Q&A collections!" };
  } catch (err) {
    console.warn("Firestore seeding notice (using local dataset fallback if rules restrict write):", err);
    return { success: false, error: err.message };
  }
}
