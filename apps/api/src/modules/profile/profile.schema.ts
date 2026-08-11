import { z } from 'zod';

const skillSchema = z.object({
  name: z.string().min(1, 'Skill name is required'),
  proficiency: z.enum(['Beginner', 'Intermediate', 'Expert']),
});

const educationSchema = z.object({
  school: z.string().min(1, 'School is required'),
  degree: z.string().min(1, 'Degree is required'),
  fieldOfStudy: z.string().min(1, 'Field of study is required'),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()).optional(),
  current: z.boolean().default(false),
  description: z.string().optional(),
});

const experienceSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  position: z.string().min(1, 'Position is required'),
  location: z.string().optional(),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()).optional(),
  current: z.boolean().default(false),
  description: z.string().optional(),
});

const projectSchema = z.object({
  title: z.string().min(1, 'Project title is required'),
  description: z.string().min(1, 'Project description is required'),
  url: z.string().url().optional().or(z.literal('')),
  technologies: z.array(z.string()).default([]),
  startDate: z.string().or(z.date()).optional(),
  endDate: z.string().or(z.date()).optional(),
});

const achievementSchema = z.object({
  title: z.string().min(1, 'Achievement title is required'),
  description: z.string().optional(),
  date: z.string().or(z.date()).optional(),
  issuer: z.string().optional(),
});

export const updateProfileSchema = z.object({
  body: z.object({
    headline: z.string().optional(),
    bio: z.string().optional(),
    location: z.string().optional(),
    skills: z.array(skillSchema).optional(),
    education: z.array(educationSchema).optional(),
    experience: z.array(experienceSchema).optional(),
    projects: z.array(projectSchema).optional(),
    achievements: z.array(achievementSchema).optional(),
    socialLinks: z.object({
      linkedin: z.string().url().optional().or(z.literal('')),
      github: z.string().url().optional().or(z.literal('')),
      twitter: z.string().url().optional().or(z.literal('')),
      portfolio: z.string().url().optional().or(z.literal('')),
      other: z.string().url().optional().or(z.literal('')),
    }).optional(),
  }),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>['body'];
