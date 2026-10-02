import { experiencesData } from '@/components/experience/experienceData'

export type Experience = {
  id: string
  year: string
  title: string
  organization: string
  description: string
  technologies?: string[]
  type?: 'internship' | 'independent' | 'hackathon' | 'milestone'
}

export const experiences: Experience[] = experiencesData.map((e) => ({
  id: e.id,
  year: e.period,
  title: e.role,
  organization: e.company,
  description: e.shortDescription,
  technologies: e.technologies,
  type: e.type,
}))

