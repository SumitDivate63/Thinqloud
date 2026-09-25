import React, { useState, useEffect, useRef } from 'react';
import { Radio, Users, ThumbsUp, Send, Play, Pause, Volume2, Maximize, MessageSquare, HelpCircle, BarChart2, CheckCircle2, Sparkles } from 'lucide-react';
import { INITIAL_QA, INITIAL_POLL, SESSIONS, SPEAKERS } from '../data/conferenceData';
import { db, auth } from '../firebase';
import { collection, addDoc, onSnapshot, doc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';

export default function LiveStageSection({ currentUser }) {
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'qa' | 'poll'
  const [isPlaying, setIsPlaying] = useState(true);
  const [viewerCount, setViewerCount] = useState(3842);

  // Live Chat state
  const [chatMessages, setChatMessages] = useState([
    { id: 1, author: 'Dave K.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dave', text: 'Dr. Rostova’s paper on multi-agent consensus was mind-blowing!', time: '10:02 AM' },
    { id: 2, author: 'Elena M.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena', text: 'Hello everyone from Tokyo! 🇯🇵 Excited for the Cloud scaling track.', time: '10:05 AM' },
    { id: 3, author: 'Carlos R.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos', text: 'Is the Firebase Firestore vector search workshop hands-on only?', time: '10:08 AM' }
  ]);
  const [inputChat, setInputChat] = useState('');
  const chatBottomRef = useRef(null);

  // Live Q&A state (Firebase Firestore synced)
  const [qaList, setQaList] = useState(INITIAL_QA);
  const [questionInput, setQuestionInput] = useState('');

  // Live Poll state
  const [poll, setPoll] = useState(INITIAL_POLL);
  const [userVotedOption, setUserVotedOption] = useState(null);

  // Sync Q&A with Firebase Firestore if available
  useEffect(() => {
    try {
      const qRef = collection(db, 'conference_qa');
      const unsubscribe = onSnapshot(qRef, (snapshot) => {
        if (!snapshot.empty) {
          const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          // Sort by upvotes descending
          docs.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
          setQaList(docs);
        }
      }, (err) => {
        console.warn("Firestore live listener inactive, using local state fallback:", err);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn("Using local Q&A fallback");
    }
  }, []);

  // Viewer count slight fluctuation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount(prev => prev + Math.floor(Math.random() * 7) - 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Auto scroll chat
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  // Send Chat message
  const handleSendChat = (e) => {
    e.preventDefault();
    if (!inputChat.trim()) return;

    const newMsg = {
      id: Date.now(),
      author: currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Guest Attendee',
      avatar: currentUser?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
      text: inputChat,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, newMsg]);
    setInputChat('');
  };

  // Submit Question to Q&A (Firebase or Local)
  const handlePostQuestion = async (e) => {
    e.preventDefault();
    if (!questionInput.trim()) return;

    const newQ = {
      author: currentUser?.displayName || 'Attendee',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
      question: questionInput,
      upvotes: 1,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      answered: false
    };

    try {
      await addDoc(collection(db, 'conference_qa'), {
        ...newQ,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.warn("Posting to local state fallback:", err);
      setQaList(prev => [ { ...newQ, id: `qa-${Date.now()}` }, ...prev ]);
    }

    setQuestionInput('');
  };

  // Upvote Question
  const handleUpvoteQuestion = async (id) => {
    try {
      const qDocRef = doc(db, 'conference_qa', id);
      await updateDoc(qDocRef, { upvotes: increment(1) });
    } catch (err) {
      // Local fallback
      setQaList(prev => prev.map(q => q.id === id ? { ...q, upvotes: q.upvotes + 1 } : q));
    }
  };

  // Vote in Poll
  const handleVotePoll = (optionId) => {
    if (userVotedOption) return;
    setUserVotedOption(optionId);
    setPoll(prev => ({
      ...prev,
      options: prev.options.map(opt => opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt)
    }));
  };

  const totalPollVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);

  return (
    <section style={{ padding: '2rem 1.5rem', maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* Header Info */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span className="badge badge-pink" style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffffff', display: 'inline-block' }} />
              LIVE STAGE 1
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Broadcasting in Ultra-HD 4K</span>
          </div>
          <h2 style={{ fontSize: '2rem', marginTop: '0.25rem' }}>Keynote: The Next Epoch of Autonomous AI</h2>
        </div>

        <div className="glass-card" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem' }}>
          <Users size={18} color="var(--accent-cyan)" />
          <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{viewerCount.toLocaleString()}</span>
          <span style={{ color: 'var(--text-muted)' }}>Concurrent Viewers</span>
        </div>
      </div>

      {/* Main Grid: Video Player + Interactive Tab Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Left Column: Simulated Video Player Screen */}
        <div>
          <div 
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '16/9',
              background: '#05070c',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              border: '1px solid var(--border-glow)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between',
              padding: '1.5rem'
            }}
          >
            {/* Background Graphic Simulated Broadcast */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at 60% 40%, rgba(99, 102, 241, 0.25) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(6, 182, 212, 0.2) 0%, transparent 50%)',
              zIndex: 1
            }} />

            {/* Video Content Banner (Simulated Keynote Presentation) */}
            <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(8px)', padding: '0.4rem 0.9rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>Speaker: Dr. Elena Rostova</span>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.6)', padding: '0.3rem 0.7rem', borderRadius: '4px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                1080p 60fps • 48ms Latency
              </div>
            </div>

            {/* Center Stage Presentation Graphic */}
            <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', margin: 'auto' }}>
              {!isPlaying ? (
                <button onClick={() => setIsPlaying(true)} className="btn btn-primary btn-lg" style={{ borderRadius: '50%', width: '80px', height: '80px', padding: 0 }}>
                  <Play size={36} fill="#ffffff" />
                </button>
              ) : (
                <div style={{ padding: '2rem', background: 'rgba(10, 15, 25, 0.6)', backdropFilter: 'blur(12px)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.1)', maxWidth: '480px', margin: '0 auto' }}>
                  <Sparkles size={32} color="var(--accent-cyan)" style={{ marginBottom: '0.75rem' }} />
                  <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>Autonomous Neural Architecture Diagram</h3>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent-pink)' }}>
                    [LIVE SLIDE 14/28: Multi-Agent State Synchronization Protocol]
                  </div>
                </div>
              )}
            </div>

            {/* Video Controls Bar */}
            <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button onClick={() => setIsPlaying(!isPlaying)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <Volume2 size={20} color="var(--text-muted)" />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>00:42:19 / 01:15:00</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '0.75rem', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                  DVR Enabled
                </span>
                <Maximize size={20} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Interactive Tabbed Panel (Chat, Q&A, Polls) */}
        <div className="glass-panel" style={{ height: '560px', display: 'flex', flexDirection: 'column' }}>
          
          {/* Tabs Navigation */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)' }}>
            {[
              { id: 'chat', label: 'Live Chat', icon: MessageSquare },
              { id: 'qa', label: 'Q&A', icon: HelpCircle, badge: qaList.length },
              { id: 'poll', label: 'Poll', icon: BarChart2 }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '0.85rem 0.5rem',
                    background: isActive ? 'var(--bg-card)' : 'transparent',
                    color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                    border: 'none',
                    borderBottom: isActive ? '2px solid var(--primary)' : 'none',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="badge badge-cyan" style={{ fontSize: '0.65rem', padding: '0.05rem 0.3rem' }}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* TAB 1: Live Chat */}
          {activeTab === 'chat' && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
              <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {chatMessages.map(msg => (
                  <div key={msg.id} style={{ display: 'flex', gap: '0.6rem', fontSize: '0.85rem' }}>
                    <img src={msg.avatar} alt={msg.author} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div style={{ flex: 1, background: 'rgba(255, 255, 255, 0.03)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                        <span style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>{msg.author}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{msg.time}</span>
                      </div>
                      <div style={{ color: 'var(--text-main)', lineHeight: 1.4 }}>{msg.text}</div>
                    </div>
                  </div>
                ))}
                <div ref={chatBottomRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendChat} style={{ padding: '0.75rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Say something in live chat..."
                  value={inputChat}
                  onChange={(e) => setInputChat(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.55rem 0.85rem',
                    color: '#fff',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
                <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '0.55rem 0.85rem' }}>
                  <Send size={16} />
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: Live Q&A */}
          {activeTab === 'qa' && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
              {/* Question Input */}
              <form onSubmit={handlePostQuestion} style={{ padding: '0.85rem', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Ask speaker a question..."
                  value={questionInput}
                  onChange={(e) => setQuestionInput(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.55rem 0.85rem',
                    color: '#fff',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
                <button type="submit" className="btn btn-primary btn-sm">Ask</button>
              </form>

              {/* Q&A List */}
              <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {qaList.map(q => (
                  <div key={q.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-main)' }}>{q.author}</span>
                      <button 
                        onClick={() => handleUpvoteQuestion(q.id)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.2rem 0.5rem', gap: '0.3rem', fontSize: '0.75rem' }}
                      >
                        <ThumbsUp size={12} color="var(--primary)" />
                        <span>{q.upvotes}</span>
                      </button>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{q.question}</p>
                    {q.answered && (
                      <div style={{ marginTop: '0.4rem', fontSize: '0.7rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <CheckCircle2 size={12} /> Answered on stream
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Live Poll */}
          {activeTab === 'poll' && (
            <div style={{ padding: '1.25rem', overflowY: 'auto' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--accent-purple)', fontWeight: 700, uppercase: 'true', marginBottom: '0.5rem' }}>
                LIVE AUDIENCE POLL
              </div>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '1.25rem', lineHeight: 1.4 }}>{poll.question}</h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {poll.options.map(opt => {
                  const percent = totalPollVotes > 0 ? Math.round((opt.votes / totalPollVotes) * 100) : 0;
                  const isSelected = userVotedOption === opt.id;

                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleVotePoll(opt.id)}
                      style={{
                        position: 'relative',
                        padding: '0.85rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                        background: 'rgba(255, 255, 255, 0.03)',
                        cursor: userVotedOption ? 'default' : 'pointer',
                        overflow: 'hidden'
                      }}
                    >
                      {/* Percent Fill Bar */}
                      {userVotedOption && (
                        <div style={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: `${percent}%`,
                          background: isSelected ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                          transition: 'width 0.6s ease'
                        }} />
                      )}

                      <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.88rem' }}>
                        <span style={{ fontWeight: isSelected ? 700 : 500 }}>{opt.text}</span>
                        {userVotedOption && (
                          <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>{percent}%</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: '1.25rem', fontSize: '0.8rem', color: 'var(--text-dim)', textAlign: 'center' }}>
                Total Votes Recorded: {totalPollVotes.toLocaleString()}
              </div>
            </div>
          )}

        </div>

      </div>

    </section>
  );
}
