import React, { useState } from 'react';
import { SESSIONS, SPEAKERS } from '../../data/conferenceData';

export default function StitchLandingPage({ onSelectEvent, onRegisterEvent, onOpenQRScanner }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Academic & Research', 'Enterprise Tech', 'Hackathons & AI', 'Workshops'];

  const sampleEvents = [
    {
      id: 'event-1',
      title: 'ThinqSummit 2026: Global Cloud & AI Architecture',
      category: 'Enterprise Tech',
      date: 'Nov 12 - 14, 2026',
      location: 'Moscone Center, San Francisco & Online',
      organizer: 'ThinqCloud Engineering',
      capacity: '8,500 Capacity',
      registeredCount: 5420,
      banner: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
      badge: 'Featured Flagship',
      status: 'Registration Open'
    },
    {
      id: 'event-2',
      title: 'Autonomous AI Agents & Neural Consensus Symposium',
      category: 'Hackathons & AI',
      date: 'Nov 13, 2026',
      location: 'Stage 2 — AI Hub',
      organizer: 'DeepMind Robotics Lab',
      capacity: '1,200 Capacity',
      registeredCount: 980,
      banner: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80',
      badge: 'Live Stream Active',
      status: 'Limited Seats'
    },
    {
      id: 'event-3',
      title: 'Zero-Trust Kernel & eBPF Security Operations Workshop',
      category: 'Academic & Research',
      date: 'Nov 14, 2026',
      location: 'Stage 4 — Security Lab',
      organizer: 'ShieldCorp Cybersecurity',
      capacity: '600 Capacity',
      registeredCount: 450,
      banner: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
      badge: 'Hands-on Lab',
      status: 'Registration Open'
    }
  ];

  const filteredEvents = sampleEvents.filter(ev => {
    const matchCat = selectedCategory === 'All' || ev.category === selectedCategory;
    const matchSearch = !searchQuery || ev.title.toLowerCase().includes(searchQuery.toLowerCase()) || ev.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

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
                onClick={() => onRegisterEvent('event-1')}
                className="px-6 py-3 rounded-lg bg-secondary text-on-secondary font-semibold text-sm hover:bg-secondary-container transition-all shadow-md flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">badge</span>
                <span>Register for EventPass</span>
              </button>
              <button
                onClick={onOpenQRScanner}
                className="px-6 py-3 rounded-lg bg-surface-container-lowest border border-outline-variant text-on-surface font-semibold text-sm hover:bg-surface-container-low transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">qr_code_scanner</span>
                <span>Scan Attendance QR</span>
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
            {filteredEvents.map((ev) => (
              <div
                key={ev.id}
                className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-secondary/50 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-48 overflow-hidden">
                    <img src={ev.banner} alt={ev.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-on-surface/80 backdrop-blur-md text-on-primary text-xs font-semibold">
                      {ev.badge}
                    </span>
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
                  <button
                    onClick={() => onRegisterEvent(ev.id)}
                    className="px-3.5 py-1.5 rounded-lg bg-surface-container-high text-secondary hover:bg-secondary hover:text-on-secondary text-xs font-bold transition-all flex items-center gap-1"
                  >
                    <span>Register</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
