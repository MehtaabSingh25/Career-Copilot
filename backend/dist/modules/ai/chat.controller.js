import { careerChatSchema } from "./chat.validator.js";
import { answerCareerQuestion } from "./chat.service.js";
export const chat = async (req, res) => {
    const parsed = careerChatSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            success: false,
            message: "Invalid chat request",
            errors: parsed.error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            })),
        });
    }
    try {
        const answer = await answerCareerQuestion(parsed.data.question, req.user.id, parsed.data.resumeId);
        return res.json({ success: true, data: { answer } });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Career chat failed";
        if (message === "Resume not found") {
            return res.status(404).json({ success: false, message });
        }
        if (message === "The selected resume has no extractable text") {
            return res.status(422).json({ success: false, message });
        }
        return res.status(502).json({
            success: false,
            message: "Career assistant is temporarily unavailable. Please try again.",
        });
    }
};
