export type ScreenContentType =
  | { type: 'identity' }
  | {
      type: 'about'
      name: string
      role: string
      bio: string
      tagline?: string
      institution: string
      stats: { label: string; val: string; sub?: string }[]
      pillars: string[]
      techStack: string[]
    }
  | {
      type: 'github'
      username: string
      reposCount: number
      followersCount?: number
      languages: string[]
      topRepo: string
      repoDesc: string
    }
  | { type: 'news'; headline?: string; ticker?: string; tag?: string }
  | { type: 'tabloid-news'; headline?: string; ticker?: string; tag?: string }
  | { type: 'cracked-bars' }
  | { type: 'tv-error'; errorCode?: string; message?: string }
  | { type: 'broken-screen'; pattern?: 'bars' | 'fracture' | 'rgb-split' }
  | { type: 'text'; title: string; body?: string; subtitle?: string; tags?: string[] }
  | { type: 'project'; projectId: string }
  | { type: 'architecture'; projectId: string }
  | { type: 'code'; title: string; language: string; lines: string[] }
  | { type: 'terminal'; lines: string[] }
  | { type: 'skills'; category?: string; items?: string[] }
  | { type: 'education'; institution: string; degree: string; detail: string; year?: string }
  | { type: 'experience'; role: string; company: string; period: string; points: string[] }
  | { type: 'test-bars' }
  | { type: 'static-noise' }
  | { type: 'visual-art'; theme: 'sunset' | 'grid' | 'signal' | 'radar' | 'waves' }
  | { type: 'ambient' }
  | { type: 'contact' }

export type MonitorVariant = 'crt' | 'flat' | 'suspended' | 'wall' | 'terminal' | 'large' | 'compact'
export type MonitorImportance = 'ambient' | 'secondary' | 'primary'

export type MonitorData = {
  id: string
  type: MonitorVariant
  position: [number, number, number]
  rotation: [number, number, number]
  scale: number
  activationAt: number
  contentId: string
  importance: MonitorImportance
  content: ScreenContentType
  screenColor?: string // emissive spill color
}

export const monitors: MonitorData[] = [
  // =========================================================================
  // STAGE 01: IDENTITY / HERO ARRIVAL (0.00 - 0.10)
  // Character arrives in corridor surrounded by floating CRT monitors
  // =========================================================================
  {
    id: 'hero-identity-main',
    type: 'crt',
    position: [0, 1.76, -3.3],
    rotation: [0, 0, 0],
    scale: 1.20,
    activationAt: 0.0,
    contentId: 'hero-identity',
    importance: 'primary',
    content: { type: 'identity' },
    screenColor: '#00f0ff',
  },
  {
    id: 'hero-crt-left-mid',
    type: 'crt',
    position: [-2.35, 1.65, -2.1],
    rotation: [0.04, 0.46, -0.03],
    scale: 1.0,
    activationAt: 0.0,
    contentId: 'hero-news-tv',
    importance: 'secondary',
    content: {
      type: 'news',
      headline: 'CROSS-PLATFORM & BACKEND ARCHITECTURE',
      ticker: 'ENGINEERING UPDATE: MEHUL SOLANKI • FLUTTER & ANDROID ARCHITECTURES • SCALABLE REST APIS WITH JWT AUTH • MACHINE LEARNING PIPELINES • DDCET STATE RANK #113 • AVAILABLE FOR OPPORTUNITIES • ',
      tag: 'FEATURED RELEASE',
    },
    screenColor: '#38bdf8',
  },
  {
    id: 'hero-crt-right-mid',
    type: 'crt',
    position: [2.35, 1.6, -2.1],
    rotation: [-0.03, -0.46, 0.04],
    scale: 1.0,
    activationAt: 0.0,
    contentId: 'hero-terminal-status',
    importance: 'secondary',
    content: {
      type: 'terminal',
      lines: [
        '$ sysctl -a sys.profile',
        'NAME: Mehul Solanki',
        'ROLE: Software Engineer',
        'FOCUS: Backend / Flutter / ML',
        'ACADEMIC: L.D. College of Eng (IT)',
        'STATUS: Available for Opportunities',
        '$ ready --listen 0.0.0.0:4000',
      ],
    },
    screenColor: '#10b981',
  },
  {
    id: 'hero-crt-top-left',
    type: 'crt',
    position: [-2.05, 2.9, -3.4],
    rotation: [0.22, 0.32, -0.04],
    scale: 0.88,
    activationAt: 0.0,
    contentId: 'hero-tv-error',
    importance: 'ambient',
    content: {
      type: 'tv-error',
      errorCode: 'STATUS_HEALTHY_0x00',
      message: 'ALL SERVICES ONLINE & OPERATIONAL',
    },
    screenColor: '#10b981',
  },
  {
    id: 'hero-crt-top-right',
    type: 'crt',
    position: [2.05, 2.85, -3.4],
    rotation: [0.22, -0.32, 0.04],
    scale: 0.88,
    activationAt: 0.0,
    contentId: 'hero-broken-screen',
    importance: 'ambient',
    content: { type: 'broken-screen', pattern: 'rgb-split' },
    screenColor: '#00f0ff',
  },
  {
    id: 'hero-crt-bottom-left',
    type: 'crt',
    position: [-2.85, 0.65, -2.8],
    rotation: [-0.14, 0.52, 0.08],
    scale: 0.85,
    activationAt: 0.0,
    contentId: 'hero-code-snippet',
    importance: 'ambient',
    content: {
      type: 'code',
      title: 'prime_news.dart',
      language: 'dart',
      lines: [
        'void main() async {',
        '  WidgetsFlutterBinding.ensureInitialized();',
        '  await Firebase.initializeApp();',
        '  runApp(const PrimeNewsApp());',
        '}',
      ],
    },
    screenColor: '#00f0ff',
  },
  {
    id: 'hero-crt-bottom-right',
    type: 'crt',
    position: [2.8, 0.68, -2.8],
    rotation: [-0.14, -0.52, -0.06],
    scale: 0.85,
    activationAt: 0.0,
    contentId: 'hero-ml-code',
    importance: 'ambient',
    content: {
      type: 'code',
      title: 'classifier_pipeline.py',
      language: 'python',
      lines: [
        'from sklearn.ensemble import RandomForestClassifier',
        'from sklearn.metrics import roc_auc_score',
        'model = RandomForestClassifier(n_estimators=100)',
        'model.fit(X_train, y_train)',
        'score = roc_auc_score(y_test, model.predict_proba(X_test))',
      ],
    },
    screenColor: '#10b981',
  },
  {
    id: 'hero-crt-cracked-bars',
    type: 'crt',
    position: [-3.45, 2.92, -2.0],
    rotation: [0.10, 0.60, -0.03],
    scale: 0.95,
    activationAt: 0.0,
    contentId: 'hero-cracked-bars',
    importance: 'secondary',
    content: { type: 'cracked-bars' },
    screenColor: '#ff0055',
  },
  {
    id: 'hero-crt-tabloid-news',
    type: 'crt',
    position: [3.45, 2.92, -2.0],
    rotation: [0.10, -0.60, 0.03],
    scale: 0.95,
    activationAt: 0.0,
    contentId: 'hero-tabloid-news',
    importance: 'secondary',
    content: {
      type: 'tabloid-news',
      headline: 'MEHUL SOLANKI SHATTERS BENCHMARKS: UNSTOPPABLE FULL-STACK CODE SPREE!',
      ticker: '*** PRIME 24 EXCLUSIVE: MEHUL SOLANKI SETS NEW STANDARD IN FULL-STACK ENGINEERING *** STATE DDCET RANK #113 OFFICIALLY VALIDATED *** FLUTTER MOBILE ARCHITECTURE REPORTED STABLE IN PRODUCTION *** HIGH-PERFORMANCE REST APIS VERIFIED WITH ZERO PACKET LOSS *** IMMEDIATE INTERVIEW INQUIRIES ROUTING TO CONTACT TERMINAL *** STAY TUNED FOR LIVE UPDATES *** ',
      tag: 'PRIME 24 NEWS',
    },
    screenColor: '#ef4444',
  },

  // =========================================================================
  // SECTION 02: ABOUT ME TV (z = -6.4, activationAt = 0.14)
  // Large physical CRT monitor displaying Mehul Solanki's About Me Dossier
  // =========================================================================
  {
    id: 'tv-about-main',
    type: 'large',
    position: [0, 1.68, -6.4],
    rotation: [0, 0, 0],
    scale: 1.32,
    activationAt: 0.14,
    contentId: 'about-main',
    importance: 'primary',
    content: {
      type: 'about',
      name: 'Mehul Solanki',
      role: 'Software Engineer · Backend & Mobile',
      tagline: 'Engineering Scalable Backends, Cross-Platform Mobile Apps & Machine Learning Pipelines',
      bio: 'Software Engineer focused on Backend Systems, Flutter, Android, and Machine Learning. Committed to building robust, high-performance software architectures that balance engineering rigor, modular clean architecture, and modern user experience.',
      institution: 'L.D. College of Engineering (B.E. IT)',
      stats: [
        { label: 'DDCET RANK', val: '#113', sub: 'STATEWIDE TOP TIER' },
        { label: 'SPECIALIZATION', val: 'FULL STACK', sub: 'FLUTTER / NODE / ML' },
        { label: 'CORE FOCUS', val: 'CLEAN ARCH', sub: 'SYSTEM DESIGN' },
      ],
      pillars: [
        'Modular RESTful Backends & Relational Database Design',
        'Production Cross-Platform Flutter & Android Applications',
        'Applied Machine Learning & Predictive Modeling Pipelines',
      ],
      techStack: ['Flutter', 'Node.js', 'Python', 'Dart', 'Android', 'PostgreSQL', 'Firebase'],
    },
    screenColor: '#00f0ff',
  },
  {
    id: 'tv-about-philosophy',
    type: 'crt',
    position: [-2.85, 1.6, -6.7],
    rotation: [0.06, 0.42, 0],
    scale: 1.0,
    activationAt: 0.14,
    contentId: 'about-philosophy',
    importance: 'secondary',
    content: {
      type: 'terminal',
      lines: [
        '// CORE SOFTWARE ENGINEERING PRINCIPLES',
        '$ cat /etc/engineering_principles.sys',
        '> 01. Modular Clean Architecture & Separation of Concerns',
        '> 02. Predictable State Flow & Unidirectional Data Binding',
        '> 03. High Runtime Performance, Low Latency & Fluid UX',
        '> 04. Robust Error Handling, Input Validation & Strict Typing',
        '> 05. Scalable REST APIs & Normalized Database Schemas',
        'STATUS: PRODUCTION STANDARDS VERIFIED',
      ],
    },
    screenColor: '#10b981',
  },
  {
    id: 'tv-about-stats',
    type: 'compact',
    position: [2.85, 1.6, -6.7],
    rotation: [0.06, -0.42, 0],
    scale: 1.0,
    activationAt: 0.14,
    contentId: 'about-stats',
    importance: 'secondary',
    content: {
      type: 'text',
      title: 'PROFILE SUMMARY',
      subtitle: 'CAREER & FOCUS',
      body: 'Dedicated to architecting reliable, production-grade applications. Continuously refining technical depth across backend microservices, mobile frameworks, and applied data science.',
      tags: ['Problem Solving', 'Clean Architecture', 'Continuous Learning', 'Software Engineering'],
    },
    screenColor: '#38bdf8',
  },

  // =========================================================================
  // SECTION 03: PROJECTS SHOWCASE SLIDER (z = -12.0, activationAt = 0.30)
  // ONE LARGE ACTIVE CRT TV with directional slide animations between projects
  // =========================================================================
  {
    id: 'tv-project-slider',
    type: 'large',
    position: [0, 1.82, -12.0],
    rotation: [0.04, 0, 0],
    scale: 1.42,
    activationAt: 0.30,
    contentId: 'project-slider',
    importance: 'primary',
    content: { type: 'project', projectId: 'project-01' },
    screenColor: '#00f0ff',
  },
  {
    id: 'tv-project-arch',
    type: 'crt',
    position: [-2.85, 1.65, -12.4],
    rotation: [0.06, 0.40, 0],
    scale: 1.0,
    activationAt: 0.31,
    contentId: 'project-arch',
    importance: 'secondary',
    content: { type: 'architecture', projectId: 'project-01' },
    screenColor: '#38bdf8',
  },
  {
    id: 'tv-project-code',
    type: 'terminal',
    position: [2.85, 1.65, -12.4],
    rotation: [0.06, -0.40, 0],
    scale: 1.0,
    activationAt: 0.31,
    contentId: 'project-code',
    importance: 'secondary',
    content: {
      type: 'terminal',
      lines: [
        '$ git log --oneline -n 4',
        'a1f893c feat(core): production reactive pipeline',
        'c83d12b perf: sub-second cache invalidation layer',
        'e091b4a test: 94% coverage on unit & integration',
        'f52b771 ci: multi-platform automated release build',
      ],
    },
    screenColor: '#10b981',
  },

  // =========================================================================
  // SECTION 04: ACADEMIC JOURNEY (z = -17.5, activationAt = 0.48)
  // L.D. College of Engineering (B.E. IT) & DDCET Rank 113 Recognition
  // =========================================================================
  {
    id: 'tv-academic-main',
    type: 'large',
    position: [-2.4, 1.62, -17.5],
    rotation: [0.04, 0.38, 0],
    scale: 1.3,
    activationAt: 0.48,
    contentId: 'academic-main',
    importance: 'primary',
    content: {
      type: 'education',
      institution: 'L.D. College of Engineering',
      degree: 'B.E. — Information Technology (Ongoing)',
      detail: 'Core coursework spanning software engineering, database management, and mobile application development.',
      year: '2023 - Present',
    },
    screenColor: '#f59e0b',
  },
  {
    id: 'tv-academic-rank',
    type: 'crt',
    position: [2.4, 1.62, -17.5],
    rotation: [0.04, -0.38, 0],
    scale: 1.15,
    activationAt: 0.49,
    contentId: 'academic-rank',
    importance: 'primary',
    content: {
      type: 'education',
      institution: 'DDCET Examination & Academic Honors',
      degree: 'Statewide Rank #113 // Academic Distinction',
      detail: 'Ranked 113 in DDCET entrance examination statewide; recognized for balancing strong academic performance with practical software engineering.',
      year: 'Rank #113',
    },
    screenColor: '#fef08a',
  },
  {
    id: 'tv-academic-hackathon',
    type: 'compact',
    position: [-3.15, 2.45, -17.9],
    rotation: [0.12, 0.44, -0.04],
    scale: 0.95,
    activationAt: 0.50,
    contentId: 'academic-hackathon',
    importance: 'secondary',
    content: {
      type: 'text',
      title: 'TECHSHASTRA 2K26',
      subtitle: '24-HOUR HACKATHON',
      body: 'Participated in competitive 24-hour hackathon, designing and prototyping cross-platform full-stack solutions within rigorous sprint constraints.',
      tags: ['Hackathon', 'Rapid Prototyping', 'Team Collaboration'],
    },
    screenColor: '#ec4899',
  },

  // =========================================================================
  // SECTION 05: PROFESSIONAL EXPERIENCE (z = -23.0, activationAt = 0.64)
  // Flutter Developer Intern @ InfoLabz & Independent Engineering
  // =========================================================================
  {
    id: 'tv-experience-infolabz',
    type: 'large',
    position: [2.4, 1.62, -23.0],
    rotation: [0.04, -0.38, 0],
    scale: 1.3,
    activationAt: 0.64,
    contentId: 'exp-infolabz',
    importance: 'primary',
    content: {
      type: 'experience',
      role: 'Flutter Developer Intern',
      company: 'InfoLabz IT Services',
      period: '2024',
      points: [
        'Developed & maintained cross-platform Flutter mobile features',
        'Integrated Firebase for authentication and real-time cloud data storage',
        'Collaborated with engineering team to deliver user-centered screens on release cycles',
      ],
    },
    screenColor: '#00f0ff',
  },
  {
    id: 'tv-experience-independent',
    type: 'large',
    position: [-2.4, 1.62, -23.0],
    rotation: [0.04, 0.38, 0],
    scale: 1.25,
    activationAt: 0.64,
    contentId: 'exp-independent',
    importance: 'primary',
    content: {
      type: 'experience',
      role: 'Independent Developer',
      company: 'Software Engineering Projects',
      period: '2023 - Present',
      points: [
        'Architected end-to-end REST APIs with JWT authentication and relational databases',
        'Built cross-platform Flutter and native Android applications',
        'Developed machine learning evaluation pipelines using Python and Scikit-learn',
      ],
    },
    screenColor: '#10b981',
  },
  {
    id: 'tv-experience-certifications',
    type: 'crt',
    position: [3.15, 2.45, -23.4],
    rotation: [0.12, -0.44, 0.04],
    scale: 0.95,
    activationAt: 0.65,
    contentId: 'exp-certs',
    importance: 'secondary',
    content: {
      type: 'text',
      title: 'CREDENTIALS',
      subtitle: 'VERIFIED CERTIFICATIONS',
      body: 'Android App Development · Web3 Basics · Arbitrum Stylus Foundation · Arbitrum Stylus Core Concepts · Fundamentals of Digital Marketing.',
      tags: ['Android', 'Systems', 'Web Development'],
    },
    screenColor: '#38bdf8',
  },

  // =========================================================================
  // SECTION 06: TECHNICAL SKILLS (z = -28.5, activationAt = 0.80)
  // Categorized technical displays (NO percentage bars)
  // =========================================================================
  {
    id: 'tv-skills-mobile',
    type: 'crt',
    position: [-2.6, 1.62, -28.5],
    rotation: [0.04, 0.40, 0],
    scale: 1.18,
    activationAt: 0.80,
    contentId: 'skills-mobile',
    importance: 'primary',
    content: {
      type: 'skills',
      category: 'MOBILE & CLIENT',
      items: ['Flutter & Dart', 'Android / Kotlin / Java', 'Firebase Cloud Sync', 'State Management (BLoC/Provider)'],
    },
    screenColor: '#00f0ff',
  },
  {
    id: 'tv-skills-backend',
    type: 'crt',
    position: [2.6, 1.62, -28.5],
    rotation: [0.04, -0.40, 0],
    scale: 1.18,
    activationAt: 0.80,
    contentId: 'skills-backend',
    importance: 'primary',
    content: {
      type: 'skills',
      category: 'BACKEND & DATABASE',
      items: ['Node.js & Express.js', 'PHP & Laravel', 'REST APIs & JWT Auth', 'MySQL, PostgreSQL, SQLite'],
    },
    screenColor: '#10b981',
  },
  {
    id: 'tv-skills-ml',
    type: 'crt',
    position: [0, 2.9, -29.2],
    rotation: [0.16, 0, 0],
    scale: 1.25,
    activationAt: 0.81,
    contentId: 'skills-ml',
    importance: 'primary',
    content: {
      type: 'skills',
      category: 'DATA SCIENCE & ML',
      items: ['Python & Pandas / NumPy', 'Scikit-learn Models', 'Data Preprocessing', 'Model Training & Evaluation'],
    },
    screenColor: '#f59e0b',
  },
  {
    id: 'tv-skills-tools',
    type: 'terminal',
    position: [-3.25, 2.45, -28.9],
    rotation: [0.12, 0.44, -0.04],
    scale: 0.95,
    activationAt: 0.81,
    contentId: 'skills-tools',
    importance: 'secondary',
    content: {
      type: 'skills',
      category: 'DEV TOOLS & CLOUD',
      items: ['Git & GitHub Actions', 'Android Studio & VS Code', 'Postman REST Testing', 'Render, Vercel & Firebase'],
    },
    screenColor: '#06b6d4',
  },

  // =========================================================================
  // SECTION 07: PHILOSOPHY & FINAL CONTACT TV (z = -34.0, activationAt = 0.94)
  // Character reaches terminus; large display: "LET'S BUILD SOMETHING WORTH REMEMBERING"
  // =========================================================================
  {
    id: 'tv-about-human',
    type: 'large',
    position: [-2.5, 1.65, -33.6],
    rotation: [0.04, 0.38, 0],
    scale: 1.2,
    activationAt: 0.93,
    contentId: 'about-human',
    importance: 'secondary',
    content: {
      type: 'text',
      title: 'PROFESSIONAL SUMMARY',
      subtitle: 'CORE PHILOSOPHY',
      body:
        'Driven by curiosity, innovation, and continuous learning. I build scalable software that balances performance, functionality, and user experience.',
      tags: ['Innovation', 'Scalability', 'Continuous Learning', 'Problem Solving'],
    },
    screenColor: '#38bdf8',
  },
  {
    id: 'tv-contact-final',
    type: 'large',
    position: [0, 2.3, -34.5],
    rotation: [0.12, 0, 0],
    scale: 1.55,
    activationAt: 0.94,
    contentId: 'contact-final',
    importance: 'primary',
    content: { type: 'contact' },
    screenColor: '#00f0ff',
  },
]
