import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware.js";
import { careerChatSchema } from "./chat.validator.js";
import { answerCareerQuestion, getCareerChat, listCareerChats } from "./chat.service.js";

export const chat = async (req: AuthRequest, res: Response) => {
  const parsed = careerChatSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: "Invalid chat request", errors: parsed.error.issues.map((issue) => ({ field: issue.path.join("."), message: issue.message })) });
  try {
    const result = await answerCareerQuestion(parsed.data.question, req.user!.id, parsed.data.resumeId, parsed.data.conversationId);
    return res.json({ success: true, data: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Career chat failed";
    if (message === "Resume not found" || message === "Conversation not found") return res.status(404).json({ success: false, message });
    if (message === "The selected resume has no extractable text") return res.status(422).json({ success: false, message });
    return res.status(502).json({ success: false, message: "Career assistant is temporarily unavailable. Please try again." });
  }
};

export const listChats = async (req: AuthRequest, res: Response) => {
  try { return res.json({ success: true, data: await listCareerChats(req.user!.id) }); }
  catch { return res.status(500).json({ success: false, message: "Could not load chat history" }); }
};

export const getChat = async (req: AuthRequest, res: Response) => {
  const conversationId = Array.isArray(req.params.conversationId) ? req.params.conversationId[0] : req.params.conversationId;
  try { return res.json({ success: true, data: await getCareerChat(conversationId, req.user!.id) }); }
  catch { return res.status(404).json({ success: false, message: "Conversation not found" }); }
};
