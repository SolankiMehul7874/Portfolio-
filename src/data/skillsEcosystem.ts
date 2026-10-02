export type SkillCategory =
  | 'Frontend & Web'
  | 'Backend & APIs'
  | 'Mobile & Apps'
  | 'Data Science & ML'
  | 'Databases & Cloud'
  | 'Tools & Systems'

export type EcosystemSkill = {
  id: string
  name: string
  category: SkillCategory
  description: string
  projectCount: number
  relatedSkillIds: string[]
  position: [number, number, number] // 3D coordinates in space around core [0, 0, 0]
  accentColor: string
  status: 'active' | 'core' | 'exploring'
}

export const DEVELOPER_CORE = {
  name: 'MEHUL',
  tagline: 'DEVELOPER CORE',
  position: [0, 0, 0] as [number, number, number],
  accentColor: '#00f0ff',
}

export const ecosystemSkills: EcosystemSkill[] = [
  // -------------------------------------------------------------------------
  // 1. FRONTEND & WEB CLUSTER (Top-Left Forward)
  // -------------------------------------------------------------------------
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'Frontend & Web',
    description: 'Strict typing, robust generic abstractions, and compiler architecture for scalable client applications.',
    projectCount: 4,
    relatedSkillIds: ['react', 'nextjs', 'nodejs'],
    position: [-2.2, 1.3, 0.8],
    accentColor: '#38bdf8',
    status: 'core',
  },
  {
    id: 'react',
    name: 'React.js',
    category: 'Frontend & Web',
    description: 'Component lifecycles, virtual DOM reconciliation, concurrent features, and custom state hooks.',
    projectCount: 4,
    relatedSkillIds: ['typescript', 'nextjs', 'tailwind'],
    position: [-1.4, 2.0, 0.4],
    accentColor: '#00f0ff',
    status: 'active',
  },
  {
    id: 'nextjs',
    name: 'Next.js 16',
    category: 'Frontend & Web',
    description: 'App Router architecture, React Server Components, streaming SSR, and Turbopack bundler optimizations.',
    projectCount: 3,
    relatedSkillIds: ['react', 'typescript', 'tailwind'],
    position: [-2.6, 2.3, -0.4],
    accentColor: '#e2e8f0',
    status: 'core',
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    category: 'Frontend & Web',
    description: 'Utility-first modern styling, dark mode paradigms, responsive layouts, and spatial UI aesthetics.',
    projectCount: 4,
    relatedSkillIds: ['react', 'nextjs'],
    position: [-3.2, 1.1, 0.3],
    accentColor: '#38bdf8',
    status: 'active',
  },

  // -------------------------------------------------------------------------
  // 2. BACKEND & APIS CLUSTER (Bottom-Left Rear)
  // -------------------------------------------------------------------------
  {
    id: 'nodejs',
    name: 'Node.js',
    category: 'Backend & APIs',
    description: 'Asynchronous event-loop execution, V8 runtime mechanics, and scalable microservices.',
    projectCount: 3,
    relatedSkillIds: ['typescript', 'express', 'mysql-postgres'],
    position: [-2.1, -1.0, -0.6],
    accentColor: '#4ade80',
    status: 'core',
  },
  {
    id: 'express',
    name: 'Express.js',
    category: 'Backend & APIs',
    description: 'RESTful API endpoints, robust middleware pipelines, and structured routing controllers.',
    projectCount: 3,
    relatedSkillIds: ['nodejs', 'jwt-auth', 'mysql-postgres'],
    position: [-2.9, -1.8, -0.2],
    accentColor: '#86efac',
    status: 'active',
  },
  {
    id: 'php-laravel',
    name: 'PHP & Laravel',
    category: 'Backend & APIs',
    description: 'MVC server architectures, Eloquent ORM relationships, and enterprise backend engineering.',
    projectCount: 2,
    relatedSkillIds: ['mysql-postgres'],
    position: [-1.4, -2.2, -1.2],
    accentColor: '#f87171',
    status: 'active',
  },
  {
    id: 'jwt-auth',
    name: 'JWT & REST Auth',
    category: 'Backend & APIs',
    description: 'Stateless cryptographic token authentication, role-based authorization, and secure session management.',
    projectCount: 3,
    relatedSkillIds: ['express', 'nodejs'],
    position: [-3.3, -0.8, -1.4],
    accentColor: '#fbbf24',
    status: 'active',
  },

  // -------------------------------------------------------------------------
  // 3. MOBILE & APPS CLUSTER (Top-Center High)
  // -------------------------------------------------------------------------
  {
    id: 'flutter',
    name: 'Flutter & Dart',
    category: 'Mobile & Apps',
    description: 'Multi-platform mobile engineering, widget tree state composition, and high-performance native UIs.',
    projectCount: 2,
    relatedSkillIds: ['android', 'firebase'],
    position: [0.0, 2.4, 0.9],
    accentColor: '#38bdf8',
    status: 'core',
  },
  {
    id: 'android',
    name: 'Android / Kotlin',
    category: 'Mobile & Apps',
    description: 'Native Android SDK architectures, Jetpack lifecycles, and SQLite offline persistence.',
    projectCount: 2,
    relatedSkillIds: ['flutter', 'sqlite'],
    position: [0.9, 2.2, 0.3],
    accentColor: '#a3e635',
    status: 'active',
  },

  // -------------------------------------------------------------------------
  // 4. DATA SCIENCE & ML CLUSTER (Top-Right Forward)
  // -------------------------------------------------------------------------
  {
    id: 'python-ml',
    name: 'Python (NumPy / Pandas)',
    category: 'Data Science & ML',
    description: 'Vectorized computing, exploratory data science analysis, and tabular feature engineering.',
    projectCount: 2,
    relatedSkillIds: ['scikit-learn', 'tensorflow'],
    position: [2.0, 1.4, 0.7],
    accentColor: '#fbbf24',
    status: 'core',
  },
  {
    id: 'scikit-learn',
    name: 'Scikit-learn',
    category: 'Data Science & ML',
    description: 'Supervised and unsupervised statistical machine learning models, regression, and cross-validation.',
    projectCount: 2,
    relatedSkillIds: ['python-ml', 'tensorflow'],
    position: [2.8, 2.0, 0.1],
    accentColor: '#f97316',
    status: 'active',
  },
  {
    id: 'tensorflow',
    name: 'TensorFlow & Neural Networks',
    category: 'Data Science & ML',
    description: 'Deep learning foundations, computational graphs, and neural classification pipelines.',
    projectCount: 1,
    relatedSkillIds: ['python-ml', 'scikit-learn'],
    position: [3.1, 1.1, -0.6],
    accentColor: '#fb923c',
    status: 'active',
  },

  // -------------------------------------------------------------------------
  // 5. DATABASES & CLOUD CLUSTER (Bottom-Right Rear)
  // -------------------------------------------------------------------------
  {
    id: 'mysql-postgres',
    name: 'PostgreSQL & MySQL',
    category: 'Databases & Cloud',
    description: 'Relational schema design, complex JOIN optimization, indexes, and ACID transactional integrity.',
    projectCount: 3,
    relatedSkillIds: ['nodejs', 'express', 'php-laravel'],
    position: [1.8, -1.2, -0.8],
    accentColor: '#60a5fa',
    status: 'core',
  },
  {
    id: 'firebase',
    name: 'Firebase Suite',
    category: 'Databases & Cloud',
    description: 'Cloud Firestore NoSQL, real-time client listeners, serverless functions, and mobile analytics.',
    projectCount: 2,
    relatedSkillIds: ['flutter', 'react'],
    position: [2.7, -1.9, -0.3],
    accentColor: '#f59e0b',
    status: 'active',
  },
  {
    id: 'sqlite',
    name: 'SQLite Persistence',
    category: 'Databases & Cloud',
    description: 'Embedded transactional database engine for offline-first mobile applications.',
    projectCount: 2,
    relatedSkillIds: ['android', 'flutter'],
    position: [1.1, -2.1, -1.4],
    accentColor: '#93c5fd',
    status: 'active',
  },

  // -------------------------------------------------------------------------
  // 6. TOOLS & SYSTEMS CLUSTER (Bottom-Center Ground)
  // -------------------------------------------------------------------------
  {
    id: 'git-github',
    name: 'Git & GitHub',
    category: 'Tools & Systems',
    description: 'Distributed version control, pull requests, semantic commit tracking, and GitHub Actions CI/CD.',
    projectCount: 4,
    relatedSkillIds: ['typescript', 'nodejs'],
    position: [-0.6, -1.9, 0.7],
    accentColor: '#f43f5e',
    status: 'core',
  },
  {
    id: 'stylus-rust',
    name: 'Arbitrum Stylus (Rust)',
    category: 'Tools & Systems',
    description: 'WASM-powered high-throughput smart contract development on Arbitrum Layer-2 with Rust.',
    projectCount: 1,
    relatedSkillIds: ['git-github'],
    position: [0.6, -1.8, 0.8],
    accentColor: '#c084fc',
    status: 'exploring',
  },
]

export const ECOSYSTEM_CATEGORIES: SkillCategory[] = [
  'Frontend & Web',
  'Backend & APIs',
  'Mobile & Apps',
  'Data Science & ML',
  'Databases & Cloud',
  'Tools & Systems',
]

// Category camera framing targets in 3D space
export const CATEGORY_CAMERA_TARGETS: Record<
  SkillCategory | 'All',
  { position: [number, number, number]; lookAt: [number, number, number] }
> = {
  All: {
    position: [0, 0.6, 6.2],
    lookAt: [0, 0, 0],
  },
  'Frontend & Web': {
    position: [-2.2, 1.8, 4.0],
    lookAt: [-2.1, 1.7, 0.3],
  },
  'Backend & APIs': {
    position: [-2.4, -1.2, 3.8],
    lookAt: [-2.4, -1.4, -0.8],
  },
  'Mobile & Apps': {
    position: [0.3, 2.6, 4.0],
    lookAt: [0.4, 2.3, 0.6],
  },
  'Data Science & ML': {
    position: [2.6, 1.6, 4.2],
    lookAt: [2.6, 1.5, 0.1],
  },
  'Databases & Cloud': {
    position: [2.0, -1.4, 4.0],
    lookAt: [1.9, -1.7, -0.8],
  },
  'Tools & Systems': {
    position: [0.0, -1.6, 4.2],
    lookAt: [0.0, -1.8, 0.7],
  },
}
