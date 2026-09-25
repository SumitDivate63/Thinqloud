import React, { useState, useMemo } from 'react';
import { Search, Calendar, Clock, MapPin, Bookmark, BookmarkCheck, Radio, User, Tag, Sparkles, Filter, X } from 'lucide-react';
import { SESSIONS, TRACKS, DAYS, SPEAKERS } from '../data/conferenceData';

export default function ScheduleSection({ bookmarks, onToggleBookmark, onOpenLiveStage }) {
  const [selectedDay, setSelectedDay] = useState('day1');
  const [selectedTrack, setSelectedTrack] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSession, setSelectedSession] = useState(null);

  // Filter sessions based on Day, Track, and Search input
  const filteredSessions = useMemo(() => {
    return SESSIONS.filter(sess => {
      const matchDay = sess.day === selectedDay;
      const matchTrack = selectedTrack === 'all' || sess.track === selectedTrack;
      const query = searchQuery.toLowerCase();
      const matchSearch = !query || 
        sess.title.toLowerCase().includes(query) ||
        sess.abstract.toLowerCase().includes(query) ||
        sess.tags.some(t => t.toLowerCase().includes(query)) ||
        sess.speakerIds.some(spkId => {
          const spk = SPEAKERS.find(s => s.id === spkId);
          return spk && spk.name.toLowerCase().includes(query);
        });

      return matchDay && matchTrack && matchSearch;
    });
  }, [selectedDay, selectedTrack, searchQuery]);

  return (
    <section style={{ padding: '2rem 1.5rem', maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1rem' }}>
        <div>
          <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Interactive Agenda
          </div>
          <h2 style={{ fontSize: '2.2rem' }}>Conference Schedule & Tracks</h2>
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Showing {filteredSessions.length} session{filteredSessions.length !== 1 ? 's' : ''} for {DAYS.find(d => d.id === selectedDay)?.label}
        </div>
      </div>

      {/* Day Selector Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {DAYS.map((day) => {
          const isActive = selectedDay === day.id;
          return (
            <button
              key={day.id}
              onClick={() => setSelectedDay(day.id)}
              className="glass-card"
              style={{
                flex: '1',
                minWidth: '200px',
                padding: '1rem 1.25rem',
                textAlign: 'left',
                border: isActive ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                background: isActive ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-card)',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', color: isActive ? 'var(--primary)' : 'var(--text-main)' }}>
                  {day.label}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{day.date}</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{day.subtitle}</div>
            </button>
          );
        })}
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel" style={{ padding: '1rem 1.25rem', marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
        
        {/* Search Input */}
        <div style={{ flex: '1', minWidth: '240px', position: 'relative' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by topic, speaker, tag, or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 1rem 0.65rem 2.8rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          />
          {searchQuery && (
            <X 
              size={16} 
              color="var(--text-muted)" 
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }} 
            />
          )}
        </div>

        {/* Track Filter Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {TRACKS.map((track) => {
            const isActive = selectedTrack === track.id;
            return (
              <button
                key={track.id}
                onClick={() => setSelectedTrack(track.id)}
                className="btn btn-sm"
                style={{
                  background: isActive ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  border: isActive ? '1px solid var(--primary)' : '1px solid var(--border-color)'
                }}
              >
                {track.label}
              </button>
            );
          })}
        </div>

      </div>

      {/* Session Cards Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {filteredSessions.length === 0 ? (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Filter size={36} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <h3 style={{ marginBottom: '0.5rem' }}>No sessions found</h3>
            <p>Try clearing your search filters or selecting a different track.</p>
            <button onClick={() => { setSearchQuery(''); setSelectedTrack('all'); }} className="btn btn-secondary btn-sm" style={{ marginTop: '1rem' }}>
              Reset Filters
            </button>
          </div>
        ) : (
          filteredSessions.map((sess) => {
            const isBookmarked = bookmarks.includes(sess.id);
            const trackObj = TRACKS.find(t => t.id === sess.track);
            const sessionSpeakers = SPEAKERS.filter(s => sess.speakerIds.includes(s.id));

            return (
              <div
                key={sess.id}
                className="glass-card"
                style={{
                  padding: '1.5rem',
                  display: 'grid',
                  gridTemplateColumns: '180px 1fr auto',
                  gap: '1.5rem',
                  alignItems: 'center',
                  borderColor: sess.isLive ? 'var(--accent-pink)' : 'var(--border-color)'
                }}
              >
                {/* Time & Room Info */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                    <Clock size={16} />
                    <span>{sess.time}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    <MapPin size={14} />
                    <span>{sess.room}</span>
                  </div>

                  {sess.isLive && (
                    <div className="badge badge-pink" style={{ marginTop: '0.75rem', cursor: 'pointer' }} onClick={onOpenLiveStage}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ffffff', display: 'inline-block' }} />
                      LIVE NOW
                    </div>
                  )}
                </div>

                {/* Session Main Details */}
                <div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                    {trackObj && (
                      <span className={`badge badge-${trackObj.color || 'cyan'}`}>
                        {trackObj.label}
                      </span>
                    )}
                    {sess.tags.map((t, idx) => (
                      <span key={idx} style={{ fontSize: '0.75rem', color: 'var(--text-dim)', background: 'rgba(255, 255, 255, 0.04)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                        #{t}
                      </span>
                    ))}
                  </div>

                  <h3 
                    onClick={() => setSelectedSession(sess)} 
                    style={{ fontSize: '1.25rem', marginBottom: '0.5rem', cursor: 'pointer', hover: { color: 'var(--primary)' } }}
                  >
                    {sess.title}
                  </h3>

                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '0.75rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {sess.abstract}
                  </p>

                  {/* Speaker Avatars */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', marginLeft: '0.5rem' }}>
                      {sessionSpeakers.map((spk, i) => (
                        <img
                          key={spk.id}
                          src={spk.avatar}
                          alt={spk.name}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            border: '2px solid var(--bg-secondary)',
                            marginLeft: i > 0 ? '-10px' : '0',
                            objectFit: 'cover'
                          }}
                        />
                      ))}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {sessionSpeakers.map(s => s.name).join(', ')}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                  <button
                    onClick={() => onToggleBookmark(sess.id)}
                    className="btn btn-secondary btn-sm"
                    style={{
                      color: isBookmarked ? '#fbbf24' : 'var(--text-muted)',
                      borderColor: isBookmarked ? 'rgba(251, 191, 36, 0.4)' : 'var(--border-color)',
                      gap: '0.4rem'
                    }}
                    title={isBookmarked ? "Remove from My Agenda" : "Add to My Agenda"}
                  >
                    {isBookmarked ? <BookmarkCheck size={16} color="#fbbf24" /> : <Bookmark size={16} />}
                    <span>{isBookmarked ? 'Saved' : 'Save'}</span>
                  </button>

                  <button
                    onClick={() => setSelectedSession(sess)}
                    className="btn btn-outline btn-sm"
                  >
                    Details
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Session Detail Modal */}
      {selectedSession && (
        <div className="modal-overlay" onClick={() => setSelectedSession(null)}>
          <div 
            className="glass-panel" 
            onClick={(e) => e.stopPropagation()} 
            style={{ maxWidth: '640px', width: '100%', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <span className="badge badge-cyan">
                {TRACKS.find(t => t.id === selectedSession.track)?.label}
              </span>
              <button 
                onClick={() => setSelectedSession(null)} 
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.3rem' }}
              >
                <X size={18} />
              </button>
            </div>

            <h2 style={{ fontSize: '1.6rem', marginBottom: '1rem' }}>{selectedSession.title}</h2>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Clock size={16} color="var(--primary)" />
                <span>{selectedSession.time}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <MapPin size={16} color="var(--accent-cyan)" />
                <span>{selectedSession.room}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <User size={16} color="var(--accent-purple)" />
                <span>Max Capacity: {selectedSession.capacity} attendees</span>
              </div>
            </div>

            <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {selectedSession.abstract}
            </p>

            {/* Speakers List */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.95rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Featured Speakers</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {SPEAKERS.filter(s => selectedSession.speakerIds.includes(s.id)).map(spk => (
                  <div key={spk.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                    <img src={spk.avatar} alt={spk.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1rem' }}>{spk.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{spk.role} • {spk.company}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => onToggleBookmark(selectedSession.id)}
                className="btn btn-secondary"
              >
                {bookmarks.includes(selectedSession.id) ? 'Remove Bookmark' : 'Add to My Agenda'}
              </button>

              {selectedSession.isLive && (
                <button
                  onClick={() => {
                    setSelectedSession(null);
                    onOpenLiveStage();
                  }}
                  className="btn btn-primary"
                >
                  <Radio size={16} />
                  <span>Join Live Feed</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
