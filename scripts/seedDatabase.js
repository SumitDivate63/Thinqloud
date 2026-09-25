import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, collection } from "firebase/firestore";

// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDh5xjyntdR6RzxtJcD-r8_M5P0VQtw2Xo",
  authDomain: "conferenceplatform-bb134.firebaseapp.com",
  projectId: "conferenceplatform-bb134",
  storageBucket: "conferenceplatform-bb134.firebasestorage.app",
  messagingSenderId: "1093928811908",
  appId: "1:1093928811908:web:eacf6021e6cc5dc4e331d1",
  measurementId: "G-G4RTTN0YF5"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const SPEAKERS = [
  {
    id: "spk-1",
    name: "Dr. Elena Rostova",
    role: "VP of Artificial Intelligence",
    company: "DeepMind Robotics",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    bio: "Pioneer in autonomous agent architectures and large multimodal models.",
    topics: ["Autonomous Agents", "LLM Fine-Tuning", "Neural Optimization"]
  },
  {
    id: "spk-2",
    name: "Marcus Vance",
    role: "Chief Cloud Architect",
    company: "ThinqCloud Global",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    bio: "Ex-AWS Principal Engineer leading multi-region serverless resiliency.",
    topics: ["Serverless at Scale", "Multi-Cloud Strategy"]
  },
  {
    id: "spk-3",
    name: "Sarah Jenkins",
    role: "Head of Developer Experience",
    company: "Vercel Labs",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80",
    bio: "Obsessed with latency, edge compute, and micro-frontends.",
    topics: ["Edge Compute", "React Server Components"]
  }
];

const SESSIONS = [
  {
    id: "sess-101",
    title: "Keynote: The Next Epoch of Autonomous AI & Cloud Platforms",
    abstract: "Join Dr. Elena Rostova and Marcus Vance as they unveil breakthroughs in multi-cloud infrastructure.",
    track: "ai",
    room: "Grand Ballroom A (Main Stage)",
    time: "09:00 AM - 10:15 AM",
    speakerIds: ["spk-1", "spk-2"],
    capacity: 2500,
    isLive: true
  },
  {
    id: "sess-102",
    title: "Mastering Real-Time LLM Streaming at Scale with Firebase & Edge",
    abstract: "Learn how to build sub-50ms latency AI chatbots using WebSockets, edge workers, and real-time document sync.",
    track: "ai",
    room: "Stage 2 - AI Hub",
    time: "10:30 AM - 11:30 AM",
    speakerIds: ["spk-1"],
    capacity: 600,
    isLive: false
  }
];

const SAMPLE_USERS = [
  {
    uid: "usr-admin-01",
    email: "admin@thinqsummit.io",
    displayName: "Campus Admin",
    role: "admin",
    passType: "vip",
    createdAt: new Date().toISOString()
  },
  {
    uid: "usr-org-01",
    email: "organizer@thinqsummit.io",
    displayName: "ThinqCloud Organizer",
    role: "organizer",
    passType: "vip",
    createdAt: new Date().toISOString()
  },
  {
    uid: "usr-part-01",
    email: "participant@thinqsummit.io",
    displayName: "Alex Rivers",
    role: "participant",
    passType: "standard",
    createdAt: new Date().toISOString()
  }
];

const SAMPLE_ATTENDANCE = [
  {
    id: "att-101",
    sessionId: "sess-101",
    participantId: "usr-part-01",
    participantName: "Alex Rivers",
    verifiedAt: "10:04 AM",
    tokenUsed: "TOKEN-LIVE-VERIFIED",
    status: "VERIFIED"
  }
];

const SAMPLE_QA = [
  {
    id: "qa-1",
    author: "Alex Rivers",
    question: "How does the autonomous agent handle cross-region failovers when state synchronization is still in-flight?",
    upvotes: 42,
    timestamp: "10:04 AM",
    answered: true
  }
];

async function seedData() {
  console.log("Seeding Firebase Firestore Collections...");

  // Seed Users
  for (const u of SAMPLE_USERS) {
    await setDoc(doc(db, "users", u.uid), u, { merge: true });
    console.log(`Inserted user: ${u.email} (${u.role})`);
  }

  // Seed Events
  await setDoc(doc(db, "events", "event-2026-sf"), {
    eventId: "event-2026-sf",
    title: "ThinqSummit 2026",
    tagline: "The Premier Global Cloud, AI & Next-Gen Developer Summit",
    location: "Moscone Center, San Francisco & Online",
    dateRange: "November 12 - 14, 2026",
    status: "PUBLISHED",
    createdAt: new Date().toISOString()
  }, { merge: true });
  console.log("Inserted Event: event-2026-sf");

  // Seed Speakers
  for (const spk of SPEAKERS) {
    await setDoc(doc(db, "speakers", spk.id), spk, { merge: true });
    console.log(`Inserted speaker: ${spk.name}`);
  }

  // Seed Sessions
  for (const sess of SESSIONS) {
    await setDoc(doc(db, "sessions", sess.id), sess, { merge: true });
    console.log(`Inserted session: ${sess.title}`);
  }

  // Seed Attendance
  for (const att of SAMPLE_ATTENDANCE) {
    await setDoc(doc(db, "conference_attendance", att.id), att, { merge: true });
    console.log(`Inserted attendance record: ${att.participantName}`);
  }

  // Seed Q&A
  for (const qa of SAMPLE_QA) {
    await setDoc(doc(db, "conference_qa", qa.id), qa, { merge: true });
    console.log(`Inserted Q&A item: ${qa.question.substring(0, 30)}...`);
  }

  console.log("SUCCESS: All Firestore collections populated successfully!");
  process.exit(0);
}

seedData().catch(err => {
  console.error("Error inserting data into Firestore:", err);
  process.exit(1);
});
