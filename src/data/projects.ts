export type ProjectImage = {
  src: string
  alt: string
  caption?: string
}

export type Project = {
  id: string
  title: string
  tagline?: string
  year: string
  category: string
  shortDescription: string
  problem: string
  solution: string
  contribution: string
  challenges: string[]
  technologies: string[]
  architecture?: string[]
  features?: string[]
  results?: string[]
  images: ProjectImage[]
  repository?: string
  liveUrl?: string
  monitorPosition: [number, number, number]
  monitorRotation: [number, number, number]
  activationAt: number
}

export const projects: Project[] = [
  {
    id: 'project-01',
    title: 'Prime News',
    tagline: 'Case Study — 01',
    year: '2024',
    category: 'Flutter Mobile Application',
    shortDescription:
      'A high-performance Flutter news app that pulls live articles from News API, featuring Firebase-backed authentication, personalized bookmarking, and category-based browsing.',
    problem:
      'Most mobile news apps are cluttered, slow to browse on unstable mobile networks, and lack seamless offline persistence for saved articles.',
    solution:
      'Built a lightweight Flutter client over a News API with cached category browsing, optimized image decoding, and a Firebase auth/bookmark layer tuned for rapid first-paint.',
    contribution:
      'Engineered the cross-platform Flutter architecture, integrated Firebase Authentication & Firestore cloud sync for bookmarks, implemented REST API network caching, and crafted responsive UI components.',
    challenges: [
      'Minimizing news feed latency and image bandwidth on low-bandwidth cellular connections.',
      'Maintaining consistent reactive state between Firebase auth tokens and offline bookmarked feeds.',
    ],
    technologies: ['Flutter', 'Dart', 'Firebase', 'REST API', 'News API'],
    architecture: ['Flutter Client UI', 'State Management (BLoC / Provider)', 'News REST API Cache', 'Firebase Auth', 'Firestore Database'],
    features: [
      'News API real-time integration',
      'Firebase user authentication',
      'Bookmarks & saved articles sync',
      'Category-based feed browsing',
      'Detailed rich article view',
      'Fully responsive mobile UI',
    ],
    results: [
      'Sub-second feed rendering on 4G networks',
      'Zero-latency access to offline saved reading list',
    ],
    images: [{ src: '/images/prime-news.jpg', alt: 'Prime News Flutter App' }],
    repository: 'https://github.com/SolankiMehul7874',
    liveUrl: undefined,
    monitorPosition: [-2.2, 1.2, -8],
    monitorRotation: [0, 0.28, 0],
    activationAt: 0.31,
  },
  {
    id: 'project-02',
    title: 'Scalable Backend & Auth REST Engine',
    tagline: 'Case Study — 02',
    year: '2024 - 2025',
    category: 'Backend & Cloud Services',
    shortDescription:
      'Modular REST API backend architecture with robust JWT authentication, MVC structure, and relational database persistence built for cross-platform clients.',
    problem:
      'Designing decoupled, scalable backend services that handle concurrent mobile and web requests securely without performance bottlenecks.',
    solution:
      'Engineered structured REST endpoints with JWT validation, role-based access control, relational database schema indexing, and unified error middleware.',
    contribution:
      'Designed the relational database schemas (MySQL/PostgreSQL), built authentication controllers, implemented JWT token lifecycle management, and created structured API tests in Postman.',
    challenges: [
      'Securing stateless JWT tokens while allowing graceful token refreshes and revoking stale sessions.',
      'Optimizing complex SQL queries and relational joins for high-throughput mobile endpoints.',
    ],
    technologies: ['Node.js', 'Express.js', 'PHP', 'Laravel', 'REST APIs', 'JWT', 'MySQL', 'PostgreSQL'],
    architecture: ['Client Request', 'Express / Laravel Gateway', 'JWT Auth Guard', 'Service Layer', 'ORM / SQL DB'],
    features: [
      'Stateless JWT authentication & authorization',
      'Clean MVC pattern architecture',
      'Relational schema indexing & foreign-key integrity',
      'Input sanitization & rate limiting protection',
      'Modular route handlers and service contracts',
    ],
    results: [
      'Sub-50ms endpoint response times under test workloads',
      'Reusable backend template for Flutter and Web clients',
    ],
    images: [{ src: '/images/backend-engine.jpg', alt: 'Backend REST Engine Architecture' }],
    repository: 'https://github.com/SolankiMehul7874',
    liveUrl: undefined,
    monitorPosition: [2.4, 1.0, -14],
    monitorRotation: [0, -0.35, 0],
    activationAt: 0.39,
  },
  {
    id: 'project-03',
    title: 'Data Intelligence & Machine Learning Pipeline',
    tagline: 'Case Study — 03',
    year: '2024 - 2025',
    category: 'Data Science & Machine Learning',
    shortDescription:
      'End-to-end data analytics and predictive modeling pipeline covering automated preprocessing, feature engineering, and model training with Scikit-learn.',
    problem:
      'Raw tabular datasets suffer from missing values, categorical skew, and noise that severely compromise predictive accuracy in standard ML models.',
    solution:
      'Developed automated preprocessing pipelines with NumPy and Pandas, applied feature scaling and encoding, and trained tuned Scikit-learn classifiers with cross-validation.',
    contribution:
      'Executed exploratory data analysis, built data imputation and transformation pipelines, trained predictive models, and generated performance evaluation matrices.',
    challenges: [
      'Mitigating class imbalance and multicollinearity across diverse feature sets.',
      'Hyperparameter tuning to maximize generalization while guarding against overfitting.',
    ],
    technologies: ['Python', 'NumPy', 'Pandas', 'Scikit-learn', 'Data Preprocessing', 'Model Training'],
    architecture: ['Raw Dataset', 'Pandas Cleaning & Imputation', 'Feature Scaling & Selection', 'Scikit-learn Model', 'Evaluation Metrics'],
    features: [
      'Automated data cleaning & missing value handling',
      'Categorical encoding and standard feature scaling',
      'Model training with cross-validation scoring',
      'ROC-AUC, Precision, Recall, and Confusion Matrix analysis',
      'Data visualization and feature importance charting',
    ],
    results: [
      'Consistent accuracy improvement over baseline heuristic models',
      'Modular reusable pipeline for statistical evaluation',
    ],
    images: [{ src: '/images/ml-pipeline.jpg', alt: 'Machine Learning Pipeline' }],
    repository: 'https://github.com/SolankiMehul7874',
    liveUrl: undefined,
    monitorPosition: [-2.5, 1.6, -18.5],
    monitorRotation: [0, 0.38, 0],
    activationAt: 0.38,
  },
  {
    id: 'project-04',
    title: 'Native Android & Core Mobile Architecture',
    tagline: 'Case Study — 04',
    year: '2023 - 2024',
    category: 'Mobile System Engineering',
    shortDescription:
      'Native Android applications engineered with Java, Kotlin, SQLite local caching, and Clean Architecture pattern for offline-first resilience.',
    problem:
      'Network-dependent mobile utilities fail abruptly during connectivity drops and suffer from poor background task memory management.',
    solution:
      'Engineered native Android solutions utilizing SQLite local database indexing, Android Jetpack components, and reactive repository patterns for reliable offline persistence.',
    contribution:
      'Architected native Java and Kotlin activity lifecycles, implemented SQLite database helper services, structured background asynchronous thread workers, and earned Android App Development certification.',
    challenges: [
      'Managing complex Android activity lifecycles and background process memory limits.',
      'Ensuring ACID transactions and seamless database schema migrations in local SQLite.',
    ],
    technologies: ['Java', 'Kotlin', 'Android Studio', 'SQLite', 'Android Jetpack', 'Clean Architecture', 'REST APIs'],
    architecture: ['Android UI (XML/Jetpack)', 'ViewModel & State', 'Repository Pattern', 'SQLite Local DB', 'Remote REST Sync'],
    features: [
      'Certified Android application architecture',
      'Robust offline-first SQLite database indexing',
      'Asynchronous background thread execution',
      'Responsive multi-screen density support',
      'Clean separation of domain and data layers',
    ],
    results: [
      'Zero crashes across varied Android API levels (24+)',
      'Instantaneous offline local record reads under 10ms',
    ],
    images: [{ src: '/images/android-arch.jpg', alt: 'Native Android System Architecture' }],
    repository: 'https://github.com/SolankiMehul7874',
    liveUrl: undefined,
    monitorPosition: [2.5, 1.6, -21.8],
    monitorRotation: [0, -0.38, 0],
    activationAt: 0.45,
  },
]
