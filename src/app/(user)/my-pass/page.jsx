'use client';

import React, { useState, useEffect } from 'react';
import { auth, db } from '../../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { buildPassToken, submitEventFeedback } from '../../../lib/eventOps';

export default function UserDigitalPassPage({ registeredEventIds = [], events = [] }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(registeredEventIds[0] || null);
  const [attendanceStatus, setAttendanceStatus] = useState(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackError, setFeedbackError] = useState('');

  const eventsMap = events.reduce((acc, ev) => {
    const key = ev.id || ev.eventId;
    acc[key] = ev;
    return acc;
  }, {});

  useEffect(() => {
    if (registeredEventIds.length > 0 && !registeredEventIds.includes(selectedEventId)) {
      setSelectedEventId(registeredEventIds[0]);
    } else if (registeredEventIds.length === 0) {
      setSelectedEventId(null);
    }
  }, [registeredEventIds]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setCurrentUser);
    return () => unsub();
  }, []);

  useEffect(() => {
    setFeedbackSubmitted(false);
    setFeedbackError('');
    if (!currentUser || !selectedEventId) {
      setAttendanceStatus(null);
      return;
    }
    const attRef = doc(db, 'attendance', `${currentUser.uid}_${selectedEventId}`);
    const unsubAtt = onSnapshot(attRef, (snap) => {
      setAttendanceStatus(snap.exists() ? snap.data() : null);
    }, () => setAttendanceStatus(null));
    return () => unsubAtt();
  }, [currentUser, selectedEventId]);

  const currentEvent = eventsMap[selectedEventId];

  const passToken = (currentUser && currentEvent)
    ? buildPassToken({ uid: currentUser.uid, eventId: currentEvent.id, registrationId: `${currentUser.uid}_${currentEvent.id}` })
    : null;

  const qrImageUrl = passToken
    ? `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(passToken)}`
    : null;

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!currentUser || !currentEvent) return;
    setFeedbackSubmitting(true);
    setFeedbackError('');
    try {
      await submitEventFeedback({ uid: currentUser.uid, eventId: currentEvent.id, rating: feedbackRating, comment: feedbackComment });
      setFeedbackSubmitted(true);
    } catch (err) {
      setFeedbackError(err.message || 'Could not submit feedback. Please try again.');
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="w-full bg-background min-h-screen p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-sm text-center bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-8 shadow-sm space-y-2">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant">lock</span>
          <h2 className="text-base font-bold text-on-surface">Sign in to view your pass</h2>
          <p className="text-xs text-on-surface-variant">Your digital event passes appear here once you're signed in and registered.</p>
        </div>
      </div>
    );
  }

  if (!currentEvent) {
    return (
      <div className="w-full bg-background min-h-screen p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-sm text-center bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-8 shadow-sm space-y-2">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant">badge</span>
          <h2 className="text-base font-bold text-on-surface">No passes yet</h2>
          <p className="text-xs text-on-surface-variant">Register for an event from Browse Events to get your digital pass.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-background min-h-screen p-4 md:p-8 space-y-6 max-w-5xl mx-auto">
      
      {/* Title Header & Event Selector Tabs */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/60 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container text-secondary text-xs font-semibold">
            <span className="material-symbols-outlined text-[14px]">badge</span>
            MY REGISTERED EVENT PASSES ({registeredEventIds.length})
          </div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight mt-1">Digital Event Access Pass</h1>
          <p className="text-xs text-on-surface-variant">Present this pass on your phone screen to the event admin at venue entrance.</p>
        </div>

        {/* Registered Event Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {registeredEventIds.map(evId => {
            const ev = eventsMap[evId];
            const isSelected = selectedEventId === evId;
            return (
              <button
                key={evId}
                onClick={() => setSelectedEventId(evId)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-secondary text-on-secondary shadow-sm'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {ev?.title || evId}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Phone Pass Card vs Session Attendance Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Pass Card (5 Cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-primary-container to-secondary-container text-on-secondary rounded-2xl p-6 shadow-xl space-y-6 relative overflow-hidden text-center">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-white/80">{currentEvent.category}</span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 text-[10px] font-extrabold uppercase">
              CONFIRMED PASS
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-white">{currentUser.displayName || currentUser.email}</h2>
            <p className="text-xs text-white/80">{currentUser.email}</p>
          </div>

          {/* Rendered QR Code & Full Token ID */}
          <div className="inline-block p-4 bg-white rounded-2xl shadow-2xl border-2 border-white max-w-full">
            <img src={qrImageUrl} alt="My Digital QR Pass" className="w-52 h-52 mx-auto block rounded-lg" />
            <div className="mt-3 p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-left">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Pass Token ID</span>
                <button
                  type="button"
                  onClick={() => navigator.clipboard?.writeText(passToken)}
                  className="text-[10px] font-extrabold text-secondary hover:text-secondary-container transition-colors uppercase"
                >
                  Copy Token
                </button>
              </div>
              <div className="text-[11px] font-mono font-bold text-slate-800 break-all select-all leading-tight max-h-20 overflow-y-auto">
                {passToken}
              </div>
            </div>
          </div>

          <p className="text-[11px] text-white/70">
            Show this screen to the Event Admin. Do NOT share your QR token with others.
          </p>
        </div>

        {/* Right Details & Post-Attendance Feedback (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Registered Event Card */}
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 shadow-sm space-y-3">
            <span className="text-xs font-bold text-secondary uppercase tracking-wider">{currentEvent.category}</span>
            <h3 className="text-lg font-bold text-on-surface">{currentEvent.title}</h3>
            <div className="space-y-1.5 text-xs text-on-surface-variant">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-secondary">calendar_month</span>
                <span>{currentEvent.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-secondary">location_on</span>
                <span>{currentEvent.location}</span>
              </div>
            </div>
          </div>

          {/* Post-Attendance Feedback Section */}
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3">
              <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500 text-[20px]">rate_review</span>
                <span>Post-Attendance Event Feedback</span>
              </h3>
              <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                attendanceStatus ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
              }`}>
                {attendanceStatus ? 'Unlocked' : 'Locked (Requires Attendance)'}
              </span>
            </div>

            {!attendanceStatus ? (
              <div className="p-4 rounded-xl bg-surface-container-low text-xs text-on-surface-variant leading-relaxed">
                Feedback form unlocks automatically after the Admin scans your pass and marks your attendance at the event.
              </div>
            ) : feedbackSubmitted ? (
              <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">check_circle</span>
                <span>Thank you! Your feedback rating ({feedbackRating}/5 stars) has been recorded.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmitFeedback} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-on-surface-variant block mb-1">Rating (1 to 5 Stars)</label>
                  <select
                    value={feedbackRating}
                    onChange={(e) => setFeedbackRating(e.target.value)}
                    className="w-full py-2 px-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-xs text-on-surface font-semibold"
                  >
                    <option value="5">⭐⭐⭐⭐⭐ (5/5) Excellent</option>
                    <option value="4">⭐⭐⭐⭐ (4/5) Very Good</option>
                    <option value="3">⭐⭐⭐ (3/5) Average</option>
                    <option value="2">⭐⭐ (2/5) Poor</option>
                    <option value="1">⭐ (1/5) Needs Improvement</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-on-surface-variant block mb-1">Comments & Key Takeaways</label>
                  <textarea
                    rows={3}
                    placeholder="Share feedback on speakers, organization, or sessions..."
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    className="w-full py-2 px-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-xs text-on-surface"
                  />
                </div>

                {feedbackError && (
                  <p className="text-[11px] text-rose-600 font-semibold">{feedbackError}</p>
                )}

                <button
                  type="submit"
                  disabled={feedbackSubmitting}
                  className="px-4 py-2.5 rounded-xl bg-secondary text-on-secondary font-bold text-xs hover:bg-secondary-container transition-all disabled:opacity-60"
                >
                  {feedbackSubmitting ? 'Submitting…' : 'Submit Event Feedback'}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
