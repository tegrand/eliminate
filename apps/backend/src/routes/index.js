import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import jobRequirementRoutes from "../modules/job-requirement/job-requirement.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/job-requirements", jobRequirementRoutes);

router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API Healthy",
  });
});

export default router;