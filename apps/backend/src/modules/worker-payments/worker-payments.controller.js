import asyncHandler from "../../shared/helpers/async-handler.js";
import ApiResponse from "../../shared/responses/api-response.js";
import * as paymentsService from "./worker-payments.service.js";

export const getMyPayments = asyncHandler(async (req, res) => {
  const result = await paymentsService.getMyPayments(req.user.id, req.query);
  return ApiResponse.success(res, "Payments retrieved", result, 200);
});

export const getPaymentSummary = asyncHandler(async (req, res) => {
  const result = await paymentsService.getPaymentSummary(req.user.id);
  return ApiResponse.success(res, "Payment summary retrieved", result, 200);
});

export const getPaymentById = asyncHandler(async (req, res) => {
  const result = await paymentsService.getPaymentById(req.user.id, req.params.id);
  return ApiResponse.success(res, "Payment details retrieved", result, 200);
});
