import prisma from "../../config/prisma.js";
import AppError from "../../shared/errors/app-error.js";

export const createReview = async (userId, data) => {
  // First, find the Client profile of the reviewer
  const client = await prisma.client.findUnique({
    where: { userId: userId }
  });

  if (!client) {
    throw new AppError("Only clients can write reviews", 403);
  }

  // Ensure they are not reviewing multiple targets
  if (!data.targetWorkerId && !data.targetAgencyId) {
    throw new AppError("Must specify a target worker or agency to review", 400);
  }

  // Verify the assignment exists and is completed
  if (data.assignmentId) {
    const assignment = await prisma.assignment.findUnique({
      where: { id: data.assignmentId }
    });
    if (!assignment || assignment.status !== "COMPLETED") {
      throw new AppError("Can only review completed assignments", 400);
    }
    if (assignment.clientId !== client.id) {
      throw new AppError("Not authorized to review this assignment", 403);
    }
  }

  const review = await prisma.review.create({
    data: {
      reviewerId: client.id,
      targetWorkerId: data.targetWorkerId || undefined,
      targetAgencyId: data.targetAgencyId || undefined,
      assignmentId: data.assignmentId || undefined,
      rating: data.rating,
      comment: data.comment,
    }
  });

  return review;
};

export const getReviews = async (filters) => {
  const where = {};
  
  if (filters.targetWorkerId) where.targetWorkerId = filters.targetWorkerId;
  if (filters.targetAgencyId) where.targetAgencyId = filters.targetAgencyId;
  if (filters.assignmentId) where.assignmentId = filters.assignmentId;
  if (filters.reviewerId) where.reviewerId = filters.reviewerId;

  return await prisma.review.findMany({
    where,
    include: {
      reviewer: {
        include: { user: { select: { firstName: true, lastName: true, avatar: true } } }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};
