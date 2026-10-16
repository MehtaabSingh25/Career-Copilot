import mongoose from "mongoose";
import ai from "../../lib/gemini.js";
import JobMatch from "../../models/JobMatch.js";
import Resume from "../../models/Resume.js";
import { scoreRequirements } from "./jobs.scoring.js";
const requirementResultSchema = {
    type: "OBJECT",
    properties: {
        name: { type: "STRING" },
        importance: { type: "STRING", enum: ["required", "preferred"] },
        status: { type: "STRING", enum: ["match", "partial", "missing"] },
        evidence: { type: "STRING" },
        explanation: { type: "STRING" },
    },
    required: ["name", "importance", "status", "evidence", "explanation"],
};
const modelResponseSchema = {
    type: "OBJECT",
    properties: {
        summary: { type: "STRING" },
        requirements: { type: "ARRAY", items: requirementResultSchema },
        recommendations: { type: "ARRAY", items: { type: "STRING" } },
    },
    required: ["summary", "requirements", "recommendations"],
};
const parseModelJson = (text) => {
    const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
    const parsed = JSON.parse(cleaned);
    if (!parsed || typeof parsed !== "object") {
        throw new Error("The AI returned an invalid response. Please try again.");
    }
    const result = parsed;
    if (typeof result.summary !== "string" ||
        !Array.isArray(result.requirements) ||
        !Array.isArray(result.recommendations)) {
        throw new Error("The AI returned an incomplete response. Please try again.");
    }
    const requirements = result.requirements;
    const validRequirements = requirements.every((item) => item &&
        typeof item.name === "string" &&
        (item.importance === "required" || item.importance === "preferred") &&
        (item.status === "match" || item.status === "partial" || item.status === "missing") &&
        typeof item.evidence === "string" &&
        typeof item.explanation === "string");
    if (!validRequirements || !result.recommendations.every((item) => typeof item === "string")) {
        throw new Error("The AI returned data in an unexpected format. Please try again.");
    }
    return {
        summary: result.summary,
        requirements: requirements,
        recommendations: result.recommendations,
    };
};
export const createJobMatch = async (userId, input) => {
    if (!mongoose.isValidObjectId(input.resumeId)) {
        throw new Error("Resume not found");
    }
    const resume = await Resume.findOne({ _id: input.resumeId, user: userId });
    if (!resume)
        throw new Error("Resume not found");
    if (!resume.extractedText.trim()) {
        throw new Error("This resume has no extractable text. Upload a text-based PDF and try again.");
    }
    const prompt = `You are a careful resume-to-job requirement evaluator. Compare the candidate resume with the job description.

Rules:
- Extract a concise list of meaningful job requirements. Include technical skills, relevant experience, qualifications, and important responsibilities.
- Mark each requirement as "required" only when the job description explicitly presents it as mandatory or essential. Otherwise use "preferred".
- Use status "match" only when the resume provides clear supporting evidence, "partial" when evidence is adjacent or incomplete, and "missing" when no supporting evidence appears in the resume.
- Evidence must be a short exact or faithful excerpt from the resume. Never invent employers, skills, qualifications, dates, projects, or achievements.
- A missing resume mention does not prove the candidate lacks the skill; it means the resume does not demonstrate it.
- Return 5 to 20 requirements where the supplied job description supports that many. Avoid duplicate requirements.
- Recommendations must be practical and must not encourage the candidate to claim experience they do not have.
- Return JSON only, following the supplied response schema.

Job title: ${input.jobTitle}
Company: ${input.company || "Not provided"}

JOB DESCRIPTION:
${input.jobDescription}

CANDIDATE RESUME:
${resume.extractedText.slice(0, 16000)}`;
    let responseText = "";
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: modelResponseSchema,
                temperature: 0.1,
            },
        });
        responseText = response.text ?? "";
    }
    catch {
        throw new Error("The job match could not be generated right now. Please try again shortly.");
    }
    let result;
    try {
        result = parseModelJson(responseText);
    }
    catch (error) {
        throw error instanceof Error ? error : new Error("The AI returned an invalid response. Please try again.");
    }
    if (result.requirements.length === 0) {
        throw new Error("No job requirements could be identified. Please provide a more detailed job description.");
    }
    const matchScore = scoreRequirements(result.requirements);
    return JobMatch.create({
        user: userId,
        resume: resume._id,
        jobTitle: input.jobTitle,
        company: input.company,
        jobDescription: input.jobDescription,
        requirements: result.requirements,
        matchScore,
        summary: result.summary,
        recommendations: result.recommendations,
    });
};
export const listJobMatches = async (userId) => JobMatch.find({ user: userId })
    .select("jobTitle company resume matchScore summary createdAt updatedAt")
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();
export const getJobMatch = async (userId, matchId) => {
    if (!mongoose.isValidObjectId(matchId))
        return null;
    return JobMatch.findOne({ _id: matchId, user: userId }).lean();
};
