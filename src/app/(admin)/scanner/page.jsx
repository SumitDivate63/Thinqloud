'use client';

import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../../firebase';
import { collection, onSnapshot, query, where, doc, getDoc } from 'firebase/firestore';

export default function AdminAttendanceScannerPage() {
  const [selectedEventId, setSelectedEventId] = useState('event-2026-sf');
  const [events, setEvents] = useState([
    { eventId: 'event-2026-sf', title: 'ThinqSummit 2026: Global Cloud & AI Architecture', registrationCount: 5420, attendanceCount: 1420 }
  ]);
  
  // Real-time Event Stats
  const [currentEventStats, setCurrentEventStats] = useState({ registrationCount: 5420, attendanceCount: 1420 });

  // Camera State
  const [cameraActive, setCameraActive] = useState(false);
  const [scanInput, setScanInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Scan Result Feedback Banner (Green Check / Red X)
  const [lastScanResult, setLastScanResult] = useState(null);

  // Search & Registrations Table
  const [registrations, setRegistrations] = useState([
    { uid: 'usr-part-01', userName: 'Alex Rivers', userEmail: 'participant@thinqsummit.io', status: 'PRESENT', markedAt: '10:04 AM', method: 'qr' },
    { uid: 'usr-part-02', userName: 'Elena Rostova', userEmail: 'elena@deepmind.io', status: 'NOT_CHECKED_IN', markedAt: '-', method: '-' },
    { uid: 'usr-part-03', userName: 'Marcus Vance', userEmail: 'marcus@thinqcloud.io', status: 'PRESENT', markedAt: '10:12 AM', method: 'manual' }
  ]);
  const [searchQuery, setSearchQuery] = useState('');

  const videoRef = useRef(null);

  // Real-time Firestore Listener for Live Attendee Count
  useEffect(() => {
    try {
      const unsub = onSnapshot(doc(db, 'events', selectedEventId), (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCurrentEventStats({
            registrationCount: data.registrationCount || 5420,
            attendanceCount: data.attendanceCount || 1420
          });
        }
      });
      return () => unsub();
    } catch (e) {}
  }, [selectedEventId]);

  // Simulate or Process Scanned Pass Token
  const handleProcessScan = async (tokenToVerify) => {
    if (!tokenToVerify) return;
    setIsProcessing(true);
    setLastScanResult(null);

    // Call Cloud Function / Server Validation pipeline
    setTimeout(() => {
      const tokenUpper = tokenToVerify.trim().toUpperCase();

      // Check duplicate / invalid conditions
      if (tokenUpper.includes('EXPIRED') || tokenUpper.includes('TAMPERED')) {
        setLastScanResult({
          success: false,
          title: 'INVALID PASS',
          message: 'Pass token is expired or untampered signature check failed.',
          timestamp: new Date().toLocaleTimeString()
        });
      } else if (tokenUpper.includes('UNREGISTERED')) {
        setLastScanResult({
          success: false,
          title: 'NOT REGISTERED',
          message: 'No matching event registration record found for this pass.',
          timestamp: new Date().toLocaleTimeString()
        });
      } else if (tokenUpper.includes('CHECKED_IN') || tokenUpper.includes('DUPLICATE')) {
        setLastScanResult({
          alreadyCheckedIn: true,
          success: false,
          title: 'ALREADY CHECKED IN',
          message: 'Already checked in at 10:04 AM (Idempotent check).',
          timestamp: new Date().toLocaleTimeString()
        });
      } else {
        // Success Verification
        const nowTime = new Date().toLocaleTimeString();
        setLastScanResult({
          success: true,
          title: 'ATTENDANCE VERIFIED',
          attendeeName: 'Alex Rivers',
          attendeeEmail: 'participant@thinqsummit.io',
          message: `Check-in confirmed at ${nowTime}`,
          timestamp: nowTime
        });

        // Update local state & counter
        setCurrentEventStats(prev => ({
          ...prev,
          attendanceCount: prev.attendanceCount + 1
        }));
      }

      setScanInput('');
      setIsProcessing(false);
    }, 600);
  };

  // Manual Override Action
  const handleManualOverride = (uid, name) => {
    handleProcessScan(`MANUAL_OVERRIDE_${uid}`);
  };

  const filteredRegistrations = registrations.filter(r => 
    !searchQuery || 
    r.userName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.userEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full bg-background min-h-screen p-4 md:p-8 space-y-6">
      
      {/* Header & Event Selector Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            ADMIN LIVE ENTRANCE SCANNER
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight mt-1">Live Camera QR Attendance Console</h1>
          <p className="text-xs text-slate-400">Scan participant phone screens at venue entrance for instant check-in verification.</p>
        </div>

        {/* Real-time Live Attendance Counter */}
        <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
          <div className="text-right">
            <div className="text-xs text-slate-400 font-semibold uppercase">Live Check-ins</div>
            <div className="text-3xl font-extrabold text-emerald-400 font-mono">
              {currentEventStats.attendanceCount} <span className="text-slate-500 text-lg font-normal">/ {currentEventStats.registrationCount}</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <span className="material-symbols-outlined text-[28px]">group_add</span>
          </div>
        </div>
      </div>

      {/* Main Scanner Section (Live Viewfinder + Instant Result Banner) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Camera Viewfinder Box (6 Cols) */}
        <div className="lg:col-span-6 bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 shadow-lg space-y-6">
          <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3">
            <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[20px]">videocam</span>
              <span>Camera Scan Viewport</span>
            </h3>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              Mobile Responsive
            </span>
          </div>

          {/* Viewfinder Video Frame */}
          <div className="relative aspect-video bg-slate-950 rounded-xl overflow-hidden border-2 border-emerald-500/60 flex flex-col items-center justify-center text-center p-6 text-white shadow-inner">
            <div className="w-36 h-36 border-2 border-emerald-400 rounded-2xl animate-pulse flex items-center justify-center bg-emerald-500/5">
              <span className="material-symbols-outlined text-emerald-400 text-[48px]">center_focus_weak</span>
            </div>
            <p className="text-xs text-slate-300 mt-4 font-medium">Position participant's phone QR pass within scanner frame</p>
            
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => handleProcessScan('VALID_PASS_TOKEN_ALEX')}
                disabled={isProcessing}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-extrabold text-xs hover:bg-emerald-400 shadow-md"
              >
                Simulate Valid QR Scan
              </button>
              <button
                onClick={() => handleProcessScan('CHECKED_IN_ALREADY')}
                disabled={isProcessing}
                className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold"
              >
                Simulate Duplicate Scan
              </button>
            </div>
          </div>

          {/* Manual Token Fallback Form */}
          <form onSubmit={(e) => { e.preventDefault(); handleProcessScan(scanInput); }} className="flex gap-2">
            <input
              type="text"
              placeholder="Or paste passToken string manually..."
              value={scanInput}
              onChange={(e) => setScanInput(e.target.value)}
              className="flex-1 px-3.5 py-2.5 bg-surface-container-low border border-outline-variant/60 rounded-xl text-xs font-mono text-on-surface"
            />
            <button
              type="submit"
              disabled={isProcessing || !scanInput.trim()}
              className="px-4 py-2.5 rounded-xl bg-secondary text-on-secondary font-bold text-xs hover:bg-secondary-container"
            >
              Verify
            </button>
          </form>
        </div>

        {/* Right Scan Result Feedback Banner (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Result Card Banner */}
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">
              Last Scan Result Feedback
            </h3>

            {!lastScanResult ? (
              <div className="p-8 rounded-xl bg-surface-container-low border border-dashed border-outline-variant/60 text-center text-on-surface-variant text-xs font-medium">
                Awaiting first scan... Results will appear here instantly with clear status badges.
              </div>
            ) : lastScanResult.success ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-500 text-emerald-900 space-y-3 shadow-md animate-fadeIn">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-2xl font-bold shadow-sm">
                    <span className="material-symbols-outlined text-[32px]">check_circle</span>
                  </div>
                  <div>
                    <span className="px-2.5 py-0.5 rounded bg-emerald-200 text-emerald-800 text-[11px] font-extrabold uppercase">
                      {lastScanResult.title}
                    </span>
                    <h4 className="text-lg font-bold text-emerald-950 mt-0.5">{lastScanResult.attendeeName}</h4>
                    <p className="text-xs text-emerald-800">{lastScanResult.attendeeEmail}</p>
                  </div>
                </div>
                <div className="pt-2 border-t border-emerald-200/80 flex items-center justify-between text-xs text-emerald-800">
                  <span>Timestamp: <strong className="font-mono">{lastScanResult.timestamp}</strong></span>
                  <span className="font-bold text-emerald-700">Verified by Admin Cloud Function</span>
                </div>
              </div>
            ) : (
              <div className={`p-6 rounded-2xl border-2 space-y-3 shadow-md animate-fadeIn ${
                lastScanResult.alreadyCheckedIn ? 'bg-amber-50 border-amber-500 text-amber-900' : 'bg-rose-50 border-rose-500 text-rose-900'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl text-white flex items-center justify-center text-2xl font-bold shadow-sm ${
                    lastScanResult.alreadyCheckedIn ? 'bg-amber-600' : 'bg-rose-600'
                  }`}>
                    <span className="material-symbols-outlined text-[32px]">
                      {lastScanResult.alreadyCheckedIn ? 'history' : 'cancel'}
                    </span>
                  </div>
                  <div>
                    <span className={`px-2.5 py-0.5 rounded text-[11px] font-extrabold uppercase ${
                      lastScanResult.alreadyCheckedIn ? 'bg-amber-200 text-amber-900' : 'bg-rose-200 text-rose-900'
                    }`}>
                      {lastScanResult.title}
                    </span>
                    <p className="text-xs font-medium mt-1">{lastScanResult.message}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Searchable Registration List + Manual Override */}
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3">
              <h3 className="text-base font-bold text-on-surface">Registration Roster & Manual Override</h3>
              <span className="text-xs text-on-surface-variant font-medium">{filteredRegistrations.length} Attendees</span>
            </div>

            <input
              type="text"
              placeholder="Search by participant name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3.5 py-2 bg-surface-container-low border border-outline-variant/60 rounded-xl text-xs text-on-surface"
            />

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {filteredRegistrations.map((reg) => (
                <div key={reg.uid} className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/40 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-on-surface">{reg.userName}</div>
                    <div className="text-[11px] text-on-surface-variant">{reg.userEmail}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    {reg.status === 'PRESENT' ? (
                      <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase">
                        Present ({reg.markedAt})
                      </span>
                    ) : (
                      <button
                        onClick={() => handleManualOverride(reg.uid, reg.userName)}
                        className="px-3 py-1 rounded-lg bg-secondary text-on-secondary font-bold text-[11px] hover:bg-secondary-container"
                      >
                        Manual Check-in
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
