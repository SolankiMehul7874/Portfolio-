export type ExperienceItem = {
  id: string
  index: string // "01", "02", etc.
  role: string
  company: string
  period: string
  startDate: string
  endDate: string
  type: 'internship' | 'independent' | 'hackathon' | 'milestone'
  classification: string
  shortDescription: string
  fullDescription: string
  contributions: string[]
  technologies: string[]
  visualType: 'mobile' | 'backend' | 'hackathon' | 'milestone'
  accentColor: string // hex / rgb string for accents
  relatedProjectId?: string // connects to projects in src/data/projects.ts
  projectUrl?: string
}

export const experiencesData: ExperienceItem[] = [
  {
    id: 'exp-infolabz',
    index: '01',
    role: 'Flutter Developer Intern',
    company: 'InfoLabz IT Services',
    period: '2024',
    startDate: '2024-01',
    endDate: '2024-06',
    type: 'internship',
    classification: 'INDUSTRY INTERNSHIP // MOBILE DEVELOPMENT',
    shortDescription:
      'Engineered cross-platform mobile features in Flutter with Firebase Authentication and News API data integration within an agile engineering team.',
    fullDescription:
      'Served as a Flutter Developer Intern at InfoLabz, contributing directly to mobile client architecture. Collaborated in fast-paced sprints with designers and backend teams to implement production-grade user interfaces, offline state management, and real-time cloud data pipelines with Firebase and RESTful APIs.',
    contributions: [
      'Built responsive, high-fidelity mobile screens adhering to strict design system specifications.',
      'Integrated Firebase Authentication and Firestore real-time database sync for persistent user profiles and bookmarks.',
      'Optimized network request lifecycle and JSON deserialization, reducing feed render latency by 35%.',
      'Collaborated within an agile Scrum workflow, participating in daily standups, code reviews, and sprint retrospectives.',
    ],
    technologies: ['Flutter', 'Dart', 'Firebase', 'REST APIs', 'Provider / BLoC', 'Git'],
    visualType: 'mobile',
    accentColor: '#06b6d4', // Cyan
    relatedProjectId: 'project-01',
    projectUrl: 'https://github.com/SolankiMehul7874',
  },
  {
    id: 'exp-independent',
    index: '02',
    role: 'Independent Software Developer',
    company: 'Software Engineering Projects',
    period: '2023 — Present',
    startDate: '2023-08',
    endDate: 'Present',
    type: 'independent',
    classification: 'FULL-STACK // BACKEND & ML SOLUTIONS',
    shortDescription:
      'Designing and deploying software architectures end-to-end: secure REST APIs, JWT authentication, relational database schemas, and Scikit-learn predictive pipelines.',
    fullDescription:
      'Conducting self-directed software engineering projects across the modern full-stack ecosystem. Built modular REST backend architectures with Express.js, Laravel, and PostgreSQL/MySQL featuring role-based JWT auth. Simultaneously developed predictive Machine Learning pipelines in Python with automated data preprocessing and feature scaling.',
    contributions: [
      'Architected decoupled REST API backends implementing stateless JWT authentication, password hashing, and role guards.',
      'Designed normalized relational database schemas with indexing on high-frequency lookup columns.',
      'Constructed modular data preprocessing and model evaluation pipelines in Python using NumPy, Pandas, and Scikit-learn.',
      'Maintained disciplined Git version control, semantic commit hygiene, and open-source documentation on GitHub.',
    ],
    technologies: ['Node.js', 'Express.js', 'Python', 'PostgreSQL', 'MySQL', 'Scikit-learn', 'REST APIs', 'JWT'],
    visualType: 'backend',
    accentColor: '#3b82f6', // Electric Blue
    relatedProjectId: 'project-02',
    projectUrl: 'https://github.com/SolankiMehul7874',
  },
  {
    id: 'exp-hackathon',
    index: '03',
    role: 'Hackathon Contender',
    company: 'TechShastra 2K26',
    period: '2026',
    startDate: '2026-02',
    endDate: '2026-02',
    type: 'hackathon',
    classification: 'COMPETITIVE HACKATHON // RAPID PROTOTYPING',
    shortDescription:
      'Participated in a 24-hour hackathon, designing and prototyping a full-stack solution under tight deadlines and presenting the project to an evaluation panel.',
    fullDescription:
      'Competed in TechShastra 2K26, an intensive 24-hour statewide hackathon. Formulated an innovative solution to a complex problem statement, rapid-prototyped full-stack modules within strict deadlines, and successfully presented the live interactive prototype to enterprise evaluators.',
    contributions: [
      'Ideated and scoped the MVP architecture within the initial 2-hour problem breakdown phase.',
      'Engineered core interactive client components and wired real-time communication with API services.',
      'Resolved critical integration bugs under tight countdown constraints without compromising application stability.',
      'Delivered technical presentation and live demonstration to a panel of senior software engineers.',
    ],
    technologies: ['Rapid Prototyping', 'System Design', 'React / TypeScript', 'REST Services', 'Team Leadership'],
    visualType: 'hackathon',
    accentColor: '#10b981', // Emerald
    projectUrl: 'https://github.com/SolankiMehul7874',
  },
  {
    id: 'exp-ddcet',
    index: '04',
    role: 'Statewide Rank 113 & Academic Honor',
    company: 'DDCET Examination Board',
    period: '2024 — Milestone',
    startDate: '2024-07',
    endDate: '2024-08',
    type: 'milestone',
    classification: 'ACADEMIC EXCELLENCE // COMPETITIVE EXAMINATION',
    shortDescription:
      'Secured Rank 113 statewide in the DDCET entrance examination and recognized with the "All Rounder" honor for balancing computer science theory and practical software development.',
    fullDescription:
      'Demonstrated rigorous analytical acumen by ranking 113 out of thousands of candidates statewide in the competitive DDCET diploma-to-degree entrance examination. Commended with the "All Rounder" designation by faculty for combining strong academic discipline with hands-on software contributions.',
    contributions: [
      'Mastered core computing disciplines including Data Structures, Algorithms, DBMS, Operating Systems, and Object-Oriented Design.',
      'Awarded "All Rounder" for demonstrated leadership, technical consistency, and co-curricular engineering initiatives.',
      'Organized peer study sessions to mentor classmates in algorithmic problem solving and practical programming.',
    ],
    technologies: ['Data Structures', 'Algorithms', 'DBMS', 'Object-Oriented Design', 'Computer Architecture'],
    visualType: 'milestone',
    accentColor: '#f59e0b', // Amber
  },
]
