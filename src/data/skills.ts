export type Skill = {
  id: string
  name: string
  category: string
  description: string
  projectIds: string[]
}

export const skills: Skill[] = [
  // Mobile & App Development
  {
    id: 'flutter',
    name: 'Flutter & Dart',
    category: 'Mobile & Apps',
    description: 'Cross-platform mobile UI framework for shipping fast native Android & iOS applications.',
    projectIds: ['project-01'],
  },
  {
    id: 'android',
    name: 'Android / Kotlin / Java',
    category: 'Mobile & Apps',
    description: 'Native Android application development using modern SDK, Kotlin, and Java fundamentals.',
    projectIds: ['project-01'],
  },

  // Backend & APIs
  {
    id: 'nodejs',
    name: 'Node.js & Express.js',
    category: 'Backend & APIs',
    description: 'Scalable server-side runtimes, asynchronous micro-services, and REST API development.',
    projectIds: ['project-02'],
  },
  {
    id: 'php-laravel',
    name: 'PHP & Laravel',
    category: 'Backend & APIs',
    description: 'MVC server architectures, object-relational mapping, and structured API endpoints.',
    projectIds: ['project-02'],
  },
  {
    id: 'jwt-auth',
    name: 'JWT & REST Auth',
    category: 'Backend & APIs',
    description: 'Stateless JSON Web Token authentication, role authorization, and secure endpoint middleware.',
    projectIds: ['project-02'],
  },

  // Machine Learning & Data Science
  {
    id: 'python-ml',
    name: 'Python & NumPy / Pandas',
    category: 'Data Science & ML',
    description: 'Data preprocessing, vector computation, exploratory data analysis, and feature engineering.',
    projectIds: ['project-03'],
  },
  {
    id: 'scikit-learn',
    name: 'Scikit-learn & ML Models',
    category: 'Data Science & ML',
    description: 'Supervised & unsupervised model training, regression, classification, and metric validation.',
    projectIds: ['project-03'],
  },
  {
    id: 'tensorflow',
    name: 'TensorFlow & Deep Learning',
    category: 'Data Science & ML',
    description: 'Deep learning foundations, neural network architectures, and tensor computation pipelines.',
    projectIds: ['project-03'],
  },

  // Databases & Cloud
  {
    id: 'mysql-postgres',
    name: 'MySQL & PostgreSQL',
    category: 'Databases & Cloud',
    description: 'Relational database schema design, indexing, foreign keys, and query optimization.',
    projectIds: ['project-02'],
  },
  {
    id: 'firebase',
    name: 'Firebase Suite',
    category: 'Databases & Cloud',
    description: 'Real-time database, Firestore, Firebase Authentication, cloud hosting, and storage.',
    projectIds: ['project-01'],
  },
  {
    id: 'cloud-deploy',
    name: 'Vercel / Render / Cloudinary',
    category: 'Databases & Cloud',
    description: 'Cloud hosting, automated CI/CD deployments, and media asset delivery.',
    projectIds: ['project-01', 'project-02'],
  },

  // Frontend & Web
  {
    id: 'react-next',
    name: 'React.js & Next.js',
    category: 'Frontend & Web',
    description: 'Modern component-driven interfaces, Next.js server/client architectures, and state hooks.',
    projectIds: [],
  },
  {
    id: 'typescript-js',
    name: 'TypeScript & JavaScript',
    category: 'Frontend & Web',
    description: 'Strict type safety, ESNext asynchronous patterns, and interactive client logic.',
    projectIds: [],
  },
  {
    id: 'tailwind-css',
    name: 'Tailwind CSS & Modern UI',
    category: 'Frontend & Web',
    description: 'Utility-first styling, dark mode, responsive fluid layouts, and motion design.',
    projectIds: [],
  },

  // Developer Tools & Core Concepts
  {
    id: 'git-github',
    name: 'Git & GitHub',
    category: 'Tools & Engineering',
    description: 'Version control, feature branching, semantic commits, and collaborative repository workflows.',
    projectIds: ['project-01', 'project-02', 'project-03'],
  },
  {
    id: 'ide-tools',
    name: 'Android Studio / VS Code / Postman',
    category: 'Tools & Engineering',
    description: 'Integrated development environments, mobile emulator debugging, and API testing suites.',
    projectIds: ['project-01', 'project-02'],
  },
  {
    id: 'cs-concepts',
    name: 'Data Structures & Algorithms',
    category: 'Tools & Engineering',
    description: 'OOP principles, algorithm complexity, DBMS relational schemas, and operating system basics.',
    projectIds: [],
  },
]

export const skillCategories = [
  'Mobile & Apps',
  'Backend & APIs',
  'Data Science & ML',
  'Databases & Cloud',
  'Frontend & Web',
  'Tools & Engineering',
]
