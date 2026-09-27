import React, { useState } from 'react';
import { SESSIONS, SPEAKERS } from '../../data/conferenceData';

export default function EventDetailsAndPassModal({ event, isOpen, onClose, isRegistered, onConfirmRegistration, currentUser }) {
  const [activeTab, setActiveTab] = useState(isRegistered ? 'pass' : 'details'); // 'details' | 'pass' | 'feedback'
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [justRegistered, setJustRegistered] = useState(false);

  if (!isOpen || !event) return null;

  const handleRegisterClick = () => {
    onConfirmRegistration(event.id);
    setJustRegistered(true);
    setActiveTab('pass');
  };

  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    setFeedbackSubmitted(true);
  };

  // Sample signed pass token encoding { registrationId, uid, eventId }
  const samplePassToken = btoa(JSON.stringify({
    registrationId: `${currentUser?.uid || 'usr-guest'}_${event.id}`,
    uid: currentUser?.uid || 'usr-guest',
    eventId: event.id,
    ts: Date.now()
  }));

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(samplePassToken)}`;

  return (
    <div className="fixed inset-0 z-50 bg-on-surface/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-surface-container-lowest border border-outline-variant/60 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Top Header Banner */}
        <div className="relative h-44 md:h-52 overflow-hidden flex-shrink-0">
          <img src={event.banner} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-on-surface/90 via-on-surface/40 to-transparent p-6 flex flex-col justify-end text-white">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded bg-secondary text-on-secondary text-[11px] font-extrabold uppercase tracking-wider">
                {event.category}
              </span>
              <button onClick={onClose} className="p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-md">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold tracking-tight mt-1 line-clamp-1">{event.title}</h2>
            <p className="text-xs text-slate-200 mt-0.5">{event.date} • {event.location}</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-outline-variant/40 bg-surface-container-low px-6 pt-3 flex-shrink-0 gap-2">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'details'
                ? 'bg-surface-container-lowest text-secondary border-t-2 border-secondary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">info</span>
            <span>Event Details & Schedule</span>
          </button>

          <button
            onClick={() => setActiveTab('pass')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'pass'
                ? 'bg-surface-container-lowest text-secondary border-t-2 border-secondary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
            <span>Digital Pass & QR</span>
            {(isRegistered || justRegistered) && (
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Active
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('feedback')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'feedback'
                ? 'bg-surface-container-lowest text-secondary border-t-2 border-secondary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">rate_review</span>
            <span>Feedback</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: EVENT DETAILS & SCHEDULE */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              
              {/* Registration Banner status */}
              {(isRegistered || justRegistered) ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-600 text-[20px]">check_circle</span>
                    <span>You are registered for this event! Digital Pass is generated.</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('pass')}
                    className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700"
                  >
                    View QR Pass
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/60 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-on-surface">Registration Status: OPEN</div>
                    <div className="text-[11px] text-on-surface-variant">{event.registeredCount || 5420} / {event.capacity} Capacity Filled</div>
                  </div>
                  <button
                    onClick={handleRegisterClick}
                    className="px-5 py-2.5 rounded-xl bg-secondary text-on-secondary font-bold text-xs hover:bg-secondary-container transition-all shadow-md flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">badge</span>
                    <span>Confirm Registration & Claim Pass</span>
                  </button>
                </div>
              )}

              {/* Event Description */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-on-surface">About this Conference</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Join cloud architects, AI researchers, and engineering leaders for deep-dive sessions, zero-trust security strategy, and dynamic QR attendance verification.
                </p>
              </div>

              {/* Keynote Speakers */}
              <div className="space-y-3 pt-3 border-t border-outline-variant/40">
                <h3 className="text-sm font-bold text-on-surface">Featured Keynote Speakers</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {SPEAKERS.slice(0, 4).map(spk => (
                    <div key={spk.id} className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/40 flex items-center gap-3">
                      <img src={spk.avatar} alt={spk.name} className="w-10 h-10 rounded-full object-cover border border-secondary" />
                      <div>
                        <div className="font-bold text-xs text-on-surface">{spk.name}</div>
                        <div className="text-[11px] text-secondary font-semibold">{spk.role}</div>
                        <div className="text-[10px] text-on-surface-variant">{spk.company}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed Session Schedule */}
              <div className="space-y-3 pt-3 border-t border-outline-variant/40">
                <h3 className="text-sm font-bold text-on-surface">Event Schedule & Sessions</h3>
                <div className="space-y-2.5">
                  {SESSIONS.map(sess => (
                    <div key={sess.id} className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/40 flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div className="space-y-1">
                        <div className="font-bold text-xs text-on-surface">{sess.title}</div>
                        <p className="text-[11px] text-on-surface-variant">{sess.abstract}</p>
                      </div>
                      <div className="text-right flex-shrink-0 text-[11px] text-secondary font-semibold">
                        <div>{sess.time}</div>
                        <div className="text-on-surface-variant">{sess.room}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: DIGITAL PASS & QR */}
          {activeTab === 'pass' && (
            <div className="space-y-6 text-center">
              {!(isRegistered || justRegistered) ? (
                <div className="p-8 rounded-2xl bg-surface-container-low border border-dashed border-outline-variant/60 space-y-3">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant">lock</span>
                  <h3 className="text-base font-bold text-on-surface">Digital Pass Not Claimed Yet</h3>
                  <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
                    Please click "Confirm Registration" on the Details tab to generate your unique signed QR pass token for venue entry.
                  </p>
                  <button
                    onClick={handleRegisterClick}
                    className="px-5 py-2.5 rounded-xl bg-secondary text-on-secondary font-bold text-xs hover:bg-secondary-container transition-all"
                  >
                    Confirm Registration Now
                  </button>
                </div>
              ) : (
                <div className="max-w-md mx-auto bg-gradient-to-br from-primary-container to-secondary-container text-white p-6 rounded-2xl shadow-xl space-y-5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold tracking-wider">EVENTPASS DIGITAL QR</span>
                    <span className="px-2.5 py-0.5 rounded bg-emerald-500/30 text-emerald-300 font-bold uppercase text-[10px]">
                      CONFIRMED PASS
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-extrabold">{currentUser?.displayName || currentUser?.email || 'Authenticated Attendee'}</h3>
                    <p className="text-xs text-white/80">{currentUser?.email || 'user@thinqsummit.io'}</p>
                  </div>

                  {/* Rendered QR Image & Full Pass Token ID */}
                  <div className="inline-block p-4 bg-white rounded-2xl shadow-2xl border-2 border-white max-w-full text-left">
                    <img src={qrImageUrl} alt="Digital QR Pass" className="w-48 h-48 mx-auto block rounded-lg" />
                    <div className="mt-3 p-2 rounded-xl bg-slate-100 border border-slate-200">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
                        <span>Pass Token ID</span>
                        <button
                          type="button"
                          onClick={() => navigator.clipboard?.writeText(samplePassToken)}
                          className="text-[10px] font-extrabold text-secondary hover:underline uppercase"
                        >
                          Copy
                        </button>
                      </div>
                      <div className="text-[11px] font-mono font-bold text-slate-800 break-all select-all leading-tight max-h-16 overflow-y-auto">
                        {samplePassToken}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/10 text-xs font-semibold flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">schedule</span>
                    <span>Check-in Status: Not yet scanned by Admin</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: POST-ATTENDANCE FEEDBACK */}
          {activeTab === 'feedback' && (
            <div className="space-y-4 max-w-lg mx-auto">
              <h3 className="text-sm font-bold text-on-surface">Submit Event Feedback</h3>
              
              {feedbackSubmitted ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  <span>Thank you! Your feedback rating ({feedbackRating}/5 stars) has been recorded.</span>
                </div>
              ) : (
                <form onSubmit={handleSubmitFeedback} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-on-surface-variant block mb-1">Rating</label>
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
                    <label className="text-xs font-semibold text-on-surface-variant block mb-1">Comments & Insights</label>
                    <textarea
                      rows={3}
                      placeholder="Share your thoughts on sessions, topics, or venue..."
                      value={feedbackComment}
                      onChange={(e) => setFeedbackComment(e.target.value)}
                      className="w-full py-2 px-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-xs text-on-surface"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-secondary text-on-secondary font-bold text-xs hover:bg-secondary-container transition-all"
                  >
                    Submit Feedback
                  </button>
                </form>
              )}
            </div>
          )}

        </div>

        {/* Bottom Footer Actions */}
        <div className="p-4 bg-surface-container-low border-t border-outline-variant/40 flex items-center justify-between flex-shrink-0">
          <div className="text-xs text-on-surface-variant font-medium">
            Event ID: <span className="font-mono text-on-surface">{event.id}</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant text-on-surface text-xs font-semibold hover:bg-surface-container-high"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
