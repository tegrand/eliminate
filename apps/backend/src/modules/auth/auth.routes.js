import { Router } from "express";

import { register, login, refreshToken, logout, me } from "./auth.controller.js";
import { registerSchema, loginSchema } from "./auth.validation.js";

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

export default router;
