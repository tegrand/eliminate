import asyncHandler from "../../shared/helpers/async-handler.js";
import ApiResponse from "../../shared/responses/api-response.js";
import * as complaintsService from "./complaints.service.js";
import prisma from "../../config/prisma.js";
import AppError from "../../shared/errors/app-error.js";

const getComplainantIds = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { client: true, worker: true, agency: true }
  });
  
  if (!user) throw new AppError("User not found", 404);
  
  return {
    clientId: user.client?.id,
    workerId: user.worker?.id,
    agencyId: user.agency?.id
  };
};

export const createComplaint = asyncHandler(async (req, res) => {
  const ids = await getComplainantIds(req.user.id);
  const complaint = await complaintsService.createComplaint(ids, req.body);
  return ApiResponse.success(res, "Complaint filed successfully", complaint, 201);
});

export const getComplaints = asyncHandler(async (req, res) => {
  const ids = await getComplainantIds(req.user.id);
  const complaints = await complaintsService.getComplaints(ids, req.query);
  return ApiResponse.success(res, "Complaints retrieved", complaints, 200);
});

export const updateComplaintStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const updated = await complaintsService.updateComplaintStatus(id, status);
  return ApiResponse.success(res, "Complaint status updated", updated, 200);
});
