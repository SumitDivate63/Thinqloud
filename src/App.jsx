import React, { useState, useEffect } from 'react';
import StitchHeader from './components/stitch/StitchHeader';
import StitchLandingPage from './components/stitch/StitchLandingPage';
import StitchOrganizerDashboard from './components/stitch/StitchOrganizerDashboard';
import StitchOrganizerLiveQR from './components/stitch/StitchOrganizerLiveQR';
import StitchParticipantDashboard from './components/stitch/StitchParticipantDashboard';
import StitchParticipantQRScanner from './components/stitch/StitchParticipantQRScanner';
import StitchOAuthModal from './components/stitch/StitchOAuthModal';
import StitchEventDetails from './components/stitch/StitchEventDetails';
import StitchCreateEvent from './components/stitch/StitchCreateEvent';
import StitchAdminOperations from './components/stitch/StitchAdminOperations';

import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { seedFirestoreDatabase } from './utils/seedFirebase';

export default function App() {
  // Views: 'landing' | 'participant_dashboard' | 'organizer_dashboard' | 'organizer_live_qr' | 'admin_operations' | 'event_details'
  const [activeView, setActiveView] = useState('landing');
  const [selectedEventId, setSelectedEventId] = useState('event-1');
  const [currentUser, setCurrentUser] = useState(null);

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);

  // Saved Session Bookmarks
  const [bookmarks, setBookmarks] = useState(['sess-101', 'sess-102']);

  // Auto seed database on initial load
  useEffect(() => {
    seedFirestoreDatabase();
  }, []);

  // Firebase auth state listener
  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) setCurrentUser(user);
      });
      return () => unsubscribe();
    } catch (e) {}
  }, []);

  const handleRemoveBookmark = (id) => {
    setBookmarks(prev => prev.filter(b => b !== id));
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col justify-between font-sans selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      
      {/* EventHub Top Utility Bar */}
      <StitchHeader
        activeView={activeView}
        setActiveView={setActiveView}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenQRScanner={() => setIsQRScannerOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeView === 'landing' && (
          <StitchLandingPage
            onSelectEvent={(id) => {
              setSelectedEventId(id);
              setActiveView('event_details');
            }}
            onRegisterEvent={(id) => {
              if (!currentUser) {
                setIsAuthOpen(true);
              } else {
                setActiveView('participant_dashboard');
              }
            }}
            onOpenQRScanner={() => setIsQRScannerOpen(true)}
          />
        )}

        {activeView === 'event_details' && (
          <StitchEventDetails
            eventId={selectedEventId}
            onBack={() => setActiveView('landing')}
            onRegister={() => {
              if (!currentUser) {
                setIsAuthOpen(true);
              } else {
                setActiveView('participant_dashboard');
              }
            }}
          />
        )}

        {activeView === 'participant_dashboard' && (
          <StitchParticipantDashboard
            currentUser={currentUser}
            onOpenQRScanner={() => setIsQRScannerOpen(true)}
            bookmarks={bookmarks}
            onRemoveBookmark={handleRemoveBookmark}
          />
        )}

        {activeView === 'organizer_dashboard' && (
          <StitchOrganizerDashboard
            onLaunchLiveQR={() => setActiveView('organizer_live_qr')}
            onCreateEvent={() => setIsCreateEventOpen(true)}
          />
        )}

        {activeView === 'organizer_live_qr' && (
          <StitchOrganizerLiveQR
            onClose={() => setActiveView('organizer_dashboard')}
          />
        )}

        {activeView === 'admin_operations' && (
          <StitchAdminOperations />
        )}
      </main>

      {/* Institutional Footer */}
      <footer className="w-full py-6 px-6 bg-surface-container-lowest border-t border-outline-variant/60 text-center">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs text-on-surface-variant font-medium">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-secondary">verified</span>
            <span>EventHub Enterprise Operations • Protected by Zero-Trust Identity Governance</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-secondary transition-colors">Help & Campus Support</a>
            <span>•</span>
            <a href="#" className="hover:text-secondary transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-secondary transition-colors">Audit Console</a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <StitchOAuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(u) => setCurrentUser(u)}
      />

      {isQRScannerOpen && (
        <StitchParticipantQRScanner
          onClose={() => setIsQRScannerOpen(false)}
          currentUser={currentUser}
        />
      )}

      {isCreateEventOpen && (
        <StitchCreateEvent
          onClose={() => setIsCreateEventOpen(false)}
          onCreated={() => setActiveView('organizer_dashboard')}
        />
      )}

    </div>
  );
}
