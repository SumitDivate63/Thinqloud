import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, where, orderBy, limit, onSnapshot, getDocs } from 'firebase/firestore';

export default function StitchOrganizerDashboard({ events = [], onLaunchLiveQR, onCreateEvent, onEditEvent }) {
  const [totals, setTotals] = useState({ registrations: 0, attendance: 0, feedbackCount: 0, avgRating: null });
  const [recentRegistrations, setRecentRegistrations] = useState([]);
  const [feedbackEventId, setFeedbackEventId] = useState('');
  const [feedbackList, setFeedbackList] = useState([]);

  useEffect(() => {
    let cancelled = false;
    async function loadTotals() {
      try {
        // Plain getDocs() (not count() aggregation) - aggregation queries
        // can't evaluate rules that depend on document contents, which the
        // owner-check on these collections does. A regular query is
        // evaluated per-document instead, so it works fine for the admin.
        const [regSnap, attSnap, fbSnap] = await Promise.all([
          getDocs(collection(db, 'registrations')),
          getDocs(collection(db, 'attendance')),
          getDocs(collection(db, 'feedback'))
        ]);
        if (cancelled) return;
        setTotals(prev => ({
          ...prev,
          registrations: regSnap.size,
          attendance: attSnap.size,
          feedbackCount: fbSnap.size
        }));
      } catch (err) {
        console.warn('Dashboard totals unavailable:', err);
      }
    }
    loadTotals();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'registrations'), orderBy('registeredAt', 'desc'), limit(6));
    const unsub = onSnapshot(q, (snapshot) => {
      setRecentRegistrations(snapshot.docs.map(d => d.data()));
    }, () => setRecentRegistrations([]));
    return () => unsub();
  }, []);

  // Feedback for a single event (filtered) or the most recent across all
  // events (no filter selected). The per-event query sorts client-side
  // instead of using orderBy() so it doesn't need a composite index
  // (where(eventId) + orderBy(submittedAt) on different fields requires one).
  useEffect(() => {
    const q = feedbackEventId
      ? query(collection(db, 'feedback'), where('eventId', '==', feedbackEventId))
      : query(collection(db, 'feedback'), orderBy('submittedAt', 'desc'), limit(10));
    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(d => d.data());
      if (feedbackEventId) {
        list.sort((a, b) => (b.submittedAt?.toMillis?.() || 0) - (a.submittedAt?.toMillis?.() || 0));
      }
      setFeedbackList(list);
    }, () => setFeedbackList([]));
    return () => unsub();
  }, [feedbackEventId]);

  const attendanceRate = totals.registrations > 0
    ? Math.round((totals.attendance / totals.registrations) * 100)
    : 0;

  const feedbackAvgRating = feedbackList.length > 0
    ? (feedbackList.reduce((sum, fb) => sum + (Number(fb.rating) || 0), 0) / feedbackList.length).toFixed(1)
    : null;

  const eventTitleById = events.reduce((acc, ev) => {
    acc[ev.id] = ev.title;
    return acc;
  }, {});

  const metrics = [
    { label: 'Total Registrations', val: totals.registrations.toLocaleString(), sub: `Across ${events.length} event(s)`, icon: 'how_to_reg', color: 'text-secondary' },
    { label: 'QR Attendance Rate', val: `${attendanceRate}%`, sub: `${totals.attendance} checked in`, icon: 'qr_code_scanner', color: 'text-emerald-600' },
    { label: 'Feedback Responses', val: totals.feedbackCount.toLocaleString(), sub: 'Submitted after attendance', icon: 'star', color: 'text-amber-500' }
  ];

  return (
    <div className="w-full bg-background min-h-screen p-4 md:p-8 space-y-6">

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/60 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-secondary text-xs font-semibold">ADMIN CONSOLE</span>
          </div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight mt-1">Event Operations</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onLaunchLiveQR}
            className="px-4 py-2.5 rounded-lg bg-secondary text-on-secondary font-semibold text-sm hover:bg-secondary-container transition-all shadow-md flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
            <span>Open Scanner</span>
          </button>
          <button
            onClick={onCreateEvent}
            className="px-4 py-2.5 rounded-lg bg-surface-container-low border border-outline-variant text-on-surface font-semibold text-sm hover:bg-surface-container-high transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Create Event</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((m, idx) => (
          <div key={idx} className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="text-xs font-semibold">{m.label}</span>
              <span className={`material-symbols-outlined text-[20px] ${m.color}`}>{m.icon}</span>
            </div>
            <div className="text-2xl font-bold text-on-surface font-mono">{m.val}</div>
            <div className="text-xs text-on-surface-variant">{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Main Grid: Events vs Recent Registrations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Events List */}
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3">
            <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[20px]">event_seat</span>
              <span>Events</span>
            </h3>
            <span className="text-xs text-on-surface-variant">{events.length}</span>
          </div>

          <div className="space-y-3">
            {events.length === 0 && (
              <div className="text-xs text-on-surface-variant text-center py-4">No events yet. Create one to get started.</div>
            )}
            {events.slice(0, 6).map(ev => (
              <div key={ev.id} className="p-3.5 rounded-lg bg-surface-container-low border border-outline-variant/40 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-semibold text-xs text-on-surface line-clamp-1">{ev.title}</div>
                  <div className="text-[11px] text-on-surface-variant mt-0.5">Capacity {ev.capacity}</div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => onEditEvent?.(ev)}
                    className="px-2.5 py-1 rounded bg-surface-container-lowest border border-outline-variant text-on-surface text-[11px] font-bold hover:bg-surface-container-high"
                  >
                    Edit
                  </button>
                  <button
                    onClick={onLaunchLiveQR}
                    className="px-2.5 py-1 rounded bg-secondary text-on-secondary text-[11px] font-bold"
                  >
                    Scan
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Registrations Table */}
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3">
            <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[20px]">group</span>
              <span>Recent Registrations</span>
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-on-surface">
              <thead>
                <tr className="border-b border-outline-variant/40 text-on-surface-variant font-semibold">
                  <th className="py-2.5 px-3">Participant</th>
                  <th className="py-2.5 px-3">Event</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {recentRegistrations.length === 0 && (
                  <tr>
                    <td colSpan={2} className="py-6 text-center text-on-surface-variant">No registrations yet.</td>
                  </tr>
                )}
                {recentRegistrations.map((reg, i) => (
                  <tr key={i} className="hover:bg-surface-container-low/50">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-on-surface">{reg.userName}</div>
                      <div className="text-[11px] text-on-surface-variant">{reg.userEmail}</div>
                    </td>
                    <td className="py-3 px-3 text-on-surface-variant">
                      {eventTitleById[reg.eventId] || reg.eventId}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Feedback Panel */}
      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-outline-variant/40 pb-3">
          <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-500 text-[20px]">rate_review</span>
            <span>Feedback</span>
            {feedbackAvgRating && (
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[11px] font-bold">
                {feedbackAvgRating} / 5 avg
              </span>
            )}
          </h3>

          <select
            value={feedbackEventId}
            onChange={(e) => setFeedbackEventId(e.target.value)}
            className="w-full md:w-64 px-3 py-1.5 bg-surface-container-low border border-outline-variant/60 rounded-lg text-xs text-on-surface font-semibold"
          >
            <option value="">All Events (recent)</option>
            {events.map(ev => (
              <option key={ev.id} value={ev.id}>{ev.title}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
          {feedbackList.length === 0 && (
            <div className="text-xs text-on-surface-variant text-center py-6">No feedback submitted yet.</div>
          )}
          {feedbackList.map((fb, i) => (
            <div key={i} className="p-3.5 rounded-lg bg-surface-container-low border border-outline-variant/40 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 text-amber-500 text-sm">
                  {'★'.repeat(Number(fb.rating) || 0)}
                  <span className="text-on-surface-variant text-[11px] font-semibold ml-1">({fb.rating}/5)</span>
                </div>
                {!feedbackEventId && (
                  <span className="text-[11px] text-secondary font-semibold">{eventTitleById[fb.eventId] || fb.eventId}</span>
                )}
              </div>
              {fb.comment && (
                <p className="text-xs text-on-surface leading-relaxed">{fb.comment}</p>
              )}
              <p className="text-[11px] text-on-surface-variant">{fb.userEmail}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
