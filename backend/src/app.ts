import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.routes.js";
import resumeRoutes from "./modules/resume/resume.routes.js";
import aiRoutes from "./modules/ai/ai.routes.js";
import jobsRoutes from "./modules/jobs/jobs.routes.js";

const app = express();

// The app runs behind Render's reverse proxy in production. Use the client IP
// forwarded by the single trusted proxy so IP-based rate limits work correctly.
app.set("trust proxy", 1);

app.use(
    cors({
        origin: [
            "http://localhost:3000",
            "https://resume-analyzer-topaz-seven.vercel.app"
        ],
        credentials: true
    })
);
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Resume Analyzer Backend is Running 🚀",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/jobs", jobsRoutes);

export default app;
