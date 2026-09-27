import { db } from '../firebase';
import { doc, setDoc, updateDoc } from 'firebase/firestore';

// Creates a new event directly in Firestore. The real-time listener in
// App.jsx picks it up automatically - no local/optimistic copy is kept,
// so every visitor always sees the same, real, database-backed list.
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

  await setDoc(doc(db, 'events', eventId), newEvent);

  return newEvent;
}

// Updates fields on an existing event in Firestore.
export async function updateExistingEvent(existingEvent, formData) {
  const eventId = existingEvent.id;
  const updates = {
    title: formData.title || 'Untitled Event',
    category: formData.category || 'Enterprise Tech',
    date: formData.date || 'Nov 20, 2026',
    location: formData.location || 'Moscone Center, SF',
    capacity: Number(formData.capacity) || 500,
    description: formData.description || '',
    banner: formData.banner || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
    // Older documents (e.g. leftover seed data) may not have this field at
    // all; make sure editing an event always leaves it as a valid number.
    registeredCount: Number.isFinite(existingEvent.registeredCount) ? existingEvent.registeredCount : 0,
    updatedAt: new Date().toISOString()
  };

  await updateDoc(doc(db, 'events', eventId), updates);

  return { id: eventId, eventId, ...updates };
}
