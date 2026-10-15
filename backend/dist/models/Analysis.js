import mongoose, { Schema } from "mongoose";
const AnalysisSchema = new Schema({
    resume: {
        type: Schema.Types.ObjectId,
        ref: "Resume",
        required: true,
    },
    atsScore: {
        type: Number,
        default: 0,
    },
    overallScore: {
        type: Number,
        default: 0,
    },
    strengths: [String],
    weaknesses: [String],
    missingSkills: [String],
    suggestions: [String],
    summary: {
        type: String,
        default: "",
    },
}, {
    timestamps: true,
});
const Analysis = mongoose.models.Analysis ||
    mongoose.model("Analysis", AnalysisSchema);
export default Analysis;
