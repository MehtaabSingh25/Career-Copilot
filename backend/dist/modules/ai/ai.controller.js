import { analyzeResume, getLatestResumeAnalysis } from "./ai.service.js";
export const analyze = async (req, res) => {
    try {
        const resumeId = Array.isArray(req.params.resumeId)
            ? req.params.resumeId[0]
            : req.params.resumeId;
        const result = await analyzeResume(resumeId, req.user.id);
        res.json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
export const getAnalysis = async (req, res) => {
    try {
        const resumeId = Array.isArray(req.params.resumeId)
            ? req.params.resumeId[0]
            : req.params.resumeId;
        const result = await getLatestResumeAnalysis(resumeId, req.user.id);
        res.json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};
