import prisma from "../../config/prisma.js";

// Get all active ads sorted by order (for clients)
export const getActiveAds = async () => {
  return prisma.advertisement.findMany({
    where: { isActive: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
};

// Get all ads (for admin)
export const getAllAds = async () => {
  return prisma.advertisement.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
};

// Create ad
export const createAd = async (data) => {
  return prisma.advertisement.create({ data });
};

// Update ad
export const updateAd = async (id, data) => {
  return prisma.advertisement.update({ where: { id }, data });
};

// Toggle isActive
export const toggleAd = async (id) => {
  const ad = await prisma.advertisement.findUnique({ where: { id } });
  if (!ad) throw new Error("Advertisement not found");
  return prisma.advertisement.update({
    where: { id },
    data: { isActive: !ad.isActive },
  });
};

// Delete ad
export const deleteAd = async (id) => {
  return prisma.advertisement.delete({ where: { id } });
};
