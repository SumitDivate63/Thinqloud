import React, { useState, useEffect, useMemo } from 'react';
import { SESSIONS, SPEAKERS } from '../../data/conferenceData';
import { db } from '../../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import {
  buildPassToken,
  registerUserForEvent,
  submitEventFeedback,
  getEventRegistrationCount
} from '../../lib/eventOps';

export default function EventDetailsAndPassModal({ event, isOpen, onClose, isRegistered, currentUser, onRequireAuth }) {
  const [activeTab, setActiveTab] = useState(isRegistered ? 'pass' : 'details'); // 'details' | 'pass' | 'feedback'
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackError, setFeedbackError] = useState('');

  const [justRegistered, setJustRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [registerError, setRegisterError] = useState('');

  const [attendanceRecord, setAttendanceRecord] = useState(null);
  const [liveRegisteredCount, setLiveRegisteredCount] = useState(null);

  const registered = isRegistered || justRegistered;

  // Live registration count for the capacity display (replaces the hardcoded fallback number)
  useEffect(() => {
    if (!event) return;
    let cancelled = false;
    getEventRegistrationCount(event.id).then((count) => {
      if (!cancelled) setLiveRegisteredCount(count);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [event, registered]);

  // Live attendance status once registered, so feedback unlocks the moment the admin scans this attendee in
  useEffect(() => {
    if (!currentUser || !event || !registered) {
      setAttendanceRecord(null);
      return;
    }
    const attRef = doc(db, 'attendance', `${currentUser.uid}_${event.id}`);
    const unsub = onSnapshot(attRef, (snap) => {
      setAttendanceRecord(snap.exists() ? snap.data() : null);
    }, () => setAttendanceRecord(null));
    return () => unsub();
  }, [currentUser, event, registered]);

  const passToken = useMemo(() => {
    if (!currentUser || !event) return null;
    const registrationId = `${currentUser.uid}_${event.id}`;
    return buildPassToken({ uid: currentUser.uid, eventId: event.id, registrationId });
  }, [currentUser, event]);

  if (!isOpen || !event) return null;

  const handleRegisterClick = async () => {
    if (!currentUser) {
      onRequireAuth?.();
      return;
    }
    setRegistering(true);
    setRegisterError('');
    try {
      await registerUserForEvent(currentUser, event);
      setJustRegistered(true);
      setActiveTab('pass');
    } catch (err) {
      setRegisterError(err.message || 'Registration failed. Please try again.');
    } finally {
      setRegistering(false);
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      onRequireAuth?.();
      return;
    }
    setFeedbackSubmitting(true);
    setFeedbackError('');
    try {
      await submitEventFeedback({ uid: currentUser.uid, eventId: event.id, rating: feedbackRating, comment: feedbackComment });
      setFeedbackSubmitted(true);
    } catch (err) {
      setFeedbackError(err.message || 'Could not submit feedback. Please try again.');
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  const qrImageUrl = passToken
    ? `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(passToken)}`
    : null;

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
            <span>Details</span>
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
            <span>Digital Pass</span>
            {registered && (
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
              {registered ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-600 text-[20px]">check_circle</span>
                    <span>You're registered. Your pass is ready.</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('pass')}
                    className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700"
                  >
                    View Pass
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-on-surface">Registration Open</div>
                      <div className="text-[11px] text-on-surface-variant">
                        {liveRegisteredCount ?? event.registeredCount ?? 0} / {event.capacity} registered
                      </div>
                    </div>
                    <button
                      onClick={handleRegisterClick}
                      disabled={registering}
                      className="px-5 py-2.5 rounded-xl bg-secondary text-on-secondary font-bold text-xs hover:bg-secondary-container transition-all shadow-md flex items-center gap-2 disabled:opacity-60"
                    >
                      <span className="material-symbols-outlined text-[18px]">badge</span>
                      <span>{registering ? 'Registering…' : currentUser ? 'Register' : 'Sign In to Register'}</span>
                    </button>
                  </div>
                  {registerError && (
                    <p className="text-[11px] text-rose-600 font-semibold">{registerError}</p>
                  )}
                </div>
              )}

              {/* Event Description */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-on-surface">About</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {event.description || 'Join us for sessions, speakers, and networking.'}
                </p>
              </div>

              {/* Keynote Speakers */}
              <div className="space-y-3 pt-3 border-t border-outline-variant/40">
                <h3 className="text-sm font-bold text-on-surface">Featured Speakers</h3>
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
                <h3 className="text-sm font-bold text-on-surface">Schedule</h3>
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
              {!registered ? (
                <div className="p-8 rounded-2xl bg-surface-container-low border border-dashed border-outline-variant/60 space-y-3">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant">lock</span>
                  <h3 className="text-base font-bold text-on-surface">No Pass Yet</h3>
                  <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
                    Register on the Details tab to get your QR pass for venue entry.
                  </p>
                  <button
                    onClick={handleRegisterClick}
                    disabled={registering}
                    className="px-5 py-2.5 rounded-xl bg-secondary text-on-secondary font-bold text-xs hover:bg-secondary-container transition-all disabled:opacity-60"
                  >
                    {registering ? 'Registering…' : currentUser ? 'Register Now' : 'Sign In to Register'}
                  </button>
                </div>
              ) : (
                <div className="max-w-md mx-auto bg-gradient-to-br from-primary-container to-secondary-container text-white p-6 rounded-2xl shadow-xl space-y-5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold tracking-wider">DIGITAL PASS</span>
                    <span className="px-2.5 py-0.5 rounded bg-emerald-500/30 text-emerald-300 font-bold uppercase text-[10px]">
                      CONFIRMED
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-extrabold">{currentUser?.displayName || currentUser?.email}</h3>
                    <p className="text-xs text-white/80">{currentUser?.email}</p>
                  </div>

                  {/* Rendered QR Image & Full Pass Token ID */}
                  <div className="inline-block p-4 bg-white rounded-2xl shadow-2xl border-2 border-white max-w-full text-left">
                    <img src={qrImageUrl} alt="Digital QR Pass" className="w-48 h-48 mx-auto block rounded-lg" />
                    <div className="mt-3 p-2 rounded-xl bg-slate-100 border border-slate-200">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
                        <span>Pass Token</span>
                        <button
                          type="button"
                          onClick={() => navigator.clipboard?.writeText(passToken)}
                          className="text-[10px] font-extrabold text-secondary hover:underline uppercase"
                        >
                          Copy
                        </button>
                      </div>
                      <div className="text-[11px] font-mono font-bold text-slate-800 break-all select-all leading-tight max-h-16 overflow-y-auto">
                        {passToken}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/10 text-xs font-semibold flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">
                      {attendanceRecord ? 'check_circle' : 'schedule'}
                    </span>
                    <span>{attendanceRecord ? 'Checked in' : 'Not yet scanned by admin'}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: POST-ATTENDANCE FEEDBACK */}
          {activeTab === 'feedback' && (
            <div className="space-y-4 max-w-lg mx-auto">
              <h3 className="text-sm font-bold text-on-surface">Feedback</h3>

              {!registered ? (
                <div className="p-4 rounded-xl bg-surface-container-low text-xs text-on-surface-variant leading-relaxed">
                  Register and attend the event to unlock feedback.
                </div>
              ) : !attendanceRecord ? (
                <div className="p-4 rounded-xl bg-surface-container-low text-xs text-on-surface-variant leading-relaxed">
                  Feedback unlocks after the admin scans your pass at the event.
                </div>
              ) : feedbackSubmitted ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  <span>Thanks! Your feedback ({feedbackRating}/5) has been recorded.</span>
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
                    <label className="text-xs font-semibold text-on-surface-variant block mb-1">Comments</label>
                    <textarea
                      rows={3}
                      placeholder="Share your thoughts..."
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
                    className="w-full py-2.5 rounded-xl bg-secondary text-on-secondary font-bold text-xs hover:bg-secondary-container transition-all disabled:opacity-60"
                  >
                    {feedbackSubmitting ? 'Submitting…' : 'Submit Feedback'}
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
