import asyncHandler from "../../shared/helpers/async-handler.js";
import ApiResponse from "../../shared/responses/api-response.js";

import * as authService from "./auth.service.js";

export const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);

  return ApiResponse.success(
    res,
    "Account created successfully",
    user,
    201
  );
});
