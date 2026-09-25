import React, { useState, useEffect } from 'react';
import { Zap, Calendar, Users, Radio, Award, Ticket, User, Sparkles, Menu, X, QrCode, Shield, Star } from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  onOpenRegister, 
  onOpenProfile, 
  onOpenOrganizerDashboard,
  onOpenQRScanner,
  onOpenFeedback,
  currentUser, 
  savedBookmarkCount, 
  userRole,
  setUserRole,
  theme, 
  setTheme 
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'speakers', label: 'Speakers', icon: Users },
    { id: 'live', label: 'Live Virtual Stage', icon: Radio, badge: 'LIVE' },
    { id: 'sponsors', label: 'Sponsors', icon: Award }
  ];

  return (
    <header 
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        transition: 'all 0.3s ease',
        background: scrolled ? 'var(--bg-card)' : 'rgba(10, 13, 20, 0.75)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-color)',
        padding: '0.85rem 1.5rem'
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('schedule')} 
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent-cyan) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px var(--primary-glow)'
          }}>
            <Zap size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.03em', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span>THINQ</span>
              <span className="gradient-accent-text">SUMMIT</span>
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Web Platform • Firebase OAuth
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="btn"
                style={{
                  background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                  color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                  border: isActive ? '1px solid var(--border-glow)' : '1px solid transparent',
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.85rem',
                  position: 'relative'
                }}
              >
                <Icon size={15} color={isActive ? 'var(--primary)' : 'currentColor'} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="badge badge-pink" style={{ fontSize: '0.6rem', padding: '0.1rem 0.35rem' }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Controls & Role Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          
          {/* Quick Scan QR Attendance Button (For Participant) */}
          <button 
            onClick={onOpenQRScanner} 
            className="btn btn-secondary btn-sm" 
            style={{ borderColor: 'rgba(6, 182, 212, 0.4)', color: 'var(--accent-cyan)' }}
            title="Scan Dynamic QR Code for Session Attendance"
          >
            <QrCode size={15} />
            <span>Scan QR</span>
          </button>

          {/* Organizer Control Dashboard Button */}
          <button
            onClick={onOpenOrganizerDashboard}
            className="btn btn-secondary btn-sm"
            style={{ borderColor: 'rgba(139, 92, 246, 0.4)', color: '#c084fc' }}
            title="Organizer Live Attendance & Token Rotation Panel"
          >
            <Shield size={15} />
            <span>Organizer Panel</span>
          </button>

          {/* Feedback Button */}
          <button
            onClick={onOpenFeedback}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.45rem' }}
            title="Submit Session Feedback"
          >
            <Star size={15} color="#fbbf24" />
          </button>

          {/* Theme Switcher Button */}
          <button
            onClick={() => {
              const nextTheme = theme === 'default' ? 'cyberpunk' : theme === 'cyberpunk' ? 'emerald' : 'default';
              setTheme(nextTheme);
            }}
            title="Cycle Theme"
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.45rem 0.65rem' }}
          >
            <Sparkles size={15} color={theme === 'cyberpunk' ? '#d946ef' : theme === 'emerald' ? '#10b981' : '#6366f1'} />
          </button>

          {/* User Profile or Register Pass */}
          {currentUser ? (
            <button 
              onClick={onOpenProfile}
              className="btn btn-secondary btn-sm" 
              style={{ gap: '0.4rem', border: '1px solid var(--border-glow)' }}
            >
              <User size={15} color="var(--accent-cyan)" />
              <span style={{ fontSize: '0.85rem' }}>{currentUser.displayName || currentUser.email?.split('@')[0] || 'My Pass'}</span>
            </button>
          ) : (
            <button onClick={onOpenRegister} className="btn btn-primary btn-sm">
              <Ticket size={15} />
              <span>Get Access Pass</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
}
