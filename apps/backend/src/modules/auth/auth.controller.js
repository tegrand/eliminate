import asyncHandler from "../../shared/helpers/async-handler.js";
import ApiResponse from "../../shared/responses/api-response.js";
import AppError from "../../shared/errors/app-error.js";
import * as authService from "./auth.service.js";
import authConfig from "../../config/auth.config.js";
import { parseExpToMs } from "./auth.utils.js";

export const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.validatedData);

  return ApiResponse.success(
    res,
    "Account created successfully",
    user,
    201
  );
});

export const login = asyncHandler(async (req, res) => {
  const { accessToken, refreshToken, user } = await authService.login(req.validatedData);

  const maxAge = parseExpToMs(authConfig.refreshExpiresIn);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge
  });

  return ApiResponse.success(
    res,
    "Login successful",
    { accessToken, user }
  );
});

export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    throw new AppError("Unauthorized", 401);
  }

  const { accessToken, newRefreshToken, user } = await authService.refreshToken(token);

  const maxAge = parseExpToMs(authConfig.refreshExpiresIn);

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge
  });

  return ApiResponse.success(
    res,
    "Token refreshed successfully",
    { accessToken, user }
  );
});

export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;

  await authService.logout(token);

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  return ApiResponse.success(
    res,
    "Logged out successfully",
    null
  );
});

export const me = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user.id);

  return ApiResponse.success(
    res,
    "Current user fetched successfully",
    user
  );
});

export const changePassword = asyncHandler(async (req, res) => {
  await authService.changePassword(req.user.id, req.validatedData);

  return ApiResponse.success(
    res,
    "Password changed successfully",
    null
  );
});

export const forgotPassword = asyncHandler(async (req, res) => {
  await authService.forgotPassword(req.validatedData);
  return ApiResponse.success(res, "If the email exists, a password reset link has been sent.", null);
});

export const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.validatedData);
  return ApiResponse.success(res, "Password reset successfully.", null);
});

export const verifyEmail = asyncHandler(async (req, res) => {
  await authService.verifyEmail(req.validatedData);
  return ApiResponse.success(res, "Email verified successfully.", null);
});

export const resendVerification = asyncHandler(async (req, res) => {
  await authService.resendVerification(req.validatedData);
  return ApiResponse.success(res, "If your email is registered and unverified, a verification link has been sent.", null);
});
