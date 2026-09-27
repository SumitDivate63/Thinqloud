import React, { useState } from 'react';
import { SESSIONS, SPEAKERS } from '../../data/conferenceData';
import { DEFAULT_EVENTS } from '../../data/initialEvents';
import EventDetailsAndPassModal from './EventDetailsAndPassModal';

export default function StitchLandingPage({
  events = [],
  registeredEventIds = ['event-1'],
  onConfirmRegistration,
  onSelectEvent,
  onRegisterEvent,
  onOpenQRScanner,
  currentUser
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalEvent, setActiveModalEvent] = useState(null);

  const categories = ['All', 'Academic & Research', 'Enterprise Tech', 'Hackathons & AI', 'Workshops'];

  const eventsList = events && events.length > 0 ? events : DEFAULT_EVENTS;

  const filteredEvents = eventsList.filter(ev => {
    const matchCat = selectedCategory === 'All' || ev.category === selectedCategory;
    const matchSearch = !searchQuery || (ev.title && ev.title.toLowerCase().includes(searchQuery.toLowerCase())) || (ev.location && ev.location.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  const handleConfirmRegistration = (eventId) => {
    if (onConfirmRegistration) {
      onConfirmRegistration(eventId);
    }
  };

  return (
    <div className="w-full bg-background min-h-screen pb-16">
      
      {/* Hero Section */}
      <section className="relative w-full bg-surface-container-low border-b border-outline-variant/60 py-12 md:py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container text-secondary text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              CAMPUS & ENTERPRISE EVENT OPERATIONS PLATFORM
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-on-surface tracking-tight leading-tight">
              Centralized Event Discovery, <br />
              <span className="text-secondary">OAuth SSO & Dynamic QR Attendance</span>
            </h1>
            <p className="text-base text-on-surface-variant max-w-2xl leading-relaxed">
              Streamline academic symposiums, enterprise conferences, and hands-on workshops with automated Google OAuth registration, live organizer dashboards, and verifiable QR check-ins.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <button
                onClick={() => setActiveModalEvent(eventsList[0])}
                className="px-6 py-3 rounded-lg bg-secondary text-on-secondary font-semibold text-sm hover:bg-secondary-container transition-all shadow-md flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">badge</span>
                <span>Register for EventPass</span>
              </button>
              <button
                onClick={() => setActiveModalEvent(eventsList[0])}
                className="px-6 py-3 rounded-lg bg-surface-container-lowest border border-outline-variant text-on-surface font-semibold text-sm hover:bg-surface-container-low transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
                <span>View Digital Pass & QR</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Card */}
          <div className="w-full md:w-80 bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Live System Status</span>
              <span className="inline-flex items-center gap-1 text-xs text-secondary font-semibold">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                All Services OK
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 rounded-lg bg-surface-container-low">
                <div className="text-2xl font-bold text-on-surface font-mono">8,500+</div>
                <div className="text-xs text-on-surface-variant mt-0.5">Active Attendees</div>
              </div>
              <div className="p-3 rounded-lg bg-surface-container-low">
                <div className="text-2xl font-bold text-secondary font-mono">98.4%</div>
                <div className="text-xs text-on-surface-variant mt-0.5">Verified QR Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 mt-10 space-y-8">
        
        {/* Search & Category Filter Bar */}
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
            <input
              type="text"
              placeholder="Search by event, location, or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant/60 rounded-lg text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/30"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-secondary text-on-secondary shadow-sm'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

        </div>

        {/* Events Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-on-surface tracking-tight">Active Events & Conferences</h2>
            <span className="text-xs text-on-surface-variant font-medium">Showing {filteredEvents.length} Event(s)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredEvents.map((ev) => {
              const isUserRegistered = registeredEventIds.includes(ev.id);
              return (
                <div
                  key={ev.id}
                  onClick={() => setActiveModalEvent(ev)}
                  className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-secondary/50 transition-all flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    <div className="relative h-48 overflow-hidden">
                      <img src={ev.banner} alt={ev.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-on-surface/80 backdrop-blur-md text-on-primary text-xs font-semibold">
                        {ev.badge}
                      </span>
                      {isUserRegistered && (
                        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-emerald-600 text-white text-xs font-bold shadow-md flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">check_circle</span>
                          <span>Registered</span>
                        </span>
                      )}
                    </div>

                    <div className="p-5 space-y-3">
                      <span className="text-xs font-bold text-secondary uppercase tracking-wider">{ev.category}</span>
                      <h3 className="text-base font-bold text-on-surface leading-snug line-clamp-2">{ev.title}</h3>
                      
                      <div className="space-y-1.5 text-xs text-on-surface-variant">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px] text-secondary">calendar_month</span>
                          <span>{ev.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px] text-secondary">location_on</span>
                          <span>{ev.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-3 border-t border-outline-variant/40 flex items-center justify-between">
                    <div className="text-xs text-on-surface-variant">
                      <strong className="text-on-surface font-semibold">{ev.registeredCount}</strong> / {ev.capacity}
                    </div>

                    {isUserRegistered ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveModalEvent(ev);
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
                      >
                        <span className="material-symbols-outlined text-[14px]">qr_code_2</span>
                        <span>Registered ✓ (View Pass)</span>
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveModalEvent(ev);
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-secondary text-on-secondary hover:bg-secondary-container text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
                      >
                        <span>Register</span>
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Pop-up Modal for Details, Schedule, Registration & Digital QR Pass */}
      {activeModalEvent && (
        <EventDetailsAndPassModal
          event={activeModalEvent}
          isOpen={!!activeModalEvent}
          onClose={() => setActiveModalEvent(null)}
          isRegistered={registeredEventIds.includes(activeModalEvent.id)}
          onConfirmRegistration={handleConfirmRegistration}
          currentUser={currentUser}
        />
      )}

    </div>
  );
}
