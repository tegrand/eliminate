import AppError from "../shared/errors/app-error.js";
import prisma from "../config/prisma.js";
import { verifyAccessToken } from "../modules/auth/auth.utils.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Unauthorized", 401);
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new AppError("Unauthorized", 401);
    }

    const payload = verifyAccessToken(token);
    if (!payload || !payload.sub) {
      throw new AppError("Unauthorized", 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        role: true,
      },
    });

    if (!user) {
      throw new AppError("Unauthorized", 401);
    }

    if (user.status !== "ACTIVE") {
      throw new AppError("Unauthorized", 401);
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
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;
