'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { auth, db } from '../../../firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { decodePassToken, markAttendanceForPass } from '../../../lib/eventOps';

export default function AdminAttendanceScannerPage() {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [registrations, setRegistrations] = useState([]);
  const [attendanceByUid, setAttendanceByUid] = useState({});

  // Camera State
  const [cameraActive, setCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' (rear camera) or 'user' (front camera)
  const [cameraError, setCameraError] = useState(null);
  const [scanInput, setScanInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastScannedToken, setLastScannedToken] = useState('');

  // Scan Result Feedback Banner (Green Check / Red X)
  const [lastScanResult, setLastScanResult] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const videoRef = useRef(null);

  // Load all events for the picker
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'events'), (snapshot) => {
      const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setEvents(list);
      setSelectedEventId(prev => prev && list.some(e => e.id === prev) ? prev : (list[0]?.id || ''));
    }, () => {});
    return () => unsub();
  }, []);

  // Live registrations for the selected event
  useEffect(() => {
    if (!selectedEventId) { setRegistrations([]); return; }
    const q = query(collection(db, 'registrations'), where('eventId', '==', selectedEventId));
    const unsub = onSnapshot(q, (snapshot) => {
      setRegistrations(snapshot.docs.map(d => d.data()));
    }, () => setRegistrations([]));
    return () => unsub();
  }, [selectedEventId]);

  // Live attendance for the selected event
  useEffect(() => {
    if (!selectedEventId) { setAttendanceByUid({}); return; }
    const q = query(collection(db, 'attendance'), where('eventId', '==', selectedEventId));
    const unsub = onSnapshot(q, (snapshot) => {
      const map = {};
      snapshot.docs.forEach(d => { const data = d.data(); map[data.uid] = data; });
      setAttendanceByUid(map);
    }, () => setAttendanceByUid({}));
    return () => unsub();
  }, [selectedEventId]);

  const roster = useMemo(() => {
    return registrations.map(reg => {
      const att = attendanceByUid[reg.uid];
      return {
        uid: reg.uid,
        registrationId: reg.registrationId,
        userName: reg.userName || reg.userEmail,
        userEmail: reg.userEmail,
        status: att ? 'PRESENT' : 'NOT_CHECKED_IN',
        markedAt: att?.markedAt?.toDate ? att.markedAt.toDate().toLocaleTimeString() : (att ? 'just now' : '-'),
        method: att?.method || '-'
      };
    });
  }, [registrations, attendanceByUid]);

  const currentEventStats = {
    registrationCount: registrations.length,
    attendanceCount: Object.keys(attendanceByUid).length
  };

  // Start Camera Stream (HTML5 MediaDevices)
  const startCamera = async () => {
    setCameraError(null);
    try {
      const constraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraError(err.message || 'Camera permission denied or camera not found on this device.');
      setCameraActive(false);
    }
  };

  // Stop Camera Stream
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  // Switch Camera Facing Mode
  const toggleCameraFacing = async () => {
    stopCamera();
    setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Automatically start camera on facingMode toggle if camera was active
  useEffect(() => {
    if (cameraActive) {
      startCamera();
    }
  }, [facingMode]);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Continuous QR Code Scanning Loop using Browser BarcodeDetector API
  useEffect(() => {
    let intervalId = null;
    if (cameraActive) {
      let barcodeDetector = null;
      if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
        try {
          barcodeDetector = new window.BarcodeDetector({ formats: ['qr_code', 'code_128', 'code_39', 'data_matrix'] });
        } catch (e) {
          console.warn('BarcodeDetector format error:', e);
        }
      }

      intervalId = setInterval(async () => {
        if (videoRef.current && videoRef.current.readyState === 4 && !isProcessing) {
          try {
            if (barcodeDetector) {
              const barcodes = await barcodeDetector.detect(videoRef.current);
              if (barcodes && barcodes.length > 0) {
                const rawVal = barcodes[0].rawValue;
                if (rawVal && rawVal !== lastScannedToken) {
                  setLastScannedToken(rawVal);
                  handleProcessScan(rawVal, 'qr');
                }
              }
            }
          } catch (err) {
            // Frame read warning
          }
        }
      }, 400);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [cameraActive, isProcessing, lastScannedToken, selectedEventId]);

  // Process a scanned or manually-pasted pass token: verified against real
  // Firestore registration/attendance records (no client-side simulation).
  const handleProcessScan = async (tokenToVerify, method = 'qr') => {
    if (!tokenToVerify || !selectedEventId) return;
    setIsProcessing(true);
    setLastScanResult(null);
    const nowTime = new Date().toLocaleTimeString();

    const decoded = decodePassToken(tokenToVerify);
    if (!decoded) {
      setLastScanResult({ success: false, title: 'INVALID PASS', message: 'This QR code is not a recognized event pass.', timestamp: nowTime });
      setIsProcessing(false);
      setScanInput('');
      return;
    }

    if (decoded.eventId !== selectedEventId) {
      setLastScanResult({ success: false, title: 'WRONG EVENT', message: `This pass belongs to a different event (${decoded.eventId}).`, timestamp: nowTime });
      setIsProcessing(false);
      setScanInput('');
      return;
    }

    try {
      const result = await markAttendanceForPass({
        uid: decoded.uid,
        eventId: decoded.eventId,
        registrationId: decoded.registrationId,
        adminUid: auth.currentUser?.uid,
        method
      });

      if (result.alreadyCheckedIn) {
        setLastScanResult({
          alreadyCheckedIn: true,
          success: false,
          title: 'ALREADY CHECKED IN',
          message: `${result.attendeeName} was already checked in.`,
          timestamp: nowTime
        });
      } else {
        setLastScanResult({
          success: true,
          title: 'ATTENDANCE VERIFIED',
          attendeeName: result.attendeeName,
          attendeeEmail: result.attendeeEmail,
          message: `Check-in confirmed at ${nowTime}`,
          timestamp: nowTime
        });
      }
    } catch (err) {
      setLastScanResult({ success: false, title: 'VERIFICATION FAILED', message: err.message || 'Could not verify this pass.', timestamp: nowTime });
    }

    setScanInput('');
    setIsProcessing(false);
  };

  // Manual Override Action: marks a roster row present directly (no QR needed)
  const handleManualOverride = async (reg) => {
    setIsProcessing(true);
    setLastScanResult(null);
    const nowTime = new Date().toLocaleTimeString();
    try {
      const result = await markAttendanceForPass({
        uid: reg.uid,
        eventId: selectedEventId,
        registrationId: reg.registrationId,
        adminUid: auth.currentUser?.uid,
        method: 'manual'
      });
      if (result.alreadyCheckedIn) {
        setLastScanResult({ alreadyCheckedIn: true, success: false, title: 'ALREADY CHECKED IN', message: `${result.attendeeName} was already checked in.`, timestamp: nowTime });
      } else {
        setLastScanResult({ success: true, title: 'ATTENDANCE VERIFIED', attendeeName: result.attendeeName, attendeeEmail: result.attendeeEmail, message: `Manually checked in at ${nowTime}`, timestamp: nowTime });
      }
    } catch (err) {
      setLastScanResult({ success: false, title: 'VERIFICATION FAILED', message: err.message || 'Could not check in this attendee.', timestamp: nowTime });
    }
    setIsProcessing(false);
  };

  const filteredRegistrations = roster.filter(r =>
    !searchQuery ||
    r.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.userEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full bg-background min-h-screen p-4 md:p-8 space-y-6">

      {/* Header & Event Selector Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Entrance Scanner
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">QR Attendance Check-in</h1>
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="w-full md:w-80 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white font-semibold"
          >
            {events.length === 0 && <option value="">No events yet</option>}
            {events.map(ev => (
              <option key={ev.id} value={ev.id}>{ev.title}</option>
            ))}
          </select>
        </div>

        {/* Real-time Live Attendance Counter */}
        <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
          <div className="text-right">
            <div className="text-xs text-slate-400 font-semibold uppercase">Checked In</div>
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
              <span>Camera</span>
            </h3>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={cameraActive ? stopCamera : startCamera}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  cameraActive ? 'bg-rose-600 text-white hover:bg-rose-700' : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {cameraActive ? 'videocam_off' : 'photo_camera'}
                </span>
                <span>{cameraActive ? 'Stop Camera' : 'Open Camera'}</span>
              </button>

              {cameraActive && (
                <button
                  type="button"
                  onClick={toggleCameraFacing}
                  className="px-2.5 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant text-on-surface text-xs font-bold hover:bg-surface-container-high"
                  title="Switch Front/Back Camera"
                >
                  <span className="material-symbols-outlined text-[16px]">flip_camera_ios</span>
                </button>
              )}
            </div>
          </div>

          {/* Viewfinder Video Frame */}
          <div className="relative aspect-video bg-slate-950 rounded-xl overflow-hidden border-2 border-emerald-500/60 flex items-center justify-center text-center text-white shadow-inner">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
            />

            {!cameraActive && (
              <div className="p-6 flex flex-col items-center justify-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <span className="material-symbols-outlined text-[36px]">photo_camera</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Camera is Off</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Click "Open Camera" to start scanning</p>
                </div>
                <button
                  onClick={startCamera}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs hover:bg-emerald-400 shadow-md flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[18px]">videocam</span>
                  <span>Enable Camera</span>
                </button>
              </div>
            )}

            {cameraActive && (
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between p-4 bg-gradient-to-t from-black/60 via-transparent to-black/40">
                <div className="px-3 py-1 rounded-full bg-emerald-500/80 backdrop-blur-md text-slate-950 text-[10px] font-extrabold tracking-wider uppercase flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                  <span>SCANNING ({facingMode === 'environment' ? 'Rear' : 'Front'})</span>
                </div>
                <div className="w-44 h-44 border-2 border-emerald-400 rounded-2xl animate-pulse bg-emerald-500/10 shadow-[0_0_15px_rgba(52,211,153,0.3)] flex items-center justify-center">
                  <span className="material-symbols-outlined text-emerald-400/50 text-[48px]">center_focus_weak</span>
                </div>
                <div className="text-[11px] text-slate-200 bg-black/60 px-3 py-1 rounded-full backdrop-blur-md">
                  Point camera at attendee's pass
                </div>
              </div>
            )}
          </div>

          {/* Camera Error Alert */}
          {cameraError && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-rose-400 text-[18px]">warning</span>
              <span>{cameraError}</span>
            </div>
          )}

          {/* Manual Token Fallback Form */}
          <form onSubmit={(e) => { e.preventDefault(); handleProcessScan(scanInput, 'qr'); }} className="flex gap-2">
            <input
              type="text"
              placeholder="Or paste pass token manually..."
              value={scanInput}
              onChange={(e) => setScanInput(e.target.value)}
              className="flex-1 px-3.5 py-2.5 bg-surface-container-low border border-outline-variant/60 rounded-xl text-xs font-mono text-on-surface"
            />
            <button
              type="submit"
              disabled={isProcessing || !scanInput.trim() || !selectedEventId}
              className="px-4 py-2.5 rounded-xl bg-secondary text-on-secondary font-bold text-xs hover:bg-secondary-container disabled:opacity-60"
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
              Last Scan Result
            </h3>

            {!lastScanResult ? (
              <div className="p-8 rounded-xl bg-surface-container-low border border-dashed border-outline-variant/60 text-center text-on-surface-variant text-xs font-medium">
                Awaiting first scan…
              </div>
            ) : lastScanResult.success ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-500 text-emerald-900 space-y-3 shadow-md">
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
                <div className="pt-2 border-t border-emerald-200/80 text-xs text-emerald-800">
                  Timestamp: <strong className="font-mono">{lastScanResult.timestamp}</strong>
                </div>
              </div>
            ) : (
              <div className={`p-6 rounded-2xl border-2 space-y-3 shadow-md ${
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
              <h3 className="text-base font-bold text-on-surface">Registrations</h3>
              <span className="text-xs text-on-surface-variant font-medium">{filteredRegistrations.length} Attendees</span>
            </div>

            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3.5 py-2 bg-surface-container-low border border-outline-variant/60 rounded-xl text-xs text-on-surface"
            />

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {filteredRegistrations.length === 0 && (
                <div className="p-4 text-center text-xs text-on-surface-variant">No registrations yet for this event.</div>
              )}
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
                        onClick={() => handleManualOverride(reg)}
                        disabled={isProcessing}
                        className="px-3 py-1 rounded-lg bg-secondary text-on-secondary font-bold text-[11px] hover:bg-secondary-container disabled:opacity-60"
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
