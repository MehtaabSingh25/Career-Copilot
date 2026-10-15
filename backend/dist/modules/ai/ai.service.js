import ai from "../../lib/gemini.js";
import Resume from "../../models/Resume.js";
import Analysis from "../../models/Analysis.js";
export const analyzeResume = async (resumeId, userId) => {
    const resume = await Resume.findOne({ _id: resumeId, user: userId });
    if (!resume) {
        throw new Error("Resume not found");
    }
    const prompt = `
You are an ATS Resume Analyzer.

Analyze the following resume.

Return ONLY valid JSON.

{
  "overallScore": number,
  "atsScore": number,
  "summary": string,
  "strengths": string[],
  "weaknesses": string[],
  "missingSkills": string[],
  "suggestions": string[]
}

Resume:

${resume.extractedText}
`;
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });
    let text = response.text ?? "";
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const result = JSON.parse(text);
    const analysis = await Analysis.create({
        resume: resume._id,
        ...result,
    });
    return analysis;
};
export const getLatestResumeAnalysis = async (resumeId, userId) => {
    const resume = await Resume.findOne({ _id: resumeId, user: userId });
    if (!resume) {
        throw new Error("Resume not found");
    }
    return Analysis.findOne({ resume: resume._id }).sort({ createdAt: -1 });
};
