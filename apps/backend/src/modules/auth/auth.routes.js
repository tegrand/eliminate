import { Router } from "express";

import { register, login, refreshToken, logout, me, changePassword, forgotPassword, resetPassword, verifyEmail, resendVerification } from "./auth.controller.js";
import { registerSchema, loginSchema, changePasswordSchema, forgotPasswordSchema, resetPasswordSchema, verifyEmailSchema, resendVerificationSchema } from "./auth.validation.js";

import validate from "../../middleware/validate.middleware.js";
import authenticate from "../../middleware/auth.middleware.js";

const router = Router();

router.post(
  "/register",
  validate(registerSchema),
  register
);

router.post(
  "/login",
  validate(loginSchema),
  login
);

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
  "/forgot-password",
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
