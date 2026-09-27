'use client';

import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { resolveUserRole, HARDCODED_ADMIN_EMAIL, logoutUser } from '../../lib/roleAuth';

export default function AdminPanelLayout({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setCurrentUser(u);
        const { isAdmin: adminFlag } = await resolveUserRole(u);
        setIsAdmin(adminFlag);
      } else {
        setCurrentUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-sm font-semibold">
        Verifying Admin Access Credentials...
      </div>
    );
  }

  // Strict route guard: Non-admins blocked
  if (!currentUser || !isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/40">
          <span className="material-symbols-outlined text-[36px]">block</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Access Restricted</h1>
        <p className="text-sm text-slate-400 max-w-md">
          The Admin Panel is strictly reserved for the single authorized administrator account (<strong className="text-rose-300 font-mono">{HARDCODED_ADMIN_EMAIL}</strong>).
        </p>
        <div className="pt-2 flex items-center gap-3">
          <a href="/app/(user)/events" className="px-5 py-2.5 rounded-lg bg-secondary text-on-secondary text-sm font-semibold hover:bg-secondary-container">
            Return to User Panel
          </a>
          {currentUser && (
            <button onClick={logoutUser} className="px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-sm font-semibold">
              Sign Out
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      
      {/* Distinct Admin Header Navigation Bar */}
      <header className="sticky top-0 z-50 w-full bg-slate-950 text-white border-b border-slate-800 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-lg">
        
        {/* Brand & Admin Badge */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-[24px]">admin_panel_settings</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight">EventHub Admin</span>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-bold">
                SINGLE ADMIN MODE
              </span>
            </div>
            <p className="text-xs text-slate-400">Authorized: <span className="text-emerald-400 font-mono font-semibold">{HARDCODED_ADMIN_EMAIL}</span></p>
          </div>
        </div>

        {/* Admin Specific Links */}
        <nav className="hidden md:flex items-center gap-2">
          <a href="/app/(admin)/dashboard" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-white bg-slate-800">
            <span className="material-symbols-outlined text-[18px]">dashboard</span>
            <span>Admin Dashboard</span>
          </a>
          <a href="/app/(admin)/scanner" className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-md">
            <span className="material-symbols-outlined text-[18px]">qr_code_scanner</span>
            <span>Live Camera Scanner</span>
          </a>
          <a href="/app/(admin)/events/new" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800">
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Create Event</span>
          </a>
        </nav>

        {/* Admin Account Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-mono">{currentUser.email}</span>
          </div>

          <button
            onClick={logoutUser}
            className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-rose-400 text-xs font-semibold"
          >
            Sign Out
          </button>
        </div>

      </header>

      {/* Main Admin View */}
      <main className="flex-1">
        {children}
      </main>

      <footer className="w-full py-4 px-6 bg-slate-950 text-slate-400 text-xs border-t border-slate-800 text-center">
        <span>Admin Panel • Enforced by Server-Side Custom Claim & Firestore Security Rules</span>
      </footer>

    </div>
  );
}
