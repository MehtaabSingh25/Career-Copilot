import { tailorResumeSchema } from "./tailor.validator.js";
import { tailorResume } from "./tailor.service.js";
export const tailor = async (req, res) => {
    const parsed = tailorResumeSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            success: false,
            message: "Please provide a valid job description",
            errors: parsed.error.issues,
        });
    }
    const resumeId = Array.isArray(req.params.resumeId)
        ? req.params.resumeId[0]
        : req.params.resumeId;
    try {
        const data = await tailorResume(resumeId, req.user.id, parsed.data.jobDescription);
        return res.status(200).json({ success: true, data });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Unable to tailor resume";
        const status = message === "Resume not found" ? 404 : 422;
        return res.status(status).json({ success: false, message });
    }
};
