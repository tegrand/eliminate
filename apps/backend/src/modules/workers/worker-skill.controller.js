import asyncHandler from "../../shared/helpers/async-handler.js";
import ApiResponse from "../../shared/responses/api-response.js";
import * as workerSkillService from "./worker-skill.service.js";

export const assignSkill = asyncHandler(async (req, res) => {
  const payload = {
    ...req.validatedData,
    workerId: req.params.workerId,
  };
  const workerSkill = await workerSkillService.assignSkill(payload);
  return ApiResponse.success(res, "Skill assigned successfully", workerSkill, 201);
});

export const getWorkerSkills = asyncHandler(async (req, res) => {
  const skills = await workerSkillService.getWorkerSkills(req.params.workerId);
  return ApiResponse.success(res, "Worker skills retrieved successfully", skills, 200);
});

export const updateWorkerSkill = asyncHandler(async (req, res) => {
  const workerSkill = await workerSkillService.updateWorkerSkill(
    req.params.workerId,
    req.params.skillId,
    req.validatedData
  );
  return ApiResponse.success(res, "Worker skill updated successfully", workerSkill, 200);
});

export const deleteWorkerSkill = asyncHandler(async (req, res) => {
  await workerSkillService.deleteWorkerSkill(req.params.workerId, req.params.skillId);
  return ApiResponse.success(res, "Worker skill removed successfully", null, 200);
});
