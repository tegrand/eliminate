import prisma from "../../config/prisma.js";

export const getNotifications = async (userId) => {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50 // Limit to last 50 for now
  });
};

export const markAsRead = async (userId, notificationId) => {
  return prisma.notification.updateMany({
    where: { id: notificationId, userId },
    data: { isRead: true }
  });
};

export const markAllAsRead = async (userId) => {
  return prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true }
  });
};

// Internal utility to create notifications
export const createNotification = async (userId, type, title, message, link = null) => {
  return prisma.notification.create({
    data: {
      userId,
      type,
      title,
      message,
      link
    }
  });
};
