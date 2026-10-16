import { Router } from "express";

import {
  registerUser,
  loginUser,
  currentUser,
  logoutUser,
} from "./auth.controller.js";

import authMiddleware from "../../middleware/auth.middleware.js";
import validate from "../../middleware/validate.js";
import { authLimiter, registerLimiter } from "../../middleware/rateLimiter.js";

import { loginSchema, registerSchema } from "./auth.validator.js";

const router = Router();

router.post("/register", registerLimiter, validate(registerSchema), registerUser);

router.post("/login", authLimiter, validate(loginSchema), loginUser);

router.get("/me", authMiddleware, currentUser);

router.post("/logout", authMiddleware, logoutUser);

export default router;
