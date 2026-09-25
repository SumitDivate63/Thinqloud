export const CONFERENCE_INFO = {
  name: "ThinqSummit 2026",
  tagline: "The Premier Global Cloud, AI & Next-Gen Developer Summit",
  dateRange: "November 12 - 14, 2026",
  location: "Moscone Center, San Francisco & Online",
  expectedAttendees: "8,500+",
  activeTrackCount: 5,
  liveStreamStatus: "LIVE NOW",
  startDateISO: "2026-11-12T09:00:00Z"
};

export const TRACKS = [
  { id: "all", label: "All Tracks", icon: "Layers" },
  { id: "ai", label: "AI & Neural Tech", color: "cyan", icon: "Cpu" },
  { id: "cloud", label: "Cloud & DevOps", color: "purple", icon: "Cloud" },
  { id: "web", label: "Web Architecture", color: "pink", icon: "Code" },
  { id: "security", label: "Zero-Trust Security", color: "emerald", icon: "Shield" },
  { id: "web3", label: "Distributed Systems", color: "amber", icon: "Globe" }
];

export const DAYS = [
  { id: "day1", label: "Day 1", date: "Nov 12, 2026", subtitle: "Keynotes & AI Frontiers" },
  { id: "day2", label: "Day 2", date: "Nov 13, 2026", subtitle: "Cloud & Dev Infrastructure" },
  { id: "day3", label: "Day 3", date: "Nov 14, 2026", subtitle: "Security, Scaling & Workshops" }
];

export const SPEAKERS = [
  {
    id: "spk-1",
    name: "Dr. Elena Rostova",
    role: "VP of Artificial Intelligence",
    company: "DeepMind Robotics",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    bio: "Pioneer in autonomous agent architectures and large multimodal models. Author of 'Autonomous Decision Systems in High-Throughput Environments'.",
    topics: ["Autonomous Agents", "LLM Fine-Tuning", "Neural Optimization"],
    featured: true
  },
  {
    id: "spk-2",
    name: "Marcus Vance",
    role: "Chief Cloud Architect",
    company: "ThinqCloud Global",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    bio: "Ex-AWS Principal Engineer leading multi-region serverless resiliency for Fortune 100 enterprise deployments.",
    topics: ["Serverless at Scale", "Multi-Cloud Strategy", "Zero Downtime Deployments"],
    featured: true
  },
  {
    id: "spk-3",
    name: "Sarah Jenkins",
    role: "Head of Developer Experience",
    company: "Vercel Labs",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80",
    bio: "Obsessed with latency, edge compute, and micro-frontends. Creator of open-source frontend performance benchmarks.",
    topics: ["Edge Compute", "React Server Components", "Web Vitals"],
    featured: true
  },
  {
    id: "spk-4",
    name: "Aarav Sharma",
    role: "Director of Information Security",
    company: "ShieldCorp Cyber",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    bio: "Cybersecurity specialist specializing in eBPF kernel security, zero-trust service meshes, and post-quantum cryptographic primitives.",
    topics: ["Zero-Trust Security", "eBPF Kernel Monitoring", "Quantum Encryption"],
    featured: false
  },
  {
    id: "spk-5",
    name: "Sophia Chen",
    role: "Lead Platform Engineer",
    company: "Kubernetes Foundation",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80",
    bio: "K8s maintainer and cloud-native advocate. Has built platform engineering teams across 3 tech unicorns.",
    topics: ["Platform Engineering", "GitOps Automation", "Kubernetes Operators"],
    featured: true
  },
  {
    id: "spk-6",
    name: "David Sterling",
    role: "Founder & CEO",
    company: "Quantum Scale Systems",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    bio: "Building high-performance distributed databases that handle 10M+ writes per second across global edge nodes.",
    topics: ["Distributed Storage", "Consensus Algorithms", "Edge DBs"],
    featured: false
  }
];

export const SESSIONS = [
  {
    id: "sess-101",
    day: "day1",
    time: "09:00 AM - 10:15 AM",
    title: "Keynote: The Next Epoch of Autonomous AI & Cloud Platforms",
    abstract: "Join Dr. Elena Rostova and Marcus Vance as they unveil breaking breakthroughs in self-healing multi-cloud infrastructure and agentic developer workflows.",
    track: "ai",
    speakerIds: ["spk-1", "spk-2"],
    room: "Grand Ballroom A (Main Stage)",
    isLive: true,
    capacity: 2500,
    tags: ["Keynote", "AI Architecture", "Future Trends"]
  },
  {
    id: "sess-102",
    day: "day1",
    time: "10:30 AM - 11:30 AM",
    title: "Mastering Real-Time LLM Streaming at Scale with Firebase & Edge",
    abstract: "Learn how to build sub-50ms latency AI chatbots using WebSockets, edge workers, and real-time document sync.",
    track: "ai",
    speakerIds: ["spk-1"],
    room: "Stage 2 - AI Hub",
    isLive: false,
    capacity: 600,
    tags: ["LLM", "Firebase", "WebSockets"]
  },
  {
    id: "sess-103",
    day: "day1",
    time: "11:45 AM - 12:45 PM",
    title: "Building Instant Reactive Frontends with React 19 & Vite",
    abstract: "Deep dive into server actions, compiler optimization, and responsive design systems for modern enterprise web apps.",
    track: "web",
    speakerIds: ["spk-3"],
    room: "Stage 3 - Frontend Theatre",
    isLive: false,
    capacity: 800,
    tags: ["React 19", "Vite", "Performance"]
  },
  {
    id: "sess-201",
    day: "day2",
    time: "09:30 AM - 10:45 AM",
    title: "Multi-Region Cloud Resiliency: Preventing Global Outages",
    abstract: "Architectural patterns for active-active database replication, automated DNS failover, and zero data loss strategies under chaos engineering stress.",
    track: "cloud",
    speakerIds: ["spk-2", "spk-5"],
    room: "Grand Ballroom A",
    isLive: false,
    capacity: 2000,
    tags: ["DevOps", "Reliability", "Chaos Engineering"]
  },
  {
    id: "sess-202",
    day: "day2",
    time: "11:00 AM - 12:00 PM",
    title: "Zero-Trust Mesh in Kubernetes: Securing 10,000 Microservices",
    abstract: "How to enforce mutual TLS, eBPF security policies, and real-time vulnerability detection in high-concurrency clusters.",
    track: "security",
    speakerIds: ["spk-4"],
    room: "Stage 4 - Security Lab",
    isLive: false,
    capacity: 500,
    tags: ["eBPF", "Kubernetes", "Zero-Trust"]
  },
  {
    id: "sess-203",
    day: "day2",
    time: "02:00 PM - 03:15 PM",
    title: "Internal Developer Platforms (IDP): Reducing Onboarding from Weeks to Minutes",
    abstract: "Step-by-step walkthrough of creating self-service developer portals backed by K8s operators and GitOps workflows.",
    track: "cloud",
    speakerIds: ["spk-5"],
    room: "Stage 2 - Cloud Hub",
    isLive: false,
    capacity: 750,
    tags: ["Platform Engineering", "GitOps", "K8s"]
  },
  {
    id: "sess-301",
    day: "day3",
    time: "10:00 AM - 11:15 AM",
    title: "Global Distributed Databases: Achieving 10M+ Writes/Sec at the Edge",
    abstract: "Exploring Raft consensus optimization, geo-partitioning strategies, and low-latency storage primitives for web3 and real-time apps.",
    track: "web3",
    speakerIds: ["spk-6"],
    room: "Grand Ballroom B",
    isLive: false,
    capacity: 1200,
    tags: ["Distributed DB", "Consensus", "Performance"]
  },
  {
    id: "sess-302",
    day: "day3",
    time: "01:30 PM - 03:00 PM",
    title: "Hands-On Workshop: Deploying Production AI Agents with Firebase & Vector Search",
    abstract: "Bring your laptop! Build and deploy an AI customer support agent using Firebase Cloud Functions, Firestore vector embeddings, and real-time state sync.",
    track: "ai",
    speakerIds: ["spk-1", "spk-3"],
    room: "Workshop Hall C",
    isLive: false,
    capacity: 350,
    tags: ["Hands-on", "AI Workshop", "Firebase Vector Search"]
  }
];

export const INITIAL_QA = [
  {
    id: "qa-1",
    author: "Alex Rivers",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    question: "How does the autonomous agent handle cross-region failovers when state synchronization is still in-flight?",
    upvotes: 42,
    timestamp: "10:04 AM",
    answered: true
  },
  {
    id: "qa-2",
    author: "Priya Patel",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    question: "Are Firebase vector search indexes compatible with multi-modal embeddings out of the box?",
    upvotes: 29,
    timestamp: "10:11 AM",
    answered: false
  },
  {
    id: "qa-3",
    author: "Michael Chang",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    question: "What is the memory overhead per eBPF probe when monitoring high-throughput gRPC connections?",
    upvotes: 18,
    timestamp: "10:14 AM",
    answered: false
  }
];

export const INITIAL_POLL = {
  question: "Which technology stack will dominate your team's architecture roadmap in 2027?",
  options: [
    { id: "opt-1", text: "Autonomous AI Agents + Vector DBs", votes: 412 },
    { id: "opt-2", text: "Multi-Cloud Serverless & Edge Compute", votes: 298 },
    { id: "opt-3", text: "Zero-Trust eBPF Kernel Infrastructure", votes: 154 },
    { id: "opt-4", text: "WebAssembly + Micro-Frontends", votes: 96 }
  ]
};

export const SPONSORS = [
  { name: "ThinqCloud Global", tier: "Platinum Title Sponsor", logo: "⚡ ThinqCloud" },
  { name: "DeepMind AI", tier: "Platinum Sponsor", logo: "🧠 DeepMind" },
  { name: "Vercel Labs", tier: "Gold Sponsor", logo: "▲ Vercel" },
  { name: "ShieldCorp Cyber", tier: "Gold Sponsor", logo: "🛡️ ShieldCorp" },
  { name: "Firebase", tier: "Technology Partner", logo: "🔥 Firebase" }
];
