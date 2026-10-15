import mongoose, { Schema } from "mongoose";
const ResumeSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    originalName: {
        type: String,
        required: true,
    },
    fileName: {
        type: String,
        required: true,
    },
    fileUrl: {
        type: String,
        required: true,
    },
    extractedText: {
        type: String,
        default: "",
    },
}, {
    timestamps: true,
});
const Resume = mongoose.models.Resume || mongoose.model("Resume", ResumeSchema);
export default Resume;
