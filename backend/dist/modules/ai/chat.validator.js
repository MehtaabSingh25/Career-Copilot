import { z } from "zod";
export const careerChatSchema = z.object({
    question: z.string().trim().min(3, "Please enter a career question").max(2000),
    resumeId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid resume ID").optional(),
    conversationId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid conversation ID").optional(),
});
