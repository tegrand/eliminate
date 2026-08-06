import * as JobRequirementService from "./job-requirement.service.js";
import asyncHandler from "../../shared/helpers/async-handler.js";
import AppError from "../../shared/errors/app-error.js";
import prisma from "../../config/prisma.js";

const getClientId = async (userId) => {
  const client = await prisma.client.findUnique({ where: { userId } });
  if (!client) throw new AppError("Client profile not found for this user", 404);
  return client.id;
};

export const createJobRequirement = asyncHandler(async (req, res) => {
  if (req.user.profileType !== "CLIENT") {
    throw new AppError("Only clients can create job requirements", 403);
  }
  
  // We fetch the proper Client model UUID for the logged in User
  const clientId = await getClientId(req.user.id);

  const jobRequirement = await JobRequirementService.createJobRequirement(clientId, req.body);
  
  res.status(201).json({
    status: "success",
    data: { jobRequirement },
  });
});

export const getJobRequirements = asyncHandler(async (req, res) => {
  const clientId = await getClientId(req.user.id);
  const result = await JobRequirementService.getJobRequirements(clientId, req.query);

  res.status(200).json({
    status: "success",
    data: result,
  });
});

export const getJobRequirementById = asyncHandler(async (req, res) => {
  const clientId = await getClientId(req.user.id);
  const jobRequirement = await JobRequirementService.getJobRequirementById(req.params.id, clientId);

  res.status(200).json({
    status: "success",
    data: { jobRequirement },
  });
});

export const updateJobRequirement = asyncHandler(async (req, res) => {
  const clientId = await getClientId(req.user.id);
  const jobRequirement = await JobRequirementService.updateJobRequirement(req.params.id, clientId, req.body);

  res.status(200).json({
    status: "success",
    data: { jobRequirement },
  });
});

export const deleteJobRequirement = asyncHandler(async (req, res) => {
  const clientId = await getClientId(req.user.id);
  await JobRequirementService.deleteJobRequirement(req.params.id, clientId);

  res.status(204).json({
    status: "success",
    data: null,
  });
});

export const closeJobRequirement = asyncHandler(async (req, res) => {
  const clientId = await getClientId(req.user.id);
  const jobRequirement = await JobRequirementService.closeJobRequirement(req.params.id, clientId);

  res.status(200).json({
    status: "success",
    data: { jobRequirement },
  });
});

export const reopenJobRequirement = asyncHandler(async (req, res) => {
  const clientId = await getClientId(req.user.id);
  const jobRequirement = await JobRequirementService.reopenJobRequirement(req.params.id, clientId);

  res.status(200).json({
    status: "success",
    data: { jobRequirement },
  });
});

export const duplicateJobRequirement = asyncHandler(async (req, res) => {
  const clientId = await getClientId(req.user.id);
  const jobRequirement = await JobRequirementService.duplicateJobRequirement(req.params.id, clientId);

  res.status(201).json({
    status: "success",
    data: { jobRequirement },
  });
});

export const requestWorkerReplacement = asyncHandler(async (req, res) => {
  const clientId = await getClientId(req.user.id);
  const application = await JobRequirementService.requestWorkerReplacement(
    req.params.id, 
    req.params.applicationId, 
    clientId, 
    req.body.reason
  );

  res.status(200).json({
    status: "success",
    data: { application },
  });
});

export const requestWorkerRemoval = asyncHandler(async (req, res) => {
  const clientId = await getClientId(req.user.id);
  const application = await JobRequirementService.requestWorkerRemoval(
    req.params.id, 
    req.params.applicationId, 
    clientId, 
    req.body.reason
  );

  res.status(200).json({
    status: "success",
    data: { application },
  });
});
