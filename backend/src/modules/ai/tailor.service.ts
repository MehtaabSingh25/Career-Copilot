import ai from "../../lib/gemini.js";
import Resume from "../../models/Resume.js";
import {
  tailoredResumeResponseSchema,
  type TailoredResumeDraft,
} from "./tailor.validator.js";

const responseSchema = {
  type: "OBJECT",
  properties: {
    professionalSummary: { type: "STRING" },
    skills: { type: "ARRAY", items: { type: "STRING" } },
    experienceBullets: { type: "ARRAY", items: { type: "STRING" } },
    projectBullets: { type: "ARRAY", items: { type: "STRING" } },
    keywords: { type: "ARRAY", items: { type: "STRING" } },
    changeNotes: { type: "ARRAY", items: { type: "STRING" } },
    cautions: { type: "ARRAY", items: { type: "STRING" } },
  },
  required: [
    "professionalSummary",
    "skills",
    "experienceBullets",
    "projectBullets",
    "keywords",
    "changeNotes",
    "cautions",
  ],
};

export const tailorResume = async (
  resumeId: string,
  userId: string,
  jobDescription: string,
): Promise<TailoredResumeDraft> => {
  const resume = await Resume.findOne({ _id: resumeId, user: userId });
  if (!resume) throw new Error("Resume not found");
  if (!resume.extractedText.trim()) {
    throw new Error("This resume has no extractable text. Upload a text-based PDF and try again.");
  }

  const prompt = `You are a careful resume editor. Tailor the supplied resume to the target job description.

Non-negotiable rules:
- Use only facts, skills, experience, qualifications, projects, and achievements supported by the source resume.
- Never invent metrics, employers, dates, responsibilities, credentials, skills, or achievements.
- You may improve clarity, grammar, order, and relevance, but each rewritten bullet must remain faithful to the source.
- Include only skills supported by the source resume. Do not add job keywords as if the candidate possesses them.
- Put relevant job-description keywords in the keywords list only when they are genuinely supported by the resume; put unsupported important requirements in cautions.
- If a section has no supporting content, return an empty string or empty array as appropriate.
- The output is a draft for the user to review, not a claim that every job requirement is met.
- Return JSON only, matching the response schema.

TARGET JOB DESCRIPTION:
${jobDescription}

SOURCE RESUME:
${resume.extractedText.slice(0, 16000)}`;

  let responseText = "";
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema as never,
        temperature: 0.1,
      },
    });
    responseText = response.text ?? "";
  } catch {
    throw new Error("Resume tailoring is unavailable right now. Please try again shortly.");
  }

  try {
    const cleaned = responseText
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();
    return tailoredResumeResponseSchema.parse(JSON.parse(cleaned));
  } catch {
    throw new Error("The AI returned an invalid tailoring draft. Please try again.");
  }
};
