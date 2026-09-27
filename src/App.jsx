import React, { useState, useEffect } from 'react';
import StitchHeader from './components/stitch/StitchHeader';
import StitchLandingPage from './components/stitch/StitchLandingPage';
import StitchOrganizerDashboard from './components/stitch/StitchOrganizerDashboard';
import StitchOrganizerLiveQR from './components/stitch/StitchOrganizerLiveQR';
import StitchParticipantDashboard from './components/stitch/StitchParticipantDashboard';
import StitchOAuthModal from './components/stitch/StitchOAuthModal';
import StitchEventDetails from './components/stitch/StitchEventDetails';
import StitchCreateEvent from './components/stitch/StitchCreateEvent';
import StitchAdminOperations from './components/stitch/StitchAdminOperations';

import { auth, db } from './firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { resolveUserRole, HARDCODED_ADMIN_EMAIL, logoutUser } from './lib/roleAuth';
import { DEFAULT_EVENTS, getLocalEvents, saveLocalEvents } from './data/initialEvents';
import AdminAttendanceScannerPage from './app/(admin)/scanner/page';
import UserDigitalPassPage from './app/(user)/my-pass/page';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState('user'); // 'user' | 'admin'
  const [isAdmin, setIsAdmin] = useState(false);

  // Dynamic Events State synced with Firestore DB & LocalStorage
  const [events, setEvents] = useState(() => getLocalEvents());

  // Subscribe to real-time Firestore events collection
  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'events'), (snapshot) => {
        if (!snapshot.empty) {
          const dbEvents = snapshot.docs.map(docSnap => ({
            id: docSnap.id,
            ...docSnap.data()
          }));
          
          setEvents(prevEvents => {
            const map = new Map();
            // Default events first
            DEFAULT_EVENTS.forEach(e => map.set(e.id, e));
            // Local events second
            prevEvents.forEach(e => map.set(e.id, e));
            // Firestore events top priority
            dbEvents.forEach(e => map.set(e.id, e));
            const merged = Array.from(map.values());
            saveLocalEvents(merged);
            return merged;
          });
        }
      }, (err) => {
        console.warn('Firestore events listener error (using local storage fallback):', err);
      });
      return () => unsub();
    } catch (e) {
      console.warn('Firestore events snapshot failed:', e);
    }
  }, []);

  // Active Panel Navigation
  // Admin Views: 'admin_dashboard' | 'admin_scanner' | 'admin_ops'
  // User Views: 'landing' | 'my_pass' | 'event_details'
  const [activeView, setActiveView] = useState('landing');
  const [selectedEventId, setSelectedEventId] = useState('event-1');

  // Registered event IDs for the signed-in user, sourced live from Firestore
  // (per-uid, so two accounts on the same browser never see each other's passes).
  const [registeredEventIds, setRegisteredEventIds] = useState([]);

  useEffect(() => {
    if (!currentUser) {
      setRegisteredEventIds([]);
      return;
    }
    const q = query(collection(db, 'registrations'), where('uid', '==', currentUser.uid));
    const unsub = onSnapshot(q, (snapshot) => {
      setRegisteredEventIds(snapshot.docs.map(d => d.data().eventId));
    }, (err) => {
      console.warn('Registrations listener error:', err);
    });
    return () => unsub();
  }, [currentUser]);

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);

  // Auth state listener with strict role resolution
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setCurrentUser(u);
        const { role, isAdmin: adminFlag } = await resolveUserRole(u);
        setUserRole(role);
        setIsAdmin(adminFlag);

        // Auto redirect admin to admin panel on login if sumitdivate3@gmail.com
        if (adminFlag) {
          setActiveView('admin_dashboard');
        }
      } else {
        setCurrentUser(null);
        setUserRole('user');
        setIsAdmin(false);
        setActiveView('landing');
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col justify-between font-sans selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      
      {/* Top Navigation Bar — Role Adaptive */}
      <header className={`sticky top-0 z-50 w-full border-b px-4 md:px-8 py-3.5 flex items-center justify-between shadow-sm transition-colors ${
        isAdmin ? 'bg-slate-950 text-white border-slate-800' : 'bg-surface-container-lowest border-outline-variant/60'
      }`}>
        
        {/* Brand Logo */}
        <div onClick={() => setActiveView(isAdmin ? 'admin_dashboard' : 'landing')} className="flex items-center gap-3 cursor-pointer group">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md ${
            isAdmin ? 'bg-rose-600' : 'bg-secondary'
          }`}>
            <span className="material-symbols-outlined text-[24px]">
              {isAdmin ? 'admin_panel_settings' : 'calendar_today'}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight">EventHub</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                isAdmin ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-surface-container text-secondary'
              }`}>
                {isAdmin ? 'ADMIN PANEL (sumitdivate3@gmail.com)' : 'USER PANEL'}
              </span>
            </div>
            <p className={`text-xs ${isAdmin ? 'text-slate-400' : 'text-on-surface-variant'}`}>
              {isAdmin ? 'Single Admin Governance & Live Entrance Scanner' : 'Campus & Enterprise Event Discovery'}
            </p>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {isAdmin ? (
            <>
              <button
                onClick={() => setActiveView('admin_dashboard')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  activeView === 'admin_dashboard' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">dashboard</span>
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => setActiveView('admin_scanner')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-bold transition-all ${
                  activeView === 'admin_scanner' ? 'bg-emerald-600 text-white shadow-md' : 'bg-emerald-700/40 text-emerald-300 hover:bg-emerald-600 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">qr_code_scanner</span>
                <span>Live Camera Scanner</span>
              </button>
              <button
                onClick={() => setActiveView('admin_ops')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  activeView === 'admin_ops' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">security</span>
                <span>Security Rules</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveView('landing')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeView === 'landing' ? 'bg-surface-container-low text-secondary font-semibold' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">explore</span>
                <span>Browse Events</span>
              </button>
              <button
                onClick={() => setActiveView('my_pass')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeView === 'my_pass' ? 'bg-surface-container-low text-secondary font-semibold' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">badge</span>
                <span>My Digital Pass & Status ({registeredEventIds.length})</span>
              </button>
            </>
          )}
        </nav>

        {/* Right Auth Controls */}
        <div className="flex items-center gap-3">
          {isAdmin && (
            <button
              onClick={() => setIsCreateEventOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              <span>Create Event</span>
            </button>
          )}

          {currentUser ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-surface-container text-on-surface font-semibold hidden md:inline">
                {currentUser.email}
              </span>
              <button
                onClick={logoutUser}
                className="px-3 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant text-xs font-semibold hover:text-error"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-on-secondary font-semibold text-sm hover:bg-secondary-container shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">lock_open</span>
              <span>Sign In</span>
            </button>
          )}
        </div>

      </header>

      {/* Main Content View Switcher */}
      <main className="flex-1">
        
        {/* User Views */}
        {!isAdmin && activeView === 'landing' && (
          <StitchLandingPage
            events={events}
            registeredEventIds={registeredEventIds}
            onRequireAuth={() => setIsAuthOpen(true)}
            currentUser={currentUser}
          />
        )}

        {!isAdmin && activeView === 'event_details' && (
          <StitchEventDetails
            eventId={selectedEventId}
            events={events}
            onBack={() => setActiveView('landing')}
            onRegister={() => {
              if (!currentUser) setIsAuthOpen(true);
              else setActiveView('my_pass');
            }}
          />
        )}

        {!isAdmin && activeView === 'my_pass' && (
          <UserDigitalPassPage
            events={events}
            registeredEventIds={registeredEventIds}
          />
        )}

        {/* Admin Views (sumitdivate3@gmail.com) */}
        {isAdmin && activeView === 'admin_dashboard' && (
          <StitchOrganizerDashboard
            events={events}
            onLaunchLiveQR={() => setActiveView('admin_scanner')}
            onCreateEvent={() => setIsCreateEventOpen(true)}
          />
        )}

        {isAdmin && activeView === 'admin_scanner' && (
          <AdminAttendanceScannerPage />
        )}

        {isAdmin && activeView === 'admin_ops' && (
          <StitchAdminOperations />
        )}

      </main>

      {/* Institutional Footer */}
      <footer className="w-full py-4 px-6 bg-surface-container-lowest border-t border-outline-variant/60 text-center text-xs text-on-surface-variant font-medium">
        <span>Event Management Platform • Single Admin (<strong className="text-secondary">{HARDCODED_ADMIN_EMAIL}</strong>) & Participant Role Resolution</span>
      </footer>

      {/* Modals */}
      <StitchOAuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(u) => {
          if (u.email?.toLowerCase() === HARDCODED_ADMIN_EMAIL.toLowerCase()) {
            setActiveView('admin_dashboard');
          } else {
            setActiveView('landing');
          }
        }}
      />

      {isCreateEventOpen && (
        <StitchCreateEvent
          onClose={() => setIsCreateEventOpen(false)}
          onCreated={(createdEvent) => {
            if (createdEvent) {
              setEvents(prev => [createdEvent, ...prev.filter(e => e.id !== createdEvent.id)]);
            }
            setActiveView(isAdmin ? 'admin_dashboard' : 'landing');
          }}
        />
      )}

    </div>
  );
}
