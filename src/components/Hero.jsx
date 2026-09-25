import React, { useState, useEffect } from 'react';
import { Play, Calendar, MapPin, Sparkles, Users, Layers, ShieldCheck, ArrowRight } from 'lucide-react';
import { CONFERENCE_INFO } from '../data/conferenceData';

export default function Hero({ onExploreSchedule, onOpenLiveStage, onOpenRegister }) {
  const [timeLeft, setTimeLeft] = useState({ days: 48, hours: 14, minutes: 22, seconds: 40 });

  useEffect(() => {
    const targetDate = new Date(CONFERENCE_INFO.startDateISO).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = Math.max(0, targetDate - now);
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section style={{ padding: '3.5rem 1.5rem 2rem 1.5rem', maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* Top Banner Tag */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
        <div 
          onClick={onOpenLiveStage}
          className="badge badge-purple" 
          style={{ 
            padding: '0.5rem 1.25rem', 
            borderRadius: '9999px', 
            fontSize: '0.85rem', 
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            background: 'rgba(139, 92, 246, 0.12)',
            border: '1px solid rgba(139, 92, 246, 0.35)'
          }}
        >
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#ec4899',
            boxShadow: '0 0 10px #ec4899',
            display: 'inline-block',
            animation: 'pulse 1.5s infinite'
          }} />
          <Sparkles size={16} color="#c084fc" />
          <span>VIRTUAL LIVE STAGE BROADCASTING NOW • CLICK TO TUNE IN</span>
        </div>
      </div>

      {/* Main Title & Subtitle */}
      <div style={{ textAlign: 'center', maxWidth: '850px', margin: '0 auto 2.5rem auto' }}>
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.2rem)', lineHeight: 1.1, marginBottom: '1.25rem' }}>
          Architecting the Future of <br />
          <span className="gradient-accent-text">Cloud, AI & Agentic Systems</span>
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          Join 8,500+ cloud architects, AI researchers, and software engineers for 3 days of deep-dive keynotes, hands-on workshops, and zero-trust security strategy.
        </p>
      </div>

      {/* Countdown Timer Grid */}
      <div 
        className="glass-panel" 
        style={{ 
          maxWidth: '680px', 
          margin: '0 auto 3rem auto', 
          padding: '1.25rem 2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1rem',
          textAlign: 'center',
          borderColor: 'var(--border-glow)'
        }}
      >
        {[
          { label: 'Days', val: timeLeft.days },
          { label: 'Hours', val: timeLeft.hours },
          { label: 'Minutes', val: timeLeft.minutes },
          { label: 'Seconds', val: timeLeft.seconds }
        ].map((item, idx) => (
          <div key={idx}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {String(item.val).padStart(2, '0')}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>

      {/* CTA Button Group */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '3.5rem' }}>
        <button onClick={onOpenRegister} className="btn btn-primary btn-lg">
          <span>Claim VIP Access Pass</span>
          <ArrowRight size={18} />
        </button>
        <button onClick={onOpenLiveStage} className="btn btn-secondary btn-lg" style={{ borderColor: 'rgba(236, 72, 153, 0.4)' }}>
          <Play size={18} color="#ec4899" fill="#ec4899" />
          <span>Launch Virtual Stage</span>
        </button>
        <button onClick={onExploreSchedule} className="btn btn-outline btn-lg">
          <span>Explore 12+ Sessions</span>
        </button>
      </div>

      {/* Key Stats Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem'
      }}>
        {[
          { icon: Users, title: "8,500+ Attendees", desc: "Global Engineers & Founders", color: "#06b6d4" },
          { icon: Calendar, title: "Nov 12 - 14, 2026", desc: "San Francisco & Virtual", color: "#8b5cf6" },
          { icon: Layers, title: "5 Dedicated Tracks", desc: "AI, Cloud, Dev, Security, Web3", color: "#ec4899" },
          { icon: ShieldCheck, title: "Firebase Powered", desc: "Real-time sync & zero-trust", color: "#10b981" }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: `rgba(255, 255, 255, 0.05)`,
                border: `1px solid ${stat.color}40`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Icon size={22} color={stat.color} />
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.05rem' }}>{stat.title}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{stat.desc}</div>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
}
