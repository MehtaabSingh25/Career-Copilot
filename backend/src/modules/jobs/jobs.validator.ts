import { z } from "zod";

export const createJobMatchSchema = z.object({
  resumeId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid resume ID"),
  jobTitle: z.string().trim().min(1).max(120),
  company: z.string().trim().max(120).optional().default(""),
  jobDescription: z.string().trim().min(100, "Please provide the full job description (at least 100 characters)").max(20000),
});

export type CreateJobMatchInput = z.infer<typeof createJobMatchSchema>;
