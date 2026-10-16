import mongoose, { Document, Schema } from "mongoose";

export type RequirementImportance = "required" | "preferred";
export type RequirementStatus = "match" | "partial" | "missing";

export interface IJobRequirement {
  name: string;
  importance: RequirementImportance;
  status: RequirementStatus;
  evidence: string;
  explanation: string;
}

export interface IJobMatch extends Document {
  user: mongoose.Types.ObjectId;
  resume: mongoose.Types.ObjectId;
  jobTitle: string;
  company: string;
  jobDescription: string;
  requirements: IJobRequirement[];
  matchScore: number;
  summary: string;
  recommendations: string[];
}

const RequirementSchema = new Schema<IJobRequirement>(
  {
    name: { type: String, required: true, trim: true },
    importance: { type: String, enum: ["required", "preferred"], required: true },
    status: { type: String, enum: ["match", "partial", "missing"], required: true },
    evidence: { type: String, default: "" },
    explanation: { type: String, required: true },
  },
  { _id: false },
);

const JobMatchSchema = new Schema<IJobMatch>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    resume: { type: Schema.Types.ObjectId, ref: "Resume", required: true, index: true },
    jobTitle: { type: String, required: true, trim: true, maxlength: 120 },
    company: { type: String, default: "", trim: true, maxlength: 120 },
    jobDescription: { type: String, required: true, maxlength: 20000 },
    requirements: { type: [RequirementSchema], default: [] },
    matchScore: { type: Number, required: true, min: 0, max: 100 },
    summary: { type: String, required: true },
    recommendations: { type: [String], default: [] },
  },
  { timestamps: true },
);

JobMatchSchema.index({ user: 1, createdAt: -1 });

const JobMatch =
  mongoose.models.JobMatch || mongoose.model<IJobMatch>("JobMatch", JobMatchSchema);

export default JobMatch;
