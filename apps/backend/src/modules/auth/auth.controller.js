import asyncHandler from "../../shared/helpers/async-handler.js";
import ApiResponse from "../../shared/responses/api-response.js";

import * as authService from "./auth.service.js";

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
  const result = await authService.login(req.validatedData);

  return ApiResponse.success(
    res,
    "Login successful",
    result
  );
});
