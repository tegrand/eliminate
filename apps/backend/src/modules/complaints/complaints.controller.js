import asyncHandler from "../../shared/helpers/async-handler.js";
import ApiResponse from "../../shared/responses/api-response.js";
import * as complaintsService from "./complaints.service.js";
import prisma from "../../config/prisma.js";
import AppError from "../../shared/errors/app-error.js";

const getClientId = async (userId) => {
  const client = await prisma.client.findUnique({ where: { userId } });
  if (!client) throw new AppError("Only clients can access complaints right now", 403);
  return client.id;
};

export const createComplaint = asyncHandler(async (req, res) => {
  const clientId = await getClientId(req.user.id);
  const complaint = await complaintsService.createComplaint(clientId, req.body);
  return ApiResponse.success(res, "Complaint filed successfully", complaint, 201);
});

export const getComplaints = asyncHandler(async (req, res) => {
  const clientId = await getClientId(req.user.id);
  const complaints = await complaintsService.getComplaints(clientId, req.query);
  return ApiResponse.success(res, "Complaints retrieved", complaints, 200);
});

export const updateComplaintStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const updated = await complaintsService.updateComplaintStatus(id, status);
  return ApiResponse.success(res, "Complaint status updated", updated, 200);
});
