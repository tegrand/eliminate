import prisma from "../../config/prisma.js";
import { getIO } from "../../config/socket.js";

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
  const notification = await prisma.notification.create({
    data: {
      userId,
      type,
      title,
      message,
      link
    }
  });

  try {
    const io = getIO();
    io.to(userId).emit("new_notification", notification);
  } catch (err) {
    console.error("Socket.io not initialized, failed to emit notification", err);
  }

  return notification;
};
