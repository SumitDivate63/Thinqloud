import React from 'react';

export default function StitchHeader({ activeView, setActiveView, currentUser, onOpenAuth, onOpenQRScanner }) {
  const views = [
    { id: 'landing', label: 'Explore Events', icon: 'explore' },
    { id: 'participant_dashboard', label: 'My Dashboard & Pass', icon: 'badge' },
    { id: 'organizer_dashboard', label: 'Organizer Console', icon: 'dashboard' },
    { id: 'admin_operations', label: 'Admin Ops', icon: 'admin_panel_settings' }
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-surface-container-lowest border-b border-outline-variant/60 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-sm">
      {/* Brand Logo */}
      <div 
        onClick={() => setActiveView('landing')} 
        className="flex items-center gap-3 cursor-pointer group"
      >
        <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-on-secondary shadow-md group-hover:scale-105 transition-transform">
          <span className="material-symbols-outlined text-[24px]">calendar_today</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-on-surface tracking-tight">EventHub</span>
            <span className="px-2 py-0.5 rounded-full bg-surface-container text-secondary text-xs font-medium">Enterprise SSO</span>
          </div>
          <p className="text-xs text-on-surface-variant">Campus & Enterprise Operations Platform</p>
        </div>
      </div>

      {/* Center Navigation Links */}
      <nav className="hidden lg:flex items-center gap-1 bg-surface-container-low p-1 rounded-xl border border-outline-variant/40">
        {views.map((v) => {
          const isActive = activeView === v.id;
          return (
            <button
              key={v.id}
              onClick={() => setActiveView(v.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-surface-container-lowest text-secondary shadow-sm font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest/50'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{v.icon}</span>
              <span>{v.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Action Controls */}
      <div className="flex items-center gap-3">
        {/* Quick QR Scanner Shortcut */}
        <button
          onClick={onOpenQRScanner}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-surface-container-low border border-outline-variant/60 text-secondary hover:bg-surface-container-high transition-colors text-sm font-medium"
          title="Scan Dynamic Attendance QR"
        >
          <span className="material-symbols-outlined text-[18px]">qr_code_scanner</span>
          <span className="hidden sm:inline">Scan QR</span>
        </button>

        {/* Live Organizer QR Button */}
        <button
          onClick={() => setActiveView('organizer_live_qr')}
          className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-lg bg-secondary text-on-secondary hover:bg-secondary-container transition-colors text-sm font-medium shadow-sm"
          title="Launch Projected Live QR Attendance Screen"
        >
          <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
          <span>Live QR Controller</span>
        </button>

        {/* User SSO Auth Profile */}
        {currentUser ? (
          <button
            onClick={() => setActiveView('participant_dashboard')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface border border-outline-variant/40 text-sm font-medium"
          >
            <div className="w-7 h-7 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-xs">
              {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
            </div>
            <span className="hidden md:inline max-w-[120px] truncate">{currentUser.displayName || currentUser.email?.split('@')[0]}</span>
          </button>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-container text-on-primary hover:bg-primary-container/90 transition-colors text-sm font-semibold shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">lock_open</span>
            <span>Sign In / SSO</span>
          </button>
        )}
      </div>
    </header>
  );
}
