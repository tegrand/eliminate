import asyncHandler from "../../shared/helpers/async-handler.js";
import ApiResponse from "../../shared/responses/api-response.js";
import * as clientService from "./client.service.js";

export const createClient = asyncHandler(async (req, res) => {
  const client = await clientService.createClient(req.user.id, req.validatedData);
  return ApiResponse.success(res, "Client created successfully", client, 201);
});

export const getClients = asyncHandler(async (req, res) => {
  const result = await clientService.getClients(req.query);
  return ApiResponse.success(res, "Clients retrieved successfully", result, 200);
});

export const getClientById = asyncHandler(async (req, res) => {
  const client = await clientService.getClientById(req.params.id);
  return ApiResponse.success(res, "Client retrieved successfully", client, 200);
});

export const updateClient = asyncHandler(async (req, res) => {
  const client = await clientService.updateClient(req.params.id, req.validatedData);
  return ApiResponse.success(res, "Client updated successfully", client, 200);
});

export const deleteClient = asyncHandler(async (req, res) => {
  await clientService.deleteClient(req.params.id);
  return ApiResponse.success(res, "Client deleted successfully", null, 200);
});

export const getMe = asyncHandler(async (req, res) => {
  const client = await clientService.getClientByUserId(req.user.id);
  return ApiResponse.success(res, "Client profile retrieved successfully", client, 200);
});

export const updateMe = asyncHandler(async (req, res) => {
  const client = await clientService.updateClientByUserId(req.user.id, req.validatedData);
  return ApiResponse.success(res, "Client profile updated successfully", client, 200);
});

