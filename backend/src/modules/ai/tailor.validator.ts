import { z } from "zod";

export const tailorResumeSchema = z.object({
  jobDescription: z
    .string()
    .trim()
    .min(100, "Please provide the full job description (at least 100 characters)")
    .max(20000, "Job description must be 20,000 characters or fewer"),
});

export const tailoredResumeResponseSchema = z.object({
  professionalSummary: z.string(),
  skills: z.array(z.string()),
  experienceBullets: z.array(z.string()),
  projectBullets: z.array(z.string()),
  keywords: z.array(z.string()),
  changeNotes: z.array(z.string()),
  cautions: z.array(z.string()),
});

export type TailorResumeInput = z.infer<typeof tailorResumeSchema>;
export type TailoredResumeDraft = z.infer<typeof tailoredResumeResponseSchema>;
