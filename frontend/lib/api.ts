const API = process.env.NEXT_PUBLIC_API_URL;

export type User = {
  _id?: string;
  id?: string;
  name: string;
  email: string;
};

export type ResumeAnalysis = {
  _id: string;
  resume: string;
  atsScore: number;
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  suggestions: string[];
  summary: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ResumeRecord = {
  _id: string;
  user: string;
  title: string;
  originalName: string;
  fileName: string;
  fileUrl: string;
  createdAt: string;
  updatedAt: string;
  analysis: ResumeAnalysis | null;
};

type AuthPayload = {
  name?: string;
  email: string;
  password: string;
};

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("resume_ai_token");
}

async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  token = getToken(),
) {
  const headers = new Headers(options.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok || data.success === false) {
    throw new Error(data.message ?? "Request failed");
  }

  return data as T;
}

export async function authenticate(
  mode: "login" | "register",
  payload: AuthPayload,
) {
  return apiRequest<{
    success: boolean;
    token?: string;
    user?: User | { token?: string; user?: User };
  }>(`/api/auth/${mode}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }, null);
}

export async function getCurrentUser() {
  return apiRequest<{ success: boolean; user: User }>("/api/auth/me");
}

export async function uploadResume(file: File, token: string, title?: string) {
  const formData = new FormData();
  formData.append("resume", file);
  if (title) formData.append("title", title);

  return apiRequest<{ success: boolean; data: ResumeRecord }>(
    "/api/resume/upload",
    {
      method: "POST",
      body: formData,
    },
    token,
  );
}

export async function getResumes() {
  return apiRequest<{ success: boolean; data: ResumeRecord[] }>("/api/resume");
}

export async function getResume(resumeId: string) {
  return apiRequest<{ success: boolean; data: ResumeRecord }>(
    `/api/resume/${resumeId}`,
  );
}

export async function deleteResume(resumeId: string) {
  return apiRequest<{ success: boolean; data: { id: string } }>(
    `/api/resume/${resumeId}`,
    {
      method: "DELETE",
    },
  );
}

export async function analyzeResume(resumeId: string, token = getToken()) {
  return apiRequest<{ success: boolean; data: ResumeAnalysis }>(
    `/api/ai/analyze/${resumeId}`,
    {
      method: "POST",
    },
    token,
  );
}

export async function getLatestAnalysis(resumeId: string) {
  return apiRequest<{ success: boolean; data: ResumeAnalysis | null }>(
    `/api/ai/analysis/${resumeId}`,
  );
}


export type JobRequirement = {
  name: string;
  importance: "required" | "preferred";
  status: "match" | "partial" | "missing";
  evidence: string;
  explanation: string;
};

export type JobMatchRecord = {
  _id: string;
  resume: string;
  jobTitle: string;
  company: string;
  jobDescription?: string;
  requirements: JobRequirement[];
  matchScore: number;
  summary: string;
  recommendations: string[];
  createdAt: string;
  updatedAt: string;
};

export async function createJobMatch(payload: {
  resumeId: string;
  jobTitle: string;
  company?: string;
  jobDescription: string;
}) {
  return apiRequest<{ success: boolean; data: JobMatchRecord }>(
    "/api/jobs/match",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );
}

export async function getJobMatches() {
  return apiRequest<{ success: boolean; data: JobMatchRecord[] }>("/api/jobs/matches");
}
