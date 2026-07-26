import prisma from "../config/prisma.js";
import AppError from "../shared/errors/app-error.js";
import asyncHandler from "../shared/helpers/async-handler.js";
import { verifyAccessToken } from "../modules/auth/auth.utils.js";

const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Unauthorized", 401);
  }

  const token = authHeader.split(" ")[1];
  const payload = verifyAccessToken(token);

  if (!payload || !payload.sub) {
    throw new AppError("Unauthorized", 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    include: { role: true },
  });

  if (!user) {
    throw new AppError("Unauthorized", 401);
  }

  if (user.profileType === "WORKER" || user.profileType === "AGENCY") {
    if (user.status !== "ACTIVE" && user.status !== "PENDING") {
      throw new AppError("Unauthorized", 401);
    }
  } else {
    if (user.status !== "ACTIVE") {
      throw new AppError("Unauthorized", 401);
    }
  }

  req.user = {
    id: user.id,
    email: user.email,
    profileType: user.profileType,
    role: {
      id: user.role.id,
      name: user.role.name,
    },
  };

  next();
});

export default authenticate;
