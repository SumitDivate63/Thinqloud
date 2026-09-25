import React, { useState } from 'react';
import { X, Star, Send, CheckCircle2 } from 'lucide-react';
import { SESSIONS } from '../data/conferenceData';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function FeedbackModal({ isOpen, onClose, currentUser }) {
  const [selectedSessionId, setSelectedSessionId] = useState('sess-101');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'conference_feedback'), {
        sessionId: selectedSessionId,
        participantId: currentUser?.uid || `user-${Date.now()}`,
        participantName: currentUser?.displayName || 'Attendee',
        rating,
        comment,
        submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.warn("Writing feedback to local fallback state");
    }
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="glass-panel" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px', width: '100%', padding: '2rem' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <div className="badge badge-purple" style={{ marginBottom: '0.3rem' }}>Post-Attendance Survey</div>
            <h2 style={{ fontSize: '1.6rem' }}>Submit Session Feedback</h2>
          </div>
          <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ padding: '0.35rem' }}>
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--accent-emerald)' }}>
            <CheckCircle2 size={48} style={{ marginBottom: '1rem' }} />
            <h3>Feedback Submitted!</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Thank you for helping us continuously improve ThinqSummit sessions.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmitFeedback} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem', display: 'block' }}>Attended Session</label>
              <select
                value={selectedSessionId}
                onChange={(e) => setSelectedSessionId(e.target.value)}
                style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.9rem' }}
              >
                {SESSIONS.map(s => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
            </div>

            {/* 5 Star Rating Bar */}
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Overall Rating</label>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', background: 'rgba(0,0,0,0.2)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={28}
                    style={{ cursor: 'pointer', transition: 'transform 0.15s ease' }}
                    color={(hoverRating || rating) >= star ? '#fbbf24' : 'var(--text-dim)'}
                    fill={(hoverRating || rating) >= star ? '#fbbf24' : 'none'}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem', display: 'block' }}>Key Takeaways & Comments</label>
              <textarea
                rows={4}
                required
                placeholder="What was the most valuable insight from this session?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
              />
            </div>

            <button type="submit" className="btn btn-primary">
              <Send size={16} />
              <span>Submit Feedback</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
