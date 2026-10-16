import { Router } from "express";

import authMiddleware from "../../middleware/auth.middleware.js";
import { analyze, getAnalysis } from "./ai.controller.js";
import { chat } from "./chat.controller.js";
import { tailor } from "./tailor.controller.js";

const router = Router();

router.post("/chat", authMiddleware, chat);

router.post(
  "/analyze/:resumeId",
  authMiddleware,
  analyze
);

router.get(
  "/analysis/:resumeId",
  authMiddleware,
  getAnalysis
);

router.post("/tailor/:resumeId", authMiddleware, tailor);

export default router;
