import React from 'react';
import { Zap, Heart, Shield, Globe, Share2, Code } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer style={{ borderTop: '1px solid var(--border-color)', background: 'var(--bg-secondary)', padding: '3rem 1.5rem 2rem 1.5rem', color: 'var(--text-muted)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
        
        {/* Brand info */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <Zap size={22} color="var(--primary)" />
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-main)' }}>
              THINQSUMMIT 2026
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1rem' }}>
            The premier global conference for next-generation cloud infrastructure, agentic AI systems, and modern web engineering.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Globe size={18} style={{ cursor: 'pointer' }} />
            <Code size={18} style={{ cursor: 'pointer' }} />
            <Share2 size={18} style={{ cursor: 'pointer' }} />
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ color: 'var(--text-main)', fontSize: '0.95rem', marginBottom: '1rem' }}>Quick Navigation</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem' }}>
            <li><a onClick={() => onNavigate('schedule')} style={{ cursor: 'pointer' }}>Conference Schedule</a></li>
            <li><a onClick={() => onNavigate('speakers')} style={{ cursor: 'pointer' }}>Featured Speakers</a></li>
            <li><a onClick={() => onNavigate('live')} style={{ cursor: 'pointer' }}>Virtual Stage & Chat</a></li>
            <li><a onClick={() => onNavigate('sponsors')} style={{ cursor: 'pointer' }}>Sponsors & Partners</a></li>
          </ul>
        </div>

        {/* Firebase Tech Stack */}
        <div>
          <h4 style={{ color: 'var(--text-main)', fontSize: '0.95rem', marginBottom: '1rem' }}>Powered By Firebase</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem' }}>
            <li>Firebase Authentication (Google OAuth)</li>
            <li>Cloud Firestore (Live Q&A & Agenda)</li>
            <li>Firebase Analytics (Measurement ID)</li>
            <li>Firebase Storage & Cloud Functions</li>
          </ul>
        </div>

        {/* Location & Contact */}
        <div>
          <h4 style={{ color: 'var(--text-main)', fontSize: '0.95rem', marginBottom: '1rem' }}>Venue & Dates</h4>
          <div style={{ fontSize: '0.85rem', lineHeight: 1.6 }}>
            <div>Moscone Center South</div>
            <div>747 Howard St, San Francisco, CA</div>
            <div style={{ marginTop: '0.5rem', color: 'var(--accent-cyan)' }}>Nov 12 - 14, 2026</div>
          </div>
        </div>

      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
        <div>© 2026 ThinqCloud Technologies, Inc. All rights reserved.</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <span>Crafted with</span> <Heart size={14} color="#ec4899" fill="#ec4899" /> <span>for developers worldwide</span>
        </div>
      </div>
    </footer>
  );
}
