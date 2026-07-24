import AppError from "../shared/errors/app-error.js";
import asyncHandler from "../shared/helpers/async-handler.js";
import prisma from "../config/prisma.js";

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return next(new AppError("Forbidden", 403));
    }

    if (!roles.includes(req.user.role.name)) {
      return next(new AppError("Forbidden", 403));
    }

    next();
  };
};

export const requirePermission = (...permissions) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user || !req.user.id) {
      throw new AppError("Forbidden", 403);
    }

    const userRecord = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        role: {
          select: {
            permissions: {
              where: {
                permission: {
                  isActive: true,
                },
              },
              select: {
                permission: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!userRecord || !userRecord.role || !userRecord.role.permissions) {
      throw new AppError("Forbidden", 403);
    }

    const userPermissions = userRecord.role.permissions.map(
      (rp) => rp.permission.name
    );

    const hasPermission = permissions.some((permission) =>
      userPermissions.includes(permission)
    );

    if (!hasPermission) {
      throw new AppError("Forbidden", 403);
    }

    next();
  });
};
