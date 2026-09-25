import React, { useState } from 'react';
import { SESSIONS } from '../../data/conferenceData';

export default function StitchOrganizerDashboard({ onLaunchLiveQR, onCreateEvent }) {
  const [selectedTab, setSelectedTab] = useState('overview');

  const registeredAttendees = [
    { name: 'Dr. Elena Rostova', email: 'elena@deepmind.io', pass: 'VIP Founder', registeredAt: '10:04 AM', status: 'Verified' },
    { name: 'Marcus Vance', email: 'marcus@thinqcloud.io', pass: 'VIP Founder', registeredAt: '10:12 AM', status: 'Verified' },
    { name: 'Sarah Jenkins', email: 'sarah@vercel.com', pass: 'Standard Pass', registeredAt: '10:20 AM', status: 'Pending QR' },
    { name: 'Aarav Sharma', email: 'aarav@shieldcorp.io', pass: 'Standard Pass', registeredAt: '10:35 AM', status: 'Verified' }
  ];

  return (
    <div className="w-full bg-background min-h-screen p-4 md:p-8 space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/60 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-secondary text-xs font-semibold">ORGANIZER CONSOLE</span>
            <span className="text-xs text-on-surface-variant">• Event Operational Controls</span>
          </div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight mt-1">ThinqSummit 2026 Operations Console</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onLaunchLiveQR}
            className="px-4 py-2.5 rounded-lg bg-secondary text-on-secondary font-semibold text-sm hover:bg-secondary-container transition-all shadow-md flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
            <span>Launch Live Dynamic QR Controller</span>
          </button>
          <button
            onClick={onCreateEvent}
            className="px-4 py-2.5 rounded-lg bg-surface-container-low border border-outline-variant text-on-surface font-semibold text-sm hover:bg-surface-container-high transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Create New Event</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Event Registrations', val: '5,420', sub: '92% of Total Capacity', icon: 'how_to_reg', color: 'text-secondary' },
          { label: 'Verified QR Attendance Rate', val: '98.4%', sub: 'Real-time Security Tokens', icon: 'qr_code_scanner', color: 'text-emerald-600' },
          { label: 'Active Live Streams', val: '4 Stages', sub: '1080p 60fps Broadcast', icon: 'sensors', color: 'text-purple-600' },
          { label: 'Average Feedback Rating', val: '4.92 / 5.0', sub: '1,420 Rating Responses', icon: 'star', color: 'text-amber-500' }
        ].map((m, idx) => (
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

      {/* Main Grid: Active Sessions vs Registrations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Sessions List */}
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3">
            <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[20px]">event_seat</span>
              <span>Sessions & Rooms</span>
            </h3>
            <span className="text-xs text-on-surface-variant">{SESSIONS.length} Sessions</span>
          </div>

          <div className="space-y-3">
            {SESSIONS.slice(0, 5).map(sess => (
              <div key={sess.id} className="p-3.5 rounded-lg bg-surface-container-low border border-outline-variant/40 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-xs text-on-surface">{sess.title}</div>
                  <div className="text-[11px] text-on-surface-variant mt-0.5">{sess.time} • {sess.room}</div>
                </div>
                <button
                  onClick={onLaunchLiveQR}
                  className="px-2.5 py-1 rounded bg-secondary text-on-secondary text-[11px] font-bold"
                >
                  Start QR
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Registered Attendees Table */}
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3">
            <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[20px]">group</span>
              <span>Recent Registrations & Attendance Logs</span>
            </h3>
            <span className="text-xs text-secondary font-semibold cursor-pointer">View All Logs</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-on-surface">
              <thead>
                <tr className="border-b border-outline-variant/40 text-on-surface-variant font-semibold">
                  <th className="py-2.5 px-3">Participant</th>
                  <th className="py-2.5 px-3">Access Pass</th>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3 text-right">QR Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {registeredAttendees.map((att, i) => (
                  <tr key={i} className="hover:bg-surface-container-low/50">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-on-surface">{att.name}</div>
                      <div className="text-[11px] text-on-surface-variant">{att.email}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-surface-container text-secondary font-medium text-[11px]">
                        {att.pass}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-on-surface-variant font-mono">{att.registeredAt}</td>
                    <td className="py-3 px-3 text-right">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold ${
                        att.status === 'Verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        <span className="material-symbols-outlined text-[12px]">
                          {att.status === 'Verified' ? 'check_circle' : 'pending'}
                        </span>
                        {att.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
