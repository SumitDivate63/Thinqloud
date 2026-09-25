import React from 'react';
import { SPONSORS } from '../data/conferenceData';
import { Award, ExternalLink, Sparkles } from 'lucide-react';

export default function SponsorSection() {
  return (
    <section style={{ padding: '3rem 1.5rem 4rem 1.5rem', maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
      
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ color: 'var(--accent-pink)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>
          Industry Partners & Supporters
        </div>
        <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Conference Sponsors</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
          Backed by leaders pioneering the future of cloud computing, developer platforms, and neural artificial intelligence.
        </p>
      </div>

      {/* Sponsors Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        {SPONSORS.map((s, idx) => (
          <div 
            key={idx}
            className="glass-card"
            style={{
              padding: '2rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justify: 'center',
              gap: '0.75rem',
              border: s.tier.includes('Title') ? '1px solid var(--border-glow)' : '1px solid var(--border-color)'
            }}
          >
            <div style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text-main)' }}>
              {s.logo}
            </div>
            <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>{s.tier}</span>
          </div>
        ))}
      </div>

      {/* Become a Sponsor Box */}
      <div 
        className="glass-panel" 
        style={{
          marginTop: '3rem',
          padding: '2rem',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justify: 'space-between',
          gap: '1rem',
          textAlign: 'left'
        }}
      >
        <div>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.3rem' }}>Want to sponsor ThinqSummit 2026?</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Connect with 8,500+ senior cloud architects, AI engineers, and tech founders.</p>
        </div>
        <button className="btn btn-primary btn-sm">
          <span>Request Sponsorship Deck</span>
          <ExternalLink size={14} />
        </button>
      </div>

    </section>
  );
}
