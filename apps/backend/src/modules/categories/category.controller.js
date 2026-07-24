import asyncHandler from "../../shared/helpers/async-handler.js";
import ApiResponse from "../../shared/responses/api-response.js";
import * as categoryService from "./category.service.js";

export const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.validatedData);
  return ApiResponse.success(res, "Category created successfully", category, 201);
});

export const getCategories = asyncHandler(async (req, res) => {
  const result = await categoryService.getCategories(req.query);
  return ApiResponse.success(res, "Categories retrieved successfully", result, 200);
});

export const getCategoryById = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.id);
  return ApiResponse.success(res, "Category retrieved successfully", category, 200);
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.validatedData);
  return ApiResponse.success(res, "Category updated successfully", category, 200);
});

export const deleteCategory = asyncHandler(async (req, res) => {
  await categoryService.deleteCategory(req.params.id);
  return ApiResponse.success(res, "Category deleted successfully", null, 200);
});
