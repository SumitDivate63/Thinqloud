import React from 'react';
import { SESSIONS } from '../../data/conferenceData';

export default function StitchParticipantDashboard({ currentUser, onOpenQRScanner, bookmarks, onRemoveBookmark }) {
  const registeredSessions = SESSIONS.filter(s => bookmarks.includes(s.id));

  return (
    <div className="w-full bg-background min-h-screen p-4 md:p-8 space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/60 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container text-secondary text-xs font-semibold">
            <span className="material-symbols-outlined text-[14px]">badge</span>
            PARTICIPANT DASHBOARD & DIGITAL PASS
          </div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight mt-1">
            Welcome, {currentUser?.displayName || currentUser?.email || 'Authenticated Attendee'}
          </h1>
        </div>

        <button
          onClick={onOpenQRScanner}
          className="px-5 py-2.5 rounded-lg bg-secondary text-on-secondary font-semibold text-sm hover:bg-secondary-container transition-all shadow-md flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">qr_code_scanner</span>
          <span>Scan Attendance QR Code</span>
        </button>
      </div>

      {/* Main Grid: Digital Pass Card vs Agenda Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Badge Pass Card (5 Cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-primary-container to-secondary-container text-on-secondary rounded-2xl p-6 shadow-xl space-y-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[24px]">calendar_today</span>
              <span className="text-lg font-extrabold tracking-tight">EventHub Pass</span>
            </div>
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
              {currentUser?.passType ? currentUser.passType.toUpperCase() : 'VIP ACCESS'}
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-white/70 uppercase tracking-wider font-semibold">Official Attendee</div>
            <h2 className="text-2xl font-extrabold text-white">{currentUser?.displayName || currentUser?.email || 'Jane Doe'}</h2>
            <p className="text-xs text-white/80">{currentUser?.email || 'attendee@thinqsummit.io'}</p>
          </div>

          <div className="pt-4 border-t border-white/20 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-white/70 uppercase">BADGE IDENTIFIER</div>
              <div className="text-xs font-mono font-bold text-white">TS26-PASS-99482</div>
            </div>

            <div className="bg-white p-2 rounded-lg">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=THINQ_PASS_${currentUser?.uid || 'GUEST'}`}
                alt="Digital Pass QR"
                className="w-16 h-16 block"
              />
            </div>
          </div>
        </div>

        {/* Right Registered Schedule List (7 Cols) */}
        <div className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3">
            <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[20px]">bookmark</span>
              <span>Saved Agenda & Sessions ({registeredSessions.length})</span>
            </h3>
          </div>

          {registeredSessions.length === 0 ? (
            <div className="p-8 text-center text-on-surface-variant text-sm">
              You haven't saved any sessions yet. Browse the schedule to build your agenda!
            </div>
          ) : (
            <div className="space-y-3">
              {registeredSessions.map(sess => (
                <div key={sess.id} className="p-4 rounded-lg bg-surface-container-low border border-outline-variant/40 flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-on-surface">{sess.title}</h4>
                    <div className="flex items-center gap-3 text-xs text-on-surface-variant">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-secondary">schedule</span>
                        {sess.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-secondary">location_on</span>
                        {sess.room}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveBookmark(sess.id)}
                    className="px-3 py-1.5 rounded bg-surface-container text-on-surface-variant hover:text-error text-xs font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
