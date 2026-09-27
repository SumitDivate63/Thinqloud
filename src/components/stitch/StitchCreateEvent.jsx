import React, { useState } from 'react';
import { createNewEvent, updateExistingEvent } from '../../data/initialEvents';

export default function StitchCreateEvent({ event, onClose, onCreated }) {
  const isEditing = !!event;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [formData, setFormData] = useState({
    title: event?.title || '',
    category: event?.category || 'Enterprise Tech',
    date: event?.date || '',
    location: event?.location || '',
    capacity: event?.capacity || 500,
    description: event?.description || '',
    banner: event?.banner || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const savedEvent = isEditing
        ? await updateExistingEvent(event.id, formData)
        : await createNewEvent(formData);
      if (onCreated) onCreated(savedEvent);
      onClose();
    } catch (err) {
      console.error('Failed to save event:', err);
      setSubmitError(err.message || 'Could not save this event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-on-surface/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 md:p-8 shadow-2xl space-y-6 relative overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-outline-variant/40 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-secondary text-on-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">{isEditing ? 'edit' : 'add_circle'}</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-on-surface">{isEditing ? 'Edit Event' : 'Create New Event'}</h2>
              <p className="text-xs text-on-surface-variant">Basic information</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-low">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-on-surface-variant block mb-1">Event Title</label>
            <input
              type="text"
              required
              placeholder="e.g. AI & Cloud Architecture Summit 2026"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full py-2 px-3 bg-surface-container-low border border-outline-variant/60 rounded-lg text-sm text-on-surface"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-on-surface-variant block mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full py-2 px-3 bg-surface-container-low border border-outline-variant/60 rounded-lg text-sm text-on-surface"
              >
                <option value="Enterprise Tech">Enterprise Tech</option>
                <option value="Academic & Research">Academic & Research</option>
                <option value="Hackathons & AI">Hackathons & AI</option>
                <option value="Workshops">Workshops</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-on-surface-variant block mb-1">Attendee Capacity</label>
              <input
                type="number"
                required
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                className="w-full py-2 px-3 bg-surface-container-low border border-outline-variant/60 rounded-lg text-sm text-on-surface"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-on-surface-variant block mb-1">Date & Range</label>
              <input
                type="text"
                required
                placeholder="Nov 12-14, 2026"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full py-2 px-3 bg-surface-container-low border border-outline-variant/60 rounded-lg text-sm text-on-surface"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-on-surface-variant block mb-1">Venue / Room</label>
              <input
                type="text"
                required
                placeholder="Moscone Center, SF & Virtual"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full py-2 px-3 bg-surface-container-low border border-outline-variant/60 rounded-lg text-sm text-on-surface"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-on-surface-variant block mb-1">Description</label>
            <textarea
              rows={3}
              required
              placeholder="Outline event agenda and key objectives..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full py-2 px-3 bg-surface-container-low border border-outline-variant/60 rounded-lg text-sm text-on-surface"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-on-surface-variant block mb-1">Banner Photo URL (optional)</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/photo-..."
              value={formData.banner}
              onChange={(e) => setFormData({ ...formData, banner: e.target.value })}
              className="w-full py-2 px-3 bg-surface-container-low border border-outline-variant/60 rounded-lg text-sm text-on-surface"
            />
            {formData.banner && (
              <img
                src={formData.banner}
                alt="Banner preview"
                className="mt-2 h-28 w-full object-cover rounded-lg border border-outline-variant/60"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                onLoad={(e) => { e.currentTarget.style.display = 'block'; }}
              />
            )}
            <p className="text-[11px] text-on-surface-variant mt-1">Leave blank to use the default photo.</p>
          </div>

          {submitError && (
            <p className="text-xs text-rose-600 font-semibold">{submitError}</p>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/40">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-surface-container-low border border-outline-variant text-on-surface text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 rounded-lg bg-secondary text-on-secondary font-bold text-sm hover:bg-secondary-container transition-all disabled:opacity-60"
            >
              {isSubmitting ? 'Saving…' : isEditing ? 'Save Changes' : 'Publish Event'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
