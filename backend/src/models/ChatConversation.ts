import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
  {
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true, maxlength: 12000 },
  },
  { timestamps: true },
);

const chatConversationSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, maxlength: 100 },
    resume: { type: Schema.Types.ObjectId, ref: "Resume", default: null },
    messages: { type: [messageSchema], default: [] },
  },
  { timestamps: true },
);

chatConversationSchema.index({ user: 1, updatedAt: -1 });

export default mongoose.model("ChatConversation", chatConversationSchema);
