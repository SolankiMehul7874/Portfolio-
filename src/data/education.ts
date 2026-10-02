export type Education = {
  id: string
  degree: string
  institution: string
  year: string
  description: string
  achievements?: string[]
}

export type Certification = {
  id: string
  name: string
  issuer?: string
}

export const education: Education[] = [
  {
    id: 'edu-be',
    degree: 'B.E. — Information Technology (Ongoing)',
    institution: 'L.D. College of Engineering',
    year: 'Present',
    description:
      'Core coursework spanning software engineering, database management systems, algorithms, and mobile application development alongside continuous project work.',
    achievements: [
      'Focus in Backend Systems, Flutter, and Applied Machine Learning',
      'Active participant in technical development and hackathons',
    ],
  },
  {
    id: 'edu-diploma',
    degree: 'Diploma in Information Technology',
    institution: 'DDCET Rank 113',
    year: 'Graduate',
    description:
      'Ranked 113 in the DDCET diploma-to-degree entrance exam, and recognised as an "All Rounder" for balancing academics with technical projects.',
    achievements: [
      'State-level entrance rank: #113',
      'Recognised as "All Rounder" for academic and project excellence',
    ],
  },
]

export const certifications: Certification[] = [
  { id: 'cert-1', name: 'Android App Development' },
  { id: 'cert-2', name: 'Fundamentals of Digital Marketing' },
  { id: 'cert-3', name: 'Stylus Foundation' },
  { id: 'cert-4', name: 'Stylus Core Concepts' },
  { id: 'cert-5', name: 'Web3 Basics' },
  { id: 'cert-6', name: 'TechShastra 2K26 (24-Hour Hackathon)' },
]
