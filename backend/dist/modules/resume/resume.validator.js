import { z } from "zod";
export const uploadResumeSchema = z.object({
    title: z.string().min(3).max(100).optional(),
});
