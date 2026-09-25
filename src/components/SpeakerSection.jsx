import React, { useState } from 'react';
import { SPEAKERS, SESSIONS } from '../data/conferenceData';
import { Sparkles, Calendar, ExternalLink, X, Tag } from 'lucide-react';

export default function SpeakerSection({ onSelectSession }) {
  const [selectedSpeaker, setSelectedSpeaker] = useState(null);
  const [topicFilter, setTopicFilter] = useState('All');

  // Collect all unique topics
  const allTopics = ['All', ...new Set(SPEAKERS.flatMap(s => s.topics))];

  const filteredSpeakers = SPEAKERS.filter(spk => {
    if (topicFilter === 'All') return true;
    return spk.topics.includes(topicFilter);
  });

  return (
    <section style={{ padding: '2rem 1.5rem', maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <div style={{ color: 'var(--accent-cyan)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>
          Industry Visionaries & Pioneers
        </div>
        <h2 style={{ fontSize: '2.4rem', marginBottom: '0.75rem' }}>Keynote & Guest Speakers</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto' }}>
          Learn directly from creators, VP architects, and foundation leaders shaping cloud-native & artificial intelligence.
        </p>
      </div>

      {/* Topic Filter Pills */}
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
        {allTopics.map(topic => {
          const isActive = topicFilter === topic;
          return (
            <button
              key={topic}
              onClick={() => setTopicFilter(topic)}
              className="btn btn-sm"
              style={{
                background: isActive ? 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--primary) 100%)' : 'rgba(255, 255, 255, 0.04)',
                color: isActive ? '#ffffff' : 'var(--text-muted)',
                border: isActive ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)'
              }}
            >
              {topic}
            </button>
          );
        })}
      </div>

      {/* Speakers Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '1.5rem'
      }}>
        {filteredSpeakers.map((spk) => {
          const spkSessions = SESSIONS.filter(s => s.speakerIds.includes(spk.id));

          return (
            <div
              key={spk.id}
              className="glass-card"
              style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedSpeaker(spk)}
            >
              <div>
                {/* Avatar & Role Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                  <img
                    src={spk.avatar}
                    alt={spk.name}
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid var(--border-glow)'
                    }}
                  />
                  <div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{spk.name}</h3>
                    <div style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem', fontWeight: 600 }}>{spk.role}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{spk.company}</div>
                  </div>
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '1.25rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {spk.bio}
                </p>

                {/* Topics Badges */}
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                  {spk.topics.map(t => (
                    <span key={t} className="badge badge-purple" style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sessions Footer */}
              <div style={{
                paddingTop: '0.75rem',
                borderTop: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justify: 'space-between',
                fontSize: '0.8rem',
                color: 'var(--primary)'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Calendar size={14} />
                  {spkSessions.length} Session{spkSessions.length !== 1 ? 's' : ''}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontWeight: 600 }}>
                  View Profile <ExternalLink size={12} />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Speaker Detail Modal */}
      {selectedSpeaker && (
        <div className="modal-overlay" onClick={() => setSelectedSpeaker(null)}>
          <div className="glass-panel" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px', width: '100%', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <img src={selectedSpeaker.avatar} alt={selectedSpeaker.name} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)' }} />
                <div>
                  <h2 style={{ fontSize: '1.6rem' }}>{selectedSpeaker.name}</h2>
                  <div style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{selectedSpeaker.role}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{selectedSpeaker.company}</div>
                </div>
              </div>
              <button onClick={() => setSelectedSpeaker(null)} className="btn btn-secondary btn-sm" style={{ padding: '0.3rem' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Biography</h4>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--text-main)' }}>{selectedSpeaker.bio}</p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Speaking Sessions</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {SESSIONS.filter(s => s.speakerIds.includes(selectedSpeaker.id)).map(sess => (
                  <div 
                    key={sess.id}
                    onClick={() => {
                      setSelectedSpeaker(null);
                      if (onSelectSession) onSelectSession(sess);
                    }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      cursor: 'pointer',
                      display: 'flex',
                      justify: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{sess.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{sess.time} • {sess.room}</div>
                    </div>
                    <ExternalLink size={16} color="var(--primary)" />
                  </div>
                ))}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <button onClick={() => setSelectedSpeaker(null)} className="btn btn-primary">Close Profile</button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
