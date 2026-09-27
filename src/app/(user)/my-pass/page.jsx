'use client';

import React, { useState, useEffect } from 'react';
import { auth, db } from '../../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';

export default function UserDigitalPassPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [attendanceStatus, setAttendanceStatus] = useState(null); // null | { markedAt: string }
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setCurrentUser(u);
      if (u) {
        // Listen to attendance doc uid_event-2026-sf
        const attRef = doc(db, 'attendance', `${u.uid}_event-2026-sf`);
        const unsubAtt = onSnapshot(attRef, (snap) => {
          if (snap.exists()) {
            setAttendanceStatus(snap.data());
          } else {
            setAttendanceStatus(null);
          }
        });
        return () => unsubAtt();
      }
    });
    return () => unsub();
  }, []);

  const samplePassToken = currentUser 
    ? btoa(JSON.stringify({ registrationId: `${currentUser.uid}_event-2026-sf`, uid: currentUser.uid, eventId: 'event-2026-sf', ts: Date.now() }))
    : 'GUEST_PASS_TOKEN';

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(samplePassToken)}`;

  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    setFeedbackSubmitted(true);
  };

  return (
    <div className="w-full bg-background min-h-screen p-4 md:p-8 space-y-6 max-w-5xl mx-auto">
      
      {/* Title Header */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/60 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container text-secondary text-xs font-semibold">
            <span className="material-symbols-outlined text-[14px]">badge</span>
            MY EVENT PASS & CHECK-IN STATUS
          </div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight mt-1">Digital Event Access Pass</h1>
          <p className="text-xs text-on-surface-variant">Present this pass on your phone screen to the event admin at venue entrance.</p>
        </div>

        {/* Live Attendance Status Badge */}
        <div>
          {attendanceStatus ? (
            <div className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-2 text-xs font-bold">
              <span className="material-symbols-outlined text-emerald-600 text-[18px]">verified</span>
              <span>Checked in at {attendanceStatus.markedAtTime || '10:04 AM'}</span>
            </div>
          ) : (
            <div className="px-4 py-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-300 flex items-center gap-2 text-xs font-bold">
              <span className="material-symbols-outlined text-amber-600 text-[18px]">schedule</span>
              <span>Not yet checked in (Awaiting Admin Scan)</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Phone Pass Card vs Session Attendance Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Pass Card (5 Cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-primary-container to-secondary-container text-on-secondary rounded-2xl p-6 shadow-xl space-y-6 relative overflow-hidden text-center">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-white/80">EventPass Digital Token</span>
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-extrabold uppercase">
              CONFIRMED PASS
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-white">{currentUser?.displayName || currentUser?.email || 'Authenticated Attendee'}</h2>
            <p className="text-xs text-white/80">{currentUser?.email || 'user@thinqsummit.io'}</p>
          </div>

          {/* Rendered QR Code */}
          <div className="inline-block p-4 bg-white rounded-2xl shadow-2xl border-2 border-white">
            <img src={qrImageUrl} alt="My Digital QR Pass" className="w-52 h-52 mx-auto block" />
            <div className="mt-3 text-[10px] font-mono font-bold text-slate-600 truncate max-w-[200px] mx-auto">
              TOKEN: {samplePassToken.substring(0, 16)}...
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
            <span className="text-xs font-bold text-secondary uppercase tracking-wider">Registered Flagship Event</span>
            <h3 className="text-lg font-bold text-on-surface">ThinqSummit 2026: Global Cloud & AI Architecture</h3>
            <div className="space-y-1.5 text-xs text-on-surface-variant">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-secondary">calendar_month</span>
                <span>November 12 - 14, 2026</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-secondary">location_on</span>
                <span>Moscone Center, San Francisco</span>
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

                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-secondary text-on-secondary font-bold text-xs hover:bg-secondary-container transition-all"
                >
                  Submit Event Feedback
                </button>
              </form>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
