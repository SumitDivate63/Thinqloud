import React, { useState } from 'react';

export default function StitchCreateEvent({ onClose, onCreated }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Enterprise Tech',
    date: '',
    location: '',
    capacity: 500,
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onCreated) onCreated(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-on-surface/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 md:p-8 shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-outline-variant/40 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-secondary text-on-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-on-surface">Create New Event</h2>
              <p className="text-xs text-on-surface-variant">Step {step} of 2 • Basic Information & Sessions</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-low">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Stepper Form */}
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
              className="px-6 py-2 rounded-lg bg-secondary text-on-secondary font-bold text-sm hover:bg-secondary-container transition-all"
            >
              Publish Event
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
