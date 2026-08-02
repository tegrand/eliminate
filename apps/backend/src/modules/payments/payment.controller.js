import asyncHandler from "../../shared/helpers/async-handler.js";
import ApiResponse from "../../shared/responses/api-response.js";
import * as paymentService from "./payment.service.js";

export const createOrder = asyncHandler(async (req, res) => {
  const { hiringRequestId } = req.body;
  if (!hiringRequestId) {
    return ApiResponse.error(res, "hiringRequestId is required", 400);
  }
  const order = await paymentService.createOrder(hiringRequestId, req.user.id);
  return ApiResponse.success(res, "Order created successfully", order, 201);
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return ApiResponse.error(res, "Missing payment details", 400);
  }
  
  const result = await paymentService.verifyPayment(
    razorpay_order_id, 
    razorpay_payment_id, 
    razorpay_signature
  );
  
  return ApiResponse.success(res, "Payment verified successfully", result, 200);
});

export const webhook = asyncHandler(async (req, res) => {
  const signature = req.headers["x-razorpay-signature"];
  
  if (!signature) {
    return ApiResponse.error(res, "Missing signature", 400);
  }

  try {
    // req.body is a Buffer because we used express.raw() in routes
    await paymentService.processWebhook(req.body, signature);
    return res.status(200).send("OK");
  } catch (error) {
    console.error("Webhook error:", error);
    return res.status(400).send("Webhook Error");
  }
});
