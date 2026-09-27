import { db } from '../firebase';
import { collection, doc, setDoc, onSnapshot, getDocs } from 'firebase/firestore';

export const DEFAULT_EVENTS = [
  {
    id: 'event-abc',
    eventId: 'event-abc',
    title: 'ABC',
    category: 'Enterprise Tech',
    date: 'Nov 18, 2026',
    location: 'Moscone Center South, San Francisco',
    organizer: 'ThinqCloud Admin Panel',
    capacity: 500,
    registeredCount: 120,
    banner: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
    badge: 'Admin Created Event',
    status: 'PUBLISHED',
    description: 'Event ABC created from Admin Panel and synced across Database & User Panel.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'event-1',
    title: 'ThinqSummit 2026: Global Cloud & AI Architecture',
    category: 'Enterprise Tech',
    date: 'Nov 12 - 14, 2026',
    location: 'Moscone Center, San Francisco & Online',
    organizer: 'ThinqCloud Engineering',
    capacity: 8500,
    registeredCount: 5420,
    banner: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
    badge: 'Featured Flagship',
    status: 'PUBLISHED',
    description: 'Join senior cloud architects and AI leaders for keynotes and hands-on workshops.'
  },
  {
    id: 'event-2',
    title: 'Autonomous AI Agents & Neural Consensus Symposium',
    category: 'Hackathons & AI',
    date: 'Nov 13, 2026',
    location: 'Stage 2 — AI Hub',
    organizer: 'DeepMind Robotics Lab',
    capacity: 1200,
    registeredCount: 980,
    banner: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80',
    badge: 'Live Stream Active',
    status: 'PUBLISHED',
    description: 'Explore state-of-the-art neural consensus models and autonomous multi-agent systems.'
  },
  {
    id: 'event-3',
    title: 'Zero-Trust Kernel & eBPF Security Operations Workshop',
    category: 'Academic & Research',
    date: 'Nov 14, 2026',
    location: 'Stage 4 — Security Lab',
    organizer: 'ShieldCorp Cybersecurity',
    capacity: 600,
    registeredCount: 450,
    banner: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    badge: 'Hands-on Lab',
    status: 'PUBLISHED',
    description: 'Deep dive into eBPF observability, kernel tracepoints, and zero-trust security patterns.'
  }
];

// Helper to load stored local events
export function getLocalEvents() {
  try {
    const saved = localStorage.getItem('eventhub_events');
    if (!saved) return DEFAULT_EVENTS;
    const parsed = JSON.parse(saved);
    // Ensure default events (like ABC) exist in local storage list
    const map = new Map();
    DEFAULT_EVENTS.forEach(e => map.set(e.id, e));
    parsed.forEach(e => map.set(e.id, e));
    return Array.from(map.values());
  } catch (e) {
    return DEFAULT_EVENTS;
  }
}

// Helper to save local events
export function saveLocalEvents(events) {
  try {
    localStorage.setItem('eventhub_events', JSON.stringify(events));
  } catch (e) {
    console.error('Error saving events to localStorage:', e);
  }
}

// Function to save an event both to Firestore DB & LocalStorage
export async function createNewEvent(formData) {
  const eventId = `event-${Date.now()}`;
  const newEvent = {
    id: eventId,
    eventId: eventId,
    title: formData.title || 'Untitled Event',
    category: formData.category || 'Enterprise Tech',
    date: formData.date || 'Nov 20, 2026',
    location: formData.location || 'Moscone Center, SF',
    organizer: 'ThinqCloud Admin',
    capacity: Number(formData.capacity) || 500,
    registeredCount: 0,
    banner: formData.banner || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
    badge: 'Newly Published',
    status: 'PUBLISHED',
    description: formData.description || '',
    createdAt: new Date().toISOString()
  };

  // 1. Save to LocalStorage first for instant availability
  const currentLocal = getLocalEvents();
  const updatedLocal = [newEvent, ...currentLocal.filter(e => e.id !== newEvent.id)];
  saveLocalEvents(updatedLocal);

  // 2. Save to Firebase Firestore database
  try {
    await setDoc(doc(db, 'events', eventId), newEvent);
    console.log('Successfully saved new event to Firestore DB:', newEvent);
  } catch (err) {
    console.warn('Firestore write warning (saved to local fallback):', err);
  }

  return newEvent;
}
