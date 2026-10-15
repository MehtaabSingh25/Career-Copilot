import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import { analyze, getAnalysis } from "./ai.controller.js";
const router = Router();
router.post("/analyze/:resumeId", authMiddleware, analyze);
router.get("/analysis/:resumeId", authMiddleware, getAnalysis);
export default router;
