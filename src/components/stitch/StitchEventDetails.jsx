import React from 'react';
import { SESSIONS, SPEAKERS } from '../../data/conferenceData';

export default function StitchEventDetails({ eventId, onBack, onRegister }) {
  return (
    <div className="w-full bg-background min-h-screen p-4 md:p-8 space-y-6">
      
      {/* Back Button & Title Bar */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-1 text-sm font-semibold text-secondary hover:underline">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back to Event Discovery</span>
        </button>

        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase">
          Registration Active
        </span>
      </div>

      {/* Main Banner Header */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg border border-outline-variant/60 h-64 md:h-80">
        <img
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80"
          alt="ThinqSummit 2026"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-on-surface/90 via-on-surface/40 to-transparent p-6 md:p-8 flex flex-col justify-end text-on-primary">
          <span className="text-xs font-bold text-secondary-fixed uppercase tracking-wider">Enterprise Tech & AI Flagship</span>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight mt-1">ThinqSummit 2026: Global Cloud & AI Architecture</h1>
          <p className="text-xs md:text-sm text-white/80 mt-1">November 12 - 14, 2026 • Moscone Center South, San Francisco & Virtual Stream</p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Details (8 Cols) */}
        <div className="lg:col-span-8 bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-6 shadow-sm space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-on-surface">About the Event</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Join 8,500+ senior cloud architects, AI engineers, and technology leaders for 3 days of deep-dive keynotes, hands-on workshops, and zero-trust security strategy. Powered by automated Google OAuth registration, dynamic QR attendance verification, and live analytics.
            </p>
          </div>

          {/* Speakers Row */}
          <div className="space-y-3 pt-4 border-t border-outline-variant/40">
            <h3 className="text-base font-bold text-on-surface">Keynote Speakers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SPEAKERS.slice(0, 4).map(spk => (
                <div key={spk.id} className="p-3.5 rounded-lg bg-surface-container-low border border-outline-variant/40 flex items-center gap-3">
                  <img src={spk.avatar} alt={spk.name} className="w-12 h-12 rounded-full object-cover border border-secondary" />
                  <div>
                    <div className="font-bold text-sm text-on-surface">{spk.name}</div>
                    <div className="text-xs text-secondary font-medium">{spk.role}</div>
                    <div className="text-[11px] text-on-surface-variant">{spk.company}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Schedule Sessions */}
          <div className="space-y-3 pt-4 border-t border-outline-variant/40">
            <h3 className="text-base font-bold text-on-surface">Session Schedule</h3>
            <div className="space-y-3">
              {SESSIONS.slice(0, 4).map(sess => (
                <div key={sess.id} className="p-4 rounded-lg bg-surface-container-low border border-outline-variant/40 flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-on-surface">{sess.title}</h4>
                    <p className="text-xs text-on-surface-variant line-clamp-1">{sess.abstract}</p>
                    <div className="flex items-center gap-3 text-xs text-secondary font-medium pt-1">
                      <span>{sess.time}</span>
                      <span>•</span>
                      <span>{sess.room}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Registration Sidebar (4 Cols) */}
        <div className="lg:col-span-4 bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-6 shadow-md space-y-6 sticky top-24">
          <div className="space-y-1">
            <span className="text-xs font-bold text-on-surface-variant uppercase">Capacity Status</span>
            <div className="text-2xl font-bold text-on-surface font-mono">5,420 / 8,500</div>
            <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden mt-2">
              <div className="h-full bg-secondary w-[64%]" />
            </div>
            <p className="text-[11px] text-on-surface-variant pt-1">64% Capacity Filled • Registration Open</p>
          </div>

          <button
            onClick={onRegister}
            className="w-full py-3 rounded-lg bg-secondary text-on-secondary font-bold text-sm hover:bg-secondary-container transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">badge</span>
            <span>Claim Access Pass</span>
          </button>
        </div>

      </div>

    </div>
  );
}
