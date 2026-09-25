import React from 'react';
import { X, Ticket, Bookmark, LogOut, QrCode, Calendar, MapPin, CheckCircle } from 'lucide-react';
import { SESSIONS } from '../data/conferenceData';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

export default function UserProfileModal({ isOpen, onClose, currentUser, bookmarks, onRemoveBookmark, onSignOut }) {
  if (!isOpen || !currentUser) return null;

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn("Sign out fallback");
    }
    onSignOut();
    onClose();
  };

  const bookmarkedSessions = SESSIONS.filter(s => bookmarks.includes(s.id));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="glass-panel" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px', width: '100%', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Ticket size={22} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.6rem' }}>My Conference Pass</h2>
          </div>
          <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ padding: '0.35rem' }}>
            <X size={18} />
          </button>
        </div>

        {/* Digital Access Badge Card */}
        <div 
          style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)',
            border: '1px solid var(--border-glow)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            marginBottom: '2rem',
            position: 'relative',
            boxShadow: 'var(--shadow-glow)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                THINQSUMMIT 2026 OFFICIAL BADGE
              </div>
              <h3 style={{ fontSize: '1.4rem', color: '#fff', marginTop: '0.2rem' }}>
                {currentUser.displayName || currentUser.email}
              </h3>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{currentUser.email}</div>
            </div>

            <span className="badge badge-purple" style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}>
              {(currentUser.passType || 'VIRTUAL').toUpperCase()} ACCESS
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>BADGE ID</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                TS26-{currentUser.uid ? currentUser.uid.substring(0, 8).toUpperCase() : '99824A'}
              </div>
            </div>

            {/* Simulated QR Code SVG */}
            <div style={{ background: '#ffffff', padding: '0.4rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <QrCode size={48} color="#0a0d14" />
            </div>
          </div>
        </div>

        {/* Bookmarked Agenda Sessions */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bookmark size={18} color="var(--primary)" />
              <span>Saved Agenda ({bookmarkedSessions.length})</span>
            </h3>
          </div>

          {bookmarkedSessions.length === 0 ? (
            <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              You haven't saved any sessions yet. Click "Save" on any schedule card to build your personalized agenda!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {bookmarkedSessions.map(sess => (
                <div key={sess.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{sess.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: '0.75rem', marginTop: '0.2rem' }}>
                      <span><Calendar size={12} /> {sess.time}</span>
                      <span><MapPin size={12} /> {sess.room}</span>
                    </div>
                  </div>
                  <button onClick={() => onRemoveBookmark(sess.id)} className="btn btn-secondary btn-sm" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
          <button onClick={handleLogout} className="btn btn-secondary" style={{ color: '#f87171', borderColor: 'rgba(248,113,113,0.3)', gap: '0.5rem' }}>
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
          <button onClick={onClose} className="btn btn-primary">Done</button>
        </div>

      </div>
    </div>
  );
}
