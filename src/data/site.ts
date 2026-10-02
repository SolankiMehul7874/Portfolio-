export const siteConfig = {
  name: 'Mehul Solanki',
  initials: 'MS',
  role: 'Software Engineer',
  primaryRoles: [
    'Backend Developer',
    'Flutter Developer',
    'Android Developer',
    'Data Science & ML',
    'Full Stack Engineer',
  ],
  secondaryRoles: [
    'React Developer',
    'Node.js Developer',
    'Java Developer',
    'Software Engineer',
  ],
  tagline: 'Software Engineer specializing in Backend Systems, Flutter, Android, and Applied Machine Learning — building scalable, high-performance software architectures.',
  heroDescription: 'Software Engineer specializing in Backend Systems, Flutter, Android, and Applied Machine Learning — building scalable, high-performance software architectures.',
  about: "I'm Mehul Solanki, a Software Engineer dedicated to technical excellence and building scalable software. My primary expertise spans Backend Development, Flutter, Android, Data Science, and Machine Learning. I specialize in architecting systems that balance high computational performance, clean architecture, and intuitive user experiences, solving real-world challenges through modern engineering standards.",
  availability: 'Available for internships & full-time opportunities',
  location: 'Ahmedabad, India',
  institution: 'L.D. College of Engineering',
  email: 'mehul78748768@gmail.com',
  github: 'https://github.com/SolankiMehul7874',
  linkedin: 'https://www.linkedin.com/in/mehul-solanki-31ldce/',
  resume: '/resume.pdf',
  contactCta: "LET'S BUILD SOMETHING MEANINGFUL & IMPACTFUL.",
  stats: {
    ddcetRank: '#113',
    certifications: 6,
    hackathons: 1,
    internships: 1,
  },
} as const

export type SiteConfig = typeof siteConfig

