export type Certificate = {
  id: string
  title: string
  issuer: string
  date: string
  category: string
  credentialId: string
  credentialUrl?: string
  description?: string
  skills?: string[]
  accentColor: string
  badgeText: string
  recipientName: string
  verificationUrl?: string
}

export const certificates: Certificate[] = [
  {
    id: 'cert-01',
    title: 'Android App Development',
    issuer: 'Professional Certification Authority',
    date: '2024',
    category: 'Mobile Engineering',
    credentialId: 'ANDR-DEV-2024',
    credentialUrl: 'https://github.com/SolankiMehul7874',
    description:
      'Native Android application engineering, activity lifecycles, SQLite persistence, and responsive UI implementation with Java and Kotlin.',
    skills: ['Android SDK', 'Java', 'Kotlin', 'SQLite', 'Jetpack Architecture'],
    accentColor: '#00f0ff', // Cyan
    badgeText: 'VERIFIED CREDENTIAL',
    recipientName: 'Mehul Solanki',
  },
  {
    id: 'cert-02',
    title: 'Arbitrum Stylus Core Concepts',
    issuer: 'Arbitrum / Offchain Labs',
    date: '2024',
    category: 'Systems & Smart Contracts',
    credentialId: 'ARB-STYLUS-CORE-90',
    credentialUrl: 'https://arbitrum.io',
    description:
      'WASM-powered smart contract development on Arbitrum Stylus utilizing Rust, C++, and high-throughput memory layout optimization.',
    skills: ['Stylus SDK', 'Rust', 'C++', 'WASM Smart Contracts', 'Arbitrum Nitro'],
    accentColor: '#38bdf8', // Sky Blue
    badgeText: 'WASM SMART CONTRACTS',
    recipientName: 'Mehul Solanki',
  },
  {
    id: 'cert-03',
    title: 'Arbitrum Stylus Foundation',
    issuer: 'Arbitrum / Offchain Labs',
    date: '2024',
    category: 'Distributed Systems',
    credentialId: 'ARB-STYLUS-FND-44',
    credentialUrl: 'https://arbitrum.io',
    description:
      'Core primitives of multi-VM execution environments, EVM equivalence, and decentralized application architecture.',
    skills: ['Web3', 'Multi-VM Execution', 'Decentralized Networks', 'Layer-2 Rollups'],
    accentColor: '#818cf8', // Indigo
    badgeText: 'LAYER-2 SYSTEMS',
    recipientName: 'Mehul Solanki',
  },
  {
    id: 'cert-04',
    title: 'TechShastra 2K26 — 24H Hackathon',
    issuer: 'TechShastra Committee',
    date: '2026',
    category: 'Competitive Engineering',
    credentialId: 'HACK-TS26-PART',
    credentialUrl: 'https://github.com/SolankiMehul7874',
    description:
      '24-hour intensive competitive hackathon building and deploying collaborative full-stack architectures under compressed timeline constraints.',
    skills: ['Rapid Prototyping', 'Team Engineering', 'Live Demonstration', 'Full-Stack Delivery'],
    accentColor: '#f59e0b', // Amber
    badgeText: 'HACKATHON PARTICIPATION',
    recipientName: 'Mehul Solanki',
  },
  {
    id: 'cert-05',
    title: 'Web3 Basics & Distributed Architecture',
    issuer: 'Decentralized Systems Foundation',
    date: '2023',
    category: 'Distributed Systems',
    credentialId: 'WEB3-BC-552',
    credentialUrl: 'https://github.com/SolankiMehul7874',
    description:
      'Cryptographic verification, consensus algorithms, peer-to-peer network routing, and distributed state machines.',
    skills: ['Cryptography', 'Consensus Mechanisms', 'State Trees', 'P2P Networks'],
    accentColor: '#a855f7', // Purple
    badgeText: 'DISTRIBUTED SYSTEMS',
    recipientName: 'Mehul Solanki',
  },
  {
    id: 'cert-06',
    title: 'Fundamentals of Digital Marketing',
    issuer: 'Google Digital Garage',
    date: '2023',
    category: 'Analytics & Web Performance',
    credentialId: 'GOOGLE-DIG-MKT-77',
    credentialUrl: 'https://learndigital.withgoogle.com',
    description:
      'Data-driven user analytics, digital discoverability, SEO optimization, and audience retention metrics.',
    skills: ['Web Analytics', 'SEO Optimization', 'User Funnels', 'Product Growth'],
    accentColor: '#ef4444', // Red / Coral
    badgeText: 'GOOGLE CERTIFIED',
    recipientName: 'Mehul Solanki',
  },
  {
    id: 'cert-07',
    title: 'DDCET Statewide Entrance Rank #113',
    issuer: 'ACPC Engineering Board',
    date: '2023',
    category: 'Academic Honors',
    credentialId: 'ACPC-DDCET-R113',
    credentialUrl: 'https://github.com/SolankiMehul7874',
    description:
      'Achieved Statewide Rank 113 among thousands of engineering candidates; awarded All Rounder recognition for balancing technical project delivery with academic excellence.',
    skills: ['Algorithms', 'Software Engineering', 'Mathematics', 'Computer Systems'],
    accentColor: '#eab308', // Gold
    badgeText: 'ACADEMIC DISTINCTION',
    recipientName: 'Mehul Solanki',
  },
]
