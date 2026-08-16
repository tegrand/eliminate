import { Router } from "express";

import { register, login, googleLogin, refreshToken, logout, me, changePassword, verifyPassword, forgotPassword, resetPassword, verifyEmail, resendVerification } from "./auth.controller.js";
import { registerSchema, loginSchema, changePasswordSchema, forgotPasswordSchema, resetPasswordSchema, verifyEmailSchema, resendVerificationSchema } from "./auth.validation.js";

import validate from "../../middleware/validate.middleware.js";
import authenticate from "../../middleware/auth.middleware.js";
import { authRateLimiter } from "../../middleware/rate-limit.middleware.js";

const router = Router();

router.post(
  "/register",
  // authRateLimiter,
  validate(registerSchema),
  register
);

router.post(
  "/login",
  // authRateLimiter,
  validate(loginSchema),
  login
);

router.post("/google-login", googleLogin);

router.post("/refresh-token", refreshToken);

router.post("/logout", logout);

router.get("/me", authenticate, me);

router.patch(
  "/change-password",
  authenticate,
  validate(changePasswordSchema),
  changePassword
);

router.post(
  "/verify-password",
  authenticate,
  verifyPassword
);

router.post(
  "/forgot-password",
  // authRateLimiter,
  validate(forgotPasswordSchema),
  forgotPassword
);

router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  resetPassword
);

router.post(
  "/verify-email",
  validate(verifyEmailSchema),
  verifyEmail
);

router.post(
  "/resend-verification",
  validate(resendVerificationSchema),
  resendVerification
);

export default router;
