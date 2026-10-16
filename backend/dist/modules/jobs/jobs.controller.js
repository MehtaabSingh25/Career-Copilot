import * as jobsService from "./jobs.service.js";
import { createJobMatchSchema } from "./jobs.validator.js";
const getParam = (value) => Array.isArray(value) ? value[0] : value;
export const createMatch = async (req, res) => {
    const parsed = createJobMatchSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ success: false, message: "Invalid request", errors: parsed.error.issues });
    }
    try {
        const data = await jobsService.createJobMatch(req.user.id, parsed.data);
        return res.status(201).json({ success: true, data });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Unable to create job match";
        const status = message === "Resume not found" ? 404 : 422;
        return res.status(status).json({ success: false, message });
    }
};
export const listMatches = async (req, res) => {
    try {
        const data = await jobsService.listJobMatches(req.user.id);
        return res.status(200).json({ success: true, data });
    }
    catch {
        return res.status(500).json({ success: false, message: "Unable to load job matches" });
    }
};
export const getMatch = async (req, res) => {
    try {
        const data = await jobsService.getJobMatch(req.user.id, getParam(req.params.matchId));
        if (!data)
            return res.status(404).json({ success: false, message: "Job match not found" });
        return res.status(200).json({ success: true, data });
    }
    catch {
        return res.status(500).json({ success: false, message: "Unable to load job match" });
    }
};
