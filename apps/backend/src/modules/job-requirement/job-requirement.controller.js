import * as JobRequirementService from "./job-requirement.service.js";
import asyncHandler from "../../shared/helpers/async-handler.js";
import AppError from "../../shared/errors/app-error.js";

export const createJobRequirement = asyncHandler(async (req, res) => {
  if (req.user.profileType !== "CLIENT") {
    throw new AppError("Only clients can create job requirements", 403);
  }
  
  // We assume req.user has the linked clientId logic somewhere.
  // For now, let's assume req.user.id can map to a client, or passed in payload.
  // Since we don't have the explicit user-to-client middleware code here, we'll extract it.
  const clientId = req.body.clientId || req.user.id; // Fallback for demonstration

  const jobRequirement = await JobRequirementService.createJobRequirement(clientId, req.body);
  
  res.status(201).json({
    status: "success",
    data: { jobRequirement },
  });
});

export const getJobRequirements = asyncHandler(async (req, res) => {
  const clientId = req.user.id; // Assumed mapped clientId
  const result = await JobRequirementService.getJobRequirements(clientId, req.query);

  res.status(200).json({
    status: "success",
    data: result,
  });
});

export const getJobRequirementById = asyncHandler(async (req, res) => {
  const clientId = req.user.id; // Assumed mapped clientId
  const jobRequirement = await JobRequirementService.getJobRequirementById(req.params.id, clientId);

  res.status(200).json({
    status: "success",
    data: { jobRequirement },
  });
});

export const updateJobRequirement = asyncHandler(async (req, res) => {
  const clientId = req.user.id;
  const jobRequirement = await JobRequirementService.updateJobRequirement(req.params.id, clientId, req.body);

  res.status(200).json({
    status: "success",
    data: { jobRequirement },
  });
});

export const cancelJobRequirement = asyncHandler(async (req, res) => {
  const clientId = req.user.id;
  const { cancellationReason } = req.body;
  const jobRequirement = await JobRequirementService.cancelJobRequirement(req.params.id, clientId, cancellationReason);

  res.status(200).json({
    status: "success",
    data: { jobRequirement },
  });
});

export const deleteJobRequirement = asyncHandler(async (req, res) => {
  const clientId = req.user.id;
  await JobRequirementService.deleteJobRequirement(req.params.id, clientId);

  res.status(204).json({
    status: "success",
    data: null,
  });
});
