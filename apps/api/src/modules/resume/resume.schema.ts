import { z } from 'zod';

const themeSchema = z.object({
  primaryColor: z.string().optional(),
  font: z.string().optional(),
});

const sectionSchema = z.object({
  _id: z.string().optional(), // Provided by client if updating existing, omitted if new
  type: z.enum(['PERSONAL', 'SUMMARY', 'EXPERIENCE', 'EDUCATION', 'SKILLS', 'PROJECTS', 'CERTIFICATIONS', 'LANGUAGES', 'INTERESTS', 'REFERENCES']),
  isVisible: z.boolean(),
  order: z.number(),
  data: z.any().optional(),
  profileReferenceId: z.string().nullable().optional(),
});

export const createResumeSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(100),
    templateId: z.string().optional(),
    useProfileData: z.boolean().optional().default(true),
  }),
});

export const updateResumeSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(100).optional(),
    templateId: z.string().optional(),
    theme: themeSchema.optional(),
    sections: z.array(sectionSchema).optional(),
  }),
});

export type CreateResumeInput = z.infer<typeof createResumeSchema>['body'];
export type UpdateResumeInput = z.infer<typeof updateResumeSchema>['body'];
