import mongoose, { Schema } from "mongoose";
const RequirementSchema = new Schema({
    name: { type: String, required: true, trim: true },
    importance: { type: String, enum: ["required", "preferred"], required: true },
    status: { type: String, enum: ["match", "partial", "missing"], required: true },
    evidence: { type: String, default: "" },
    explanation: { type: String, required: true },
}, { _id: false });
const JobMatchSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    resume: { type: Schema.Types.ObjectId, ref: "Resume", required: true, index: true },
    jobTitle: { type: String, required: true, trim: true, maxlength: 120 },
    company: { type: String, default: "", trim: true, maxlength: 120 },
    jobDescription: { type: String, required: true, maxlength: 20000 },
    requirements: { type: [RequirementSchema], default: [] },
    matchScore: { type: Number, required: true, min: 0, max: 100 },
    summary: { type: String, required: true },
    recommendations: { type: [String], default: [] },
}, { timestamps: true });
JobMatchSchema.index({ user: 1, createdAt: -1 });
const JobMatch = mongoose.models.JobMatch || mongoose.model("JobMatch", JobMatchSchema);
export default JobMatch;
