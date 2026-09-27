'use client';

import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { resolveUserRole, signInWithGoogleSSO, logoutUser } from '../../lib/roleAuth';

export default function UserPanelLayout({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState('user');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setCurrentUser(u);
        const { role } = await resolveUserRole(u);
        setUserRole(role);
      } else {
        setCurrentUser(null);
        setUserRole('user');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      
      {/* User Header Navigation Bar (NO SCAN BUTTON, NO EVENT CREATION) */}
      <header className="sticky top-0 z-40 w-full bg-surface-container-lowest border-b border-outline-variant/60 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-sm">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-on-secondary shadow-md">
            <span className="material-symbols-outlined text-[24px]">calendar_today</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-on-surface tracking-tight">EventHub</span>
              <span className="px-2 py-0.5 rounded-full bg-surface-container-low text-secondary text-xs font-semibold">PARTICIPANT PANEL</span>
            </div>
            <p className="text-xs text-on-surface-variant">Campus & Enterprise Events Discovery</p>
          </div>
        </div>

        {/* User Navigation Links */}
        <nav className="hidden md:flex items-center gap-2">
          <a href="/app/(user)/events" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-secondary bg-surface-container-low">
            <span className="material-symbols-outlined text-[18px]">explore</span>
            <span>Browse Events</span>
          </a>
          <a href="/app/(user)/my-pass" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low">
            <span className="material-symbols-outlined text-[18px]">badge</span>
            <span>My Digital Pass & Agenda</span>
          </a>
        </nav>

        {/* User Authentication Status */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container border border-outline-variant/40">
                <div className="w-7 h-7 rounded-full bg-secondary text-on-secondary font-bold flex items-center justify-center text-xs">
                  {(currentUser.displayName || currentUser.email)[0].toUpperCase()}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-on-surface">{currentUser.displayName || currentUser.email.split('@')[0]}</div>
                  <div className="text-[10px] text-on-surface-variant">Participant Pass Active</div>
                </div>
              </div>

              <button
                onClick={logoutUser}
                className="px-3 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant text-on-surface-variant hover:text-error text-xs font-semibold"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={signInWithGoogleSSO}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-on-secondary font-semibold text-sm hover:bg-secondary-container transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">lock_open</span>
              <span>Sign In with Google</span>
            </button>
          )}
        </div>

      </header>

      {/* Main User Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* User Footer */}
      <footer className="w-full py-4 px-6 bg-surface-container-lowest border-t border-outline-variant/60 text-center text-xs text-on-surface-variant">
        <span>EventHub Participant Experience • Protected by Firebase Custom Claims</span>
      </footer>

    </div>
  );
}
