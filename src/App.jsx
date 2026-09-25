import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ScheduleSection from './components/ScheduleSection';
import SpeakerSection from './components/SpeakerSection';
import LiveStageSection from './components/LiveStageSection';
import SponsorSection from './components/SponsorSection';
import Footer from './components/Footer';
import RegistrationModal from './components/RegistrationModal';
import UserProfileModal from './components/UserProfileModal';
import OrganizerDashboardModal from './components/OrganizerDashboardModal';
import QRAttendanceModal from './components/QRAttendanceModal';
import FeedbackModal from './components/FeedbackModal';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function App() {
  const [activeTab, setActiveTab] = useState('schedule');
  const [theme, setTheme] = useState('default');
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState('participant'); // 'participant' | 'organizer' | 'admin'

  // Modals
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isOrganizerDashboardOpen, setIsOrganizerDashboardOpen] = useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // Active Attendance State
  const [activeSessionAttendance, setActiveSessionAttendance] = useState({
    sessionId: 'sess-101',
    token: 'TOKEN-8A2F99'
  });

  const [attendanceRecords, setAttendanceRecords] = useState([
    { sessionId: 'sess-101', participantName: 'Dr. Alex Vance', verifiedAt: '10:04 AM', tokenUsed: 'TOKEN-INITIAL' }
  ]);

  // Saved Session Bookmarks
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('thinq_bookmarks');
      return saved ? JSON.parse(saved) : ['sess-101', 'sess-102'];
    } catch (e) {
      return ['sess-101', 'sess-102'];
    }
  });

  // Listen to theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Persist bookmarks
  useEffect(() => {
    try {
      localStorage.setItem('thinq_bookmarks', JSON.stringify(bookmarks));
    } catch (e) {}
  }, [bookmarks]);

  // Listen to Firebase Auth state
  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setCurrentUser(user);
        }
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn("Auth listener fallback");
    }
  }, []);

  const handleToggleBookmark = (sessionId) => {
    setBookmarks(prev => 
      prev.includes(sessionId) 
        ? prev.filter(id => id !== sessionId) 
        : [...prev, sessionId]
    );
  };

  const handleAttendanceRecorded = (newRecord) => {
    setAttendanceRecords(prev => [newRecord, ...prev]);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenOrganizerDashboard={() => setIsOrganizerDashboardOpen(true)}
        onOpenQRScanner={() => setIsQRScannerOpen(true)}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
        currentUser={currentUser}
        savedBookmarkCount={bookmarks.length}
        userRole={userRole}
        setUserRole={setUserRole}
        theme={theme}
        setTheme={setTheme}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {activeTab !== 'live' && (
          <Hero
            onExploreSchedule={() => setActiveTab('schedule')}
            onOpenLiveStage={() => setActiveTab('live')}
            onOpenRegister={() => setIsRegisterOpen(true)}
          />
        )}

        {activeTab === 'schedule' && (
          <ScheduleSection
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
            onOpenLiveStage={() => setActiveTab('live')}
          />
        )}

        {activeTab === 'speakers' && (
          <SpeakerSection
            onSelectSession={() => setActiveTab('schedule')}
          />
        )}

        {activeTab === 'live' && (
          <LiveStageSection
            currentUser={currentUser}
          />
        )}

        {activeTab === 'sponsors' && (
          <SponsorSection />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={(tab) => setActiveTab(tab)} />

      {/* Modals */}
      <RegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onAuthSuccess={(user) => setCurrentUser(user)}
      />

      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUser={currentUser}
        bookmarks={bookmarks}
        onRemoveBookmark={handleToggleBookmark}
        onSignOut={() => setCurrentUser(null)}
      />

      <OrganizerDashboardModal
        isOpen={isOrganizerDashboardOpen}
        onClose={() => setIsOrganizerDashboardOpen(false)}
        activeSessionId={activeSessionAttendance.sessionId}
        attendanceRecords={attendanceRecords}
        onStartAttendanceWindow={(sessId, token) => {
          setActiveSessionAttendance({ sessionId: sessId, token });
        }}
      />

      <QRAttendanceModal
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        currentUser={currentUser}
        onAttendanceRecorded={handleAttendanceRecorded}
      />

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        currentUser={currentUser}
      />

    </div>
  );
}
