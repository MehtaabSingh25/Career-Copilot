import { Request, Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware.js";
import { analyzeResume, getLatestResumeAnalysis } from "./ai.service.js";

export const analyze = async (req: AuthRequest, res: Response) => {
  try {
    const resumeId = Array.isArray(req.params.resumeId)
      ? req.params.resumeId[0]
      : req.params.resumeId;
    const result = await analyzeResume(resumeId, req.user!.id);

    res.json({
      success: true,
      data: result,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Resume analysis failed";

    if (message === "Resume not found") {
      return res.status(404).json({
        success: false,
        message,
      });
    }

    return res.status(502).json({
      success: false,
      message: "Resume analysis is temporarily unavailable. Please try again.",
    });
  }
};

export const getAnalysis = async (req: AuthRequest, res: Response) => {
  try {
    const resumeId = Array.isArray(req.params.resumeId)
      ? req.params.resumeId[0]
      : req.params.resumeId;
    const result = await getLatestResumeAnalysis(resumeId, req.user!.id);

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
