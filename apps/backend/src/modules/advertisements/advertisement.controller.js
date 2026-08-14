import asyncHandler from "../../shared/helpers/async-handler.js";
import ApiResponse from "../../shared/responses/api-response.js";
import * as adService from "./advertisement.service.js";

// GET /advertisements — active ads for authenticated users (clients, workers, etc.)
export const getActiveAds = asyncHandler(async (req, res) => {
  const ads = await adService.getActiveAds();
  return ApiResponse.success(res, "Active advertisements retrieved", ads, 200);
});

// GET /advertisements/admin — all ads for super admin
export const getAllAds = asyncHandler(async (req, res) => {
  const ads = await adService.getAllAds();
  return ApiResponse.success(res, "All advertisements retrieved", ads, 200);
});

// POST /advertisements — create ad (super admin only)
export const createAd = asyncHandler(async (req, res) => {
  const { title, description, imageUrl, linkUrl, buttonText, isActive, order } = req.body;
  if (!title || !title.trim()) {
    return ApiResponse.error(res, "Title is required", 400);
  }
  const ad = await adService.createAd({
    title: title.trim(),
    description: description?.trim() || null,
    imageUrl: imageUrl?.trim() || null,
    linkUrl: linkUrl?.trim() || null,
    buttonText: buttonText?.trim() || "Learn More",
    isActive: isActive !== undefined ? Boolean(isActive) : true,
    order: order !== undefined ? parseInt(order) : 0,
  });
  return ApiResponse.success(res, "Advertisement created", ad, 201);
});

// PUT /advertisements/:id — update ad (super admin only)
export const updateAd = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, imageUrl, linkUrl, buttonText, isActive, order } = req.body;
  const data = {};
  if (title !== undefined) data.title = title.trim();
  if (description !== undefined) data.description = description?.trim() || null;
  if (imageUrl !== undefined) data.imageUrl = imageUrl?.trim() || null;
  if (linkUrl !== undefined) data.linkUrl = linkUrl?.trim() || null;
  if (buttonText !== undefined) data.buttonText = buttonText?.trim() || "Learn More";
  if (isActive !== undefined) data.isActive = Boolean(isActive);
  if (order !== undefined) data.order = parseInt(order);
  const ad = await adService.updateAd(id, data);
  return ApiResponse.success(res, "Advertisement updated", ad, 200);
});

// PATCH /advertisements/:id/toggle — toggle isActive (super admin only)
export const toggleAd = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const ad = await adService.toggleAd(id);
  return ApiResponse.success(res, `Advertisement ${ad.isActive ? "activated" : "deactivated"}`, ad, 200);
});

// DELETE /advertisements/:id — delete ad (super admin only)
export const deleteAd = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await adService.deleteAd(id);
  return ApiResponse.success(res, "Advertisement deleted", null, 200);
});
