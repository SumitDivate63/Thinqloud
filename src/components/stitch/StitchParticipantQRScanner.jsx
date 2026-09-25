import React, { useState } from 'react';
import { SESSIONS } from '../../data/conferenceData';

export default function StitchParticipantQRScanner({ onClose, currentUser, onAttendanceRecorded }) {
  const [selectedSessionId, setSelectedSessionId] = useState('sess-101');
  const [tokenInput, setTokenInput] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  const handleSimulateScan = () => {
    setTokenInput('TOKEN-LIVE-VERIFIED');
  };

  const handleVerify = (e) => {
    e.preventDefault();
    setVerifying(true);
    setVerificationResult(null);

    setTimeout(() => {
      if (!tokenInput.trim()) {
        setVerificationResult({ success: false, text: 'Token error: Please enter valid security token or scan QR.' });
        setVerifying(false);
        return;
      }

      const rec = {
        sessionId: selectedSessionId,
        participantName: currentUser?.displayName || currentUser?.email || 'Authenticated Attendee',
        verifiedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tokenUsed: tokenInput.toUpperCase(),
        status: 'VERIFIED'
      };

      if (onAttendanceRecorded) onAttendanceRecorded(rec);
      setVerificationResult({ success: true, text: `Success! Attendance verified for ${SESSIONS.find(s => s.id === selectedSessionId)?.title}.` });
      setVerifying(false);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 bg-on-surface/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-outline-variant/40 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-secondary text-on-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-on-surface">Participant QR Attendance Scanner</h2>
              <p className="text-xs text-on-surface-variant">Verify session presence with dynamic token</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-low">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Camera Viewfinder Simulator Box */}
        <div className="relative aspect-video bg-slate-950 rounded-xl overflow-hidden border-2 border-dashed border-secondary flex flex-col items-center justify-center text-center p-4 text-white">
          <div className="w-28 h-28 border-2 border-emerald-400 rounded-lg animate-pulse flex items-center justify-center">
            <span className="material-symbols-outlined text-emerald-400 text-[36px]">center_focus_weak</span>
          </div>
          <p className="text-xs text-slate-300 mt-3 font-medium">Point camera at organizer screen QR code</p>
          
          <button
            type="button"
            onClick={handleSimulateScan}
            className="mt-2 px-3 py-1 rounded bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40 hover:bg-emerald-500/30"
          >
            Simulate Camera Capture
          </button>
        </div>

        {/* Verification Result Notice */}
        {verificationResult && (
          <div className={`p-4 rounded-xl border flex items-center gap-3 text-xs font-semibold ${
            verificationResult.success ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            <span className="material-symbols-outlined text-[20px]">
              {verificationResult.success ? 'check_circle' : 'error'}
            </span>
            <span>{verificationResult.text}</span>
          </div>
        )}

        {/* Manual Token Form */}
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-on-surface-variant block mb-1">Target Session</label>
            <select
              value={selectedSessionId}
              onChange={(e) => setSelectedSessionId(e.target.value)}
              className="w-full py-2 px-3 bg-surface-container-low border border-outline-variant/60 rounded-lg text-sm text-on-surface"
            >
              {SESSIONS.map(s => (
                <option key={s.id} value={s.id}>{s.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-on-surface-variant block mb-1">Dynamic Security Token</label>
            <input
              type="text"
              required
              placeholder="e.g. TOKEN-8A2F99"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              className="w-full py-2 px-3 bg-surface-container-low border border-outline-variant/60 rounded-lg text-sm font-mono text-on-surface uppercase"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={verifying}
              className="flex-1 py-2.5 rounded-lg bg-secondary text-on-secondary font-bold text-sm hover:bg-secondary-container transition-all"
            >
              {verifying ? 'Validating Token...' : 'Verify Attendance'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg bg-surface-container-low border border-outline-variant text-on-surface text-sm font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
