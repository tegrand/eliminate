import express from "express";
import authenticate from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorize.middleware.js";
import * as reviewController from "./review.controller.js";

const router = express.Router();

router.use(authenticate);

// Clients can create reviews
router.post(
  "/",
  authorize("CLIENT"),
  reviewController.createReview
);

// Anyone logged in can view reviews (could restrict if needed)
router.get(
  "/",
  reviewController.getReviews
);

export default router;
