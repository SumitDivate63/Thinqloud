import React, { useState, useEffect } from 'react';
import { X, Radio, RefreshCw, Users, CheckCircle2, Shield, BarChart3, Clock, Sparkles } from 'lucide-react';
import { SESSIONS } from '../data/conferenceData';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

export default function OrganizerDashboardModal({ isOpen, onClose, activeSessionId, attendanceRecords, onStartAttendanceWindow }) {
  const [selectedSessionId, setSelectedSessionId] = useState(activeSessionId || 'sess-101');
  const [windowActive, setWindowActive] = useState(true);
  const [currentToken, setCurrentToken] = useState(`TOKEN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
  const [tokenTimeLeft, setTokenTimeLeft] = useState(15);
  const [liveAttendanceList, setLiveAttendanceList] = useState(attendanceRecords || []);

  const selectedSession = SESSIONS.find(s => s.id === selectedSessionId) || SESSIONS[0];

  // Rotate dynamic token every 15 seconds for security
  useEffect(() => {
    if (!windowActive) return;

    const timer = setInterval(() => {
      setTokenTimeLeft((prev) => {
        if (prev <= 1) {
          const newToken = `TOKEN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
          setCurrentToken(newToken);
          if (onStartAttendanceWindow) {
            onStartAttendanceWindow(selectedSessionId, newToken);
          }
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [windowActive, selectedSessionId]);

  // Sync real-time attendance records from Firestore
  useEffect(() => {
    try {
      const attRef = collection(db, 'conference_attendance');
      const unsubscribe = onSnapshot(attRef, (snapshot) => {
        if (!snapshot.empty) {
          const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          setLiveAttendanceList(docs.filter(d => d.sessionId === selectedSessionId));
        }
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn("Using local attendance records fallback");
    }
  }, [selectedSessionId]);

  if (!isOpen) return null;

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(`THINQ_ATTENDANCE_${selectedSessionId}_${currentToken}`)}&color=6366f1&bcolor=0a0d14`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="glass-panel" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '900px', width: '100%', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}
      >
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', pb: '1rem' }}>
          <div>
            <div className="badge badge-purple" style={{ marginBottom: '0.4rem' }}>ORGANIZER LIVE CONTROL PANEL</div>
            <h2 style={{ fontSize: '1.8rem' }}>Dynamic QR Attendance Controller</h2>
          </div>
          <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ padding: '0.35rem' }}>
            <X size={20} />
          </button>
        </div>

        {/* Session Selection Row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginBottom: '2rem', background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
          <div style={{ flex: 1, minWidth: '220px' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Select Target Session</label>
            <select
              value={selectedSessionId}
              onChange={(e) => setSelectedSessionId(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                color: '#fff',
                fontSize: '0.9rem'
              }}
            >
              {SESSIONS.map(s => (
                <option key={s.id} value={s.id}>{s.title} ({s.time})</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginTop: '1.2rem' }}>
            <button
              onClick={() => setWindowActive(!windowActive)}
              className={`btn ${windowActive ? 'btn-primary' : 'btn-secondary'}`}
              style={{ background: windowActive ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'rgba(255,255,255,0.1)' }}
            >
              <Radio size={16} />
              <span>{windowActive ? 'Attendance ACTIVE' : 'Start Attendance Window'}</span>
            </button>
          </div>
        </div>

        {/* Main Grid: Dynamic QR Display vs Live Attendance Stream */}
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '2rem', alignItems: 'start' }}>
          
          {/* Left Column: Dynamic QR Code Box */}
          <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center', borderColor: 'var(--primary-glow)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              Projected Display (Organizer Screen)
            </div>

            {/* QR Image Box */}
            <div style={{ background: '#0a0d14', padding: '1rem', borderRadius: 'var(--radius-md)', border: '2px solid var(--primary)', marginBottom: '1rem', display: 'inline-block' }}>
              <img src={qrUrl} alt="Dynamic Attendance QR" style={{ width: '220px', height: '220px', display: 'block' }} />
            </div>

            {/* Token Rotation Info */}
            <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glow)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>SECURITY DYNAMIC TOKEN</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-cyan)', letterSpacing: '0.05em' }}>
                {currentToken}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                <Clock size={12} />
                <span>Rotates in <strong style={{ color: '#fff' }}>{tokenTimeLeft}s</strong> to prevent screenshots</span>
              </div>
            </div>
          </div>

          {/* Right Column: Real-Time Live Attendance Stream */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={20} color="var(--accent-emerald)" />
                <span>Live Verified Attendees ({liveAttendanceList.length})</span>
              </h3>
              <span className="badge badge-emerald">
                {Math.round((liveAttendanceList.length / (selectedSession.capacity || 500)) * 100)}% Capacity Verified
              </span>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', height: '340px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {liveAttendanceList.length === 0 ? (
                <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <Radio size={32} style={{ opacity: 0.4, marginBottom: '0.5rem' }} />
                  <div>Attendance window is open. Waiting for participant scans...</div>
                </div>
              ) : (
                liveAttendanceList.map((att, idx) => (
                  <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent-cyan) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
                        {(att.participantName || 'P')[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{att.participantName || 'Authenticated Attendee'}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verified via Token: {att.tokenUsed || 'DYNAMIC-OK'}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>VERIFIED</span>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                        {att.verifiedAt || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
