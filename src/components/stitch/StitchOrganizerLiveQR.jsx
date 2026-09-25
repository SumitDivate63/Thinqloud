import React, { useState, useEffect } from 'react';
import { SESSIONS } from '../../data/conferenceData';

export default function StitchOrganizerLiveQR({ onClose }) {
  const [selectedSessionId, setSelectedSessionId] = useState('sess-101');
  const [currentToken, setCurrentToken] = useState(`TOKEN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
  const [tokenTimeLeft, setTokenTimeLeft] = useState(15);
  const [isWindowActive, setIsWindowActive] = useState(true);

  const selectedSession = SESSIONS.find(s => s.id === selectedSessionId) || SESSIONS[0];

  // Live Check-in stream simulation
  const [liveCheckins, setLiveCheckins] = useState([
    { name: 'Dr. Elena Rostova', time: '10:04 AM', token: 'TOKEN-99A8', status: 'VERIFIED' },
    { name: 'Marcus Vance', time: '10:12 AM', token: 'TOKEN-44B1', status: 'VERIFIED' }
  ]);

  // Rotate token every 15s
  useEffect(() => {
    if (!isWindowActive) return;

    const interval = setInterval(() => {
      setTokenTimeLeft(prev => {
        if (prev <= 1) {
          setCurrentToken(`TOKEN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isWindowActive]);

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(`THINQ_ATTENDANCE_${selectedSessionId}_${currentToken}`)}&color=000000&bcolor=f8f9ff`;

  return (
    <div className="w-full bg-background min-h-screen p-4 md:p-8 space-y-6">
      
      {/* Header Utility Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/60 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container text-secondary text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            ORGANIZER LIVE PROJECTED DISPLAY
          </div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight mt-1">Dynamic QR Attendance Controller</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsWindowActive(!isWindowActive)}
            className={`px-4 py-2.5 rounded-lg font-semibold text-sm transition-all shadow-sm flex items-center gap-2 ${
              isWindowActive ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-surface-container-high text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">sensors</span>
            <span>{isWindowActive ? 'Attendance Window ACTIVE' : 'Start Attendance Window'}</span>
          </button>
          
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg bg-surface-container-low border border-outline-variant text-on-surface font-semibold text-sm hover:bg-surface-container-high transition-all"
          >
            Close Controller
          </button>
        </div>
      </div>

      {/* Main Display Grid: Big Projected QR Code vs Live Attendance Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Projected Display Box (8 Cols) */}
        <div className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-8 shadow-lg text-center space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-secondary uppercase tracking-wider">Projected Presentation Screen</span>
            <h2 className="text-xl font-bold text-on-surface">{selectedSession.title}</h2>
            <p className="text-xs text-on-surface-variant">{selectedSession.time} • {selectedSession.room}</p>
          </div>

          {/* QR Code Container */}
          <div className="inline-block p-6 bg-white border-2 border-secondary rounded-2xl shadow-xl relative">
            <img src={qrUrl} alt="Dynamic Attendance QR" className="w-64 h-64 md:w-80 md:h-80 mx-auto block" />
            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between px-2">
              <span className="text-xs font-bold text-slate-600">DYNAMIC SECURITY TOKEN</span>
              <span className="text-base font-mono font-extrabold text-secondary tracking-widest">{currentToken}</span>
            </div>
          </div>

          {/* Token Timer Bar */}
          <div className="max-w-md mx-auto p-4 rounded-xl bg-surface-container-low border border-outline-variant/60 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-on-surface">
              <span className="flex items-center gap-1.5 text-secondary">
                <span className="material-symbols-outlined text-[16px]">timer</span>
                Security Token Rotation
              </span>
              <span className="font-mono text-on-surface">Rotates in <strong className="text-secondary">{tokenTimeLeft}s</strong></span>
            </div>
            <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
              <div
                className="h-full bg-secondary transition-all duration-1000 ease-linear"
                style={{ width: `${(tokenTimeLeft / 15) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Live Attendance Feed (5 Cols) */}
        <div className="lg:col-span-5 bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3">
            <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600 text-[20px]">how_to_reg</span>
              <span>Live Attendance Feed ({liveCheckins.length})</span>
            </h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Real-time Firestore Sync
            </span>
          </div>

          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {liveCheckins.map((chk, i) => (
              <div key={i} className="p-3.5 rounded-lg bg-surface-container-low border border-outline-variant/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-secondary-container text-on-secondary-container font-bold flex items-center justify-center text-xs">
                    {chk.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-on-surface">{chk.name}</div>
                    <div className="text-[11px] text-on-surface-variant font-mono">Token: {chk.token}</div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase">
                    VERIFIED
                  </span>
                  <div className="text-[10px] text-on-surface-variant mt-0.5 font-mono">{chk.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
