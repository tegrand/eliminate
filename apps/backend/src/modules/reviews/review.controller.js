import asyncHandler from "../../shared/helpers/async-handler.js";
import ApiResponse from "../../shared/responses/api-response.js";
import * as reviewService from "./review.service.js";

export const createReview = asyncHandler(async (req, res) => {
  const review = await reviewService.createReview(req.user.id, req.body);
  return ApiResponse.success(res, "Review submitted successfully", review, 201);
});

export const getReviews = asyncHandler(async (req, res) => {
  const reviews = await reviewService.getReviews(req.query);
  return ApiResponse.success(res, "Reviews fetched successfully", reviews, 200);
});
