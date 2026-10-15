import * as resumeService from "./resume.service.js";
const getParam = (value) => Array.isArray(value) ? value[0] : value;
export const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Resume PDF is required",
            });
        }
        const result = await resumeService.uploadResume(req.user.id, req.file, req.body.title);
        return res.status(201).json({
            success: true,
            message: "Resume uploaded successfully",
            data: result,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
export const listResumes = async (req, res) => {
    try {
        const result = await resumeService.getUserResumes(req.user.id);
        return res.status(200).json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
export const getResume = async (req, res) => {
    try {
        const result = await resumeService.getUserResumeById(req.user.id, getParam(req.params.resumeId));
        return res.status(200).json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};
export const deleteResume = async (req, res) => {
    try {
        const result = await resumeService.deleteUserResume(req.user.id, getParam(req.params.resumeId));
        return res.status(200).json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};
