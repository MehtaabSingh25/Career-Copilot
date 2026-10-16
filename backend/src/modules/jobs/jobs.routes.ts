import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import { createMatch, getMatch, listMatches } from "./jobs.controller.js";

const router = Router();

router.use(authMiddleware);
router.post("/match", createMatch);
router.get("/matches", listMatches);
router.get("/matches/:matchId", getMatch);

export default router;
