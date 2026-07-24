import asyncHandler from "../../shared/helpers/async-handler.js";
import ApiResponse from "../../shared/responses/api-response.js";
import * as skillService from "./skill.service.js";

export const createSkill = asyncHandler(async (req, res) => {
  const skill = await skillService.createSkill(req.validatedData);
  return ApiResponse.success(res, "Skill created successfully", skill, 201);
});

export const getSkills = asyncHandler(async (req, res) => {
  const result = await skillService.getSkills(req.query);
  return ApiResponse.success(res, "Skills retrieved successfully", result, 200);
});

export const getSkillById = asyncHandler(async (req, res) => {
  const skill = await skillService.getSkillById(req.params.id);
  return ApiResponse.success(res, "Skill retrieved successfully", skill, 200);
});

export const updateSkill = asyncHandler(async (req, res) => {
  const skill = await skillService.updateSkill(req.params.id, req.validatedData);
  return ApiResponse.success(res, "Skill updated successfully", skill, 200);
});

export const deleteSkill = asyncHandler(async (req, res) => {
  await skillService.deleteSkill(req.params.id);
  return ApiResponse.success(res, "Skill deleted successfully", null, 200);
});
