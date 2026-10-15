import streamifier from "streamifier";
import { v4 as uuid } from "uuid";
import { extractPdfText } from "../../lib/pdf.js";
import cloudinary from "../../lib/cloudinary.js";
import Resume from "../../models/Resume.js";
import Analysis from "../../models/Analysis.js";
export const uploadResume = async (userId, file, title) => {
    // Extract text from PDF
    const extractedText = await extractPdfText(file.buffer);
    // Upload PDF to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({
            folder: "resume-analyzer",
            resource_type: "raw",
            public_id: uuid(),
        }, (error, result) => {
            if (error)
                return reject(error);
            resolve(result);
        });
        streamifier.createReadStream(file.buffer).pipe(stream);
    });
    // Save resume in MongoDB
    const resume = await Resume.create({
        user: userId,
        title: title || file.originalname,
        originalName: file.originalname,
        fileName: uploadResult.public_id,
        fileUrl: uploadResult.secure_url,
        extractedText,
    });
    return resume;
};
export const getUserResumes = async (userId) => {
    const resumes = await Resume.find({ user: userId })
        .select("-extractedText")
        .sort({ createdAt: -1 })
        .lean();
    const resumeIds = resumes.map((resume) => resume._id);
    const analyses = await Analysis.find({ resume: { $in: resumeIds } })
        .sort({ createdAt: -1 })
        .lean();
    const latestAnalysisByResume = new Map();
    for (const analysis of analyses) {
        const resumeId = analysis.resume.toString();
        if (!latestAnalysisByResume.has(resumeId)) {
            latestAnalysisByResume.set(resumeId, analysis);
        }
    }
    return resumes.map((resume) => ({
        ...resume,
        analysis: latestAnalysisByResume.get(resume._id.toString()) ?? null,
    }));
};
export const getUserResumeById = async (userId, resumeId) => {
    const resume = await Resume.findOne({ _id: resumeId, user: userId })
        .select("-extractedText")
        .lean();
    if (!resume) {
        throw new Error("Resume not found");
    }
    const analysis = await Analysis.findOne({ resume: resume._id })
        .sort({ createdAt: -1 })
        .lean();
    return {
        ...resume,
        analysis,
    };
};
export const deleteUserResume = async (userId, resumeId) => {
    const resume = await Resume.findOne({ _id: resumeId, user: userId });
    if (!resume) {
        throw new Error("Resume not found");
    }
    await Analysis.deleteMany({ resume: resume._id });
    try {
        await cloudinary.uploader.destroy(resume.fileName, {
            resource_type: "raw",
        });
    }
    catch {
        // Keep deletion resilient if Cloudinary cleanup fails.
    }
    await resume.deleteOne();
    return { id: resumeId };
};
