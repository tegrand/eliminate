import prisma from "../../config/prisma.js";

// Helper to calculate expiresAt
const calculateExpiresAt = async (adPackageId) => {
  if (!adPackageId) return null;
  const pkg = await prisma.adPackage.findUnique({ where: { id: adPackageId } });
  if (pkg && pkg.durationDays) {
    const expires = new Date();
    expires.setDate(expires.getDate() + pkg.durationDays);
    return expires;
  }
  return null;
};

// Get all active ads sorted by order (for clients)
export const getActiveAds = async () => {
  return prisma.advertisement.findMany({
    where: { 
      isActive: true,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } }
      ]
    },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    include: { adPackage: true }
  });
};

// Get all ads (for admin)
export const getAllAds = async () => {
  return prisma.advertisement.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    include: { adPackage: true }
  });
};

// Create ad
export const createAd = async (data) => {
  if (data.adPackageId) {
    data.expiresAt = await calculateExpiresAt(data.adPackageId);
  }
  return prisma.advertisement.create({ data, include: { adPackage: true } });
};

// Update ad
export const updateAd = async (id, data) => {
  if (data.adPackageId !== undefined) {
    data.expiresAt = await calculateExpiresAt(data.adPackageId);
  }
  return prisma.advertisement.update({ where: { id }, data, include: { adPackage: true } });
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

// Get all Ad Packages
export const getAdPackages = async () => {
  return prisma.adPackage.findMany({
    orderBy: { createdAt: "desc" }
  });
};

// Create Ad Package
export const createAdPackage = async (data) => {
  return prisma.adPackage.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      durationDays: data.durationDays
    }
  });
};

// Update Ad Package
export const updateAdPackage = async (id, data) => {
  return prisma.adPackage.update({
    where: { id },
    data
  });
};

// Delete Ad Package
export const deleteAdPackage = async (id) => {
  return prisma.adPackage.delete({
    where: { id }
  });
};
