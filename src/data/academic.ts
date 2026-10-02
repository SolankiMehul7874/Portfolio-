export type AcademicMilestone = {
  id: string
  year: string
  period: string
  stageName: string
  title: string
  institution: string
  location: string
  description: string
  achievements: string[]
  skills: string[]
  position: [number, number, number] // 3D coordinates along the spline
  accentColor: string
  glowColor: string
  branchingSkills?: string[] // For 2026 milestone branching into Skills section
}

export const academicMilestones: AcademicMilestone[] = [
  {
    id: 'milestone-2023',
    year: '2023',
    period: '2021 – 2023',
    stageName: 'FOUNDATIONAL STUDIES',
    title: 'Diploma in Information Technology',
    institution: 'State Technical Examination Board',
    location: 'Gujarat, India',
    description:
      'Forged strong computational and algorithmic foundations. Mastered core memory architecture, C/C++ data structures, database design, and Linux systems administration.',
    achievements: [
      'Mastered core computer science principles and data structures',
      'Engineered structured database management systems & relational schemas',
      'Developed native CLI utilities and modular programming solutions',
    ],
    skills: ['C / C++', 'Data Structures', 'OOP Basics', 'Relational DB', 'Linux CLI'],
    position: [1.2, -1.0, 2.5],
    accentColor: '#38bdf8', // Sky Blue
    glowColor: 'rgba(56, 189, 248, 0.4)',
  },
  {
    id: 'milestone-2024',
    year: '2024',
    period: '2023 – 2024',
    stageName: 'STATE RANK & ADMISSION',
    title: 'DDCET Statewide Rank #113 & LDCE Admission',
    institution: 'L.D. College of Engineering (LDCE)',
    location: 'Ahmedabad, India',
    description:
      'Secured Statewide Rank #113 among thousands of engineering diploma candidates in DDCET. Commended with the "All Rounder" recognition for balancing academic excellence with active software development. Transitioned into prestigious B.E. in Information Technology at LDCE.',
    achievements: [
      'Statewide Entrance Rank: #113 across Gujarat state',
      'Commended with "All Rounder" distinction for engineering & project balance',
      'Transitioned into native Android mobile development & responsive web',
    ],
    skills: ['Android SDK', 'Java & Kotlin', 'SQLite Persistence', 'Mobile Architecture', 'Web Fundamentals'],
    position: [2.2, 0.4, 0.0],
    accentColor: '#00f0ff', // Cyan
    glowColor: 'rgba(0, 240, 255, 0.45)',
  },
  {
    id: 'milestone-2025',
    year: '2025',
    period: '2024 – 2025',
    stageName: 'SYSTEMS & WEB ARCHITECTURE',
    title: 'Distributed Systems & Web Architecture',
    institution: 'L.D. College of Engineering — Information Technology',
    location: 'Ahmedabad, India',
    description:
      'Deepened core engineering coursework in distributed systems, operating systems, and network protocols. Engineered smart contracts on Arbitrum Stylus with Rust, and deployed scalable full-stack React and Node.js web architectures.',
    achievements: [
      'Certified in Arbitrum Stylus Foundation & Stylus Core Concepts',
      'Engineered WASM smart contracts with optimized memory footprint',
      'Architected end-to-end full-stack applications with REST APIs & auth',
    ],
    skills: ['React & TypeScript', 'Node.js & Express', 'Rust & Stylus WASM', 'SQL & NoSQL', 'System Design'],
    position: [1.4, -0.2, -2.8],
    accentColor: '#818cf8', // Indigo
    glowColor: 'rgba(129, 140, 248, 0.45)',
  },
  {
    id: 'milestone-2026',
    year: '2026',
    period: 'Present — Ongoing',
    stageName: 'DEGREE CANDIDACY & COMPETITIVE ENGINEERING',
    title: 'B.E. Information Technology & Hackathon Honors',
    institution: 'L.D. College of Engineering & TechShastra 2K26',
    location: 'Ahmedabad, India',
    description:
      'Undergraduate candidate for Bachelor of Engineering in Information Technology. Participated in the 24-Hour TechShastra 2K26 competitive hackathon. Developing high-performance web architectures, cross-platform Flutter applications, and applied machine learning pipelines.',
    achievements: [
      'Participated in 24-Hour Intensive Hackathon at TechShastra 2K26',
      'Engineered interactive 3D web portfolio showcasing production systems',
      'Synthesized mobile, backend, and machine learning skillsets into production workflows',
    ],
    skills: ['Next.js 16', 'Flutter & Cross-Platform', 'Applied ML (Python)', '24H Hackathon', 'Distributed Systems'],
    position: [2.6, 0.9, -5.5],
    accentColor: '#f59e0b', // Amber / Gold
    glowColor: 'rgba(245, 158, 11, 0.5)',
    branchingSkills: ['React / Next.js', 'Flutter & Dart', 'Node.js & APIs', 'Rust & Stylus', 'Python ML', 'Database Arch'],
  },
]
