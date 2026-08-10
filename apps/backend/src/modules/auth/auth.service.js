import bcrypt from "bcrypt";
import crypto from "crypto";

import prisma from "../../config/prisma.js";
import authConfig from "../../config/auth.config.js";
import AppError from "../../shared/errors/app-error.js";
import { generateAccessToken, generateRefreshToken, parseExpToMs, verifyRefreshToken } from "./auth.utils.js";

const issueTokensAndUpdateUser = async (user, meta, action = "LOGIN") => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const refreshTokenHash = await bcrypt.hash(refreshToken, authConfig.bcryptRounds);
  const refreshTokenExpiresAt = new Date(Date.now() + parseExpToMs(authConfig.refreshExpiresIn));

  const [updatedUser] = await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: {
        refreshTokenHash,
        refreshTokenExpiresAt,
        lastLoginAt: new Date(),
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        status: true,
        profileType: true,
        emailVerified: true,
        emailVerifiedAt: true,
        lastLoginAt: true,
        role: {
          select: {
            id: true,
            name: true,
            displayName: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.authAuditLog.create({
      data: {
        userId: user.id,
        action,
        ipAddress: meta?.ipAddress,
        userAgent: meta?.userAgent,
      },
    }),
  ]);

  let userWithProfile = { ...updatedUser };

  // If user is a CLIENT, attach clientProfile so the frontend can show "My Profile" vs "Company Profile"
  if (updatedUser.profileType === "CLIENT") {
    const clientProfile = await prisma.client.findUnique({
      where: { userId: updatedUser.id },
      select: { contactPerson: true },
    });
    if (clientProfile) {
      userWithProfile.clientProfile = clientProfile;
    }
  } else if (updatedUser.profileType === "WORKER") {
    const workerProfile = await prisma.worker.findUnique({
      where: { userId: updatedUser.id },
      select: { id: true, profileStatus: true },
    });
    if (workerProfile) {
      userWithProfile.workerProfile = workerProfile;
    }
  } else if (updatedUser.profileType === "AGENCY") {
    const agencyProfile = await prisma.agency.findUnique({
      where: { userId: updatedUser.id },
      select: { id: true, profileStatus: true, agencyName: true },
    });
    if (agencyProfile) {
      userWithProfile.agencyProfile = agencyProfile;
    }
  }

  return { accessToken, refreshToken, user: userWithProfile };
};

export const register = async (data) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new AppError("Email already exists", 409);
  }

  let role = await prisma.role.findUnique({
    where: { name: data.accountType },
  });

  if (!role) {
    const displayName = data.accountType.charAt(0).toUpperCase() + data.accountType.slice(1).toLowerCase();
    role = await prisma.role.create({
      data: {
        name: data.accountType,
        displayName: displayName,
        description: `System role for ${displayName}`,
        isSystem: true,
        isActive: true,
      }
    });
  }

  const passwordHash = await bcrypt.hash(data.password, authConfig.bcryptRounds);

  const firstName = data.fullName ? data.fullName.split(' ')[0] : data.ownerName ? data.ownerName.split(' ')[0] : data.contactPerson ? data.contactPerson.split(' ')[0] : null;
  const lastName = data.fullName ? data.fullName.split(' ').slice(1).join(' ') || null : data.ownerName ? data.ownerName.split(' ').slice(1).join(' ') || null : data.contactPerson ? data.contactPerson.split(' ').slice(1).join(' ') || null : null;

  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      firstName,
      lastName,
      phone: data.phone || null,
      profileType: data.accountType,
      status: data.accountType === "CLIENT" ? "ACTIVE" : "PENDING",
      roleId: role.id,
      worker: data.accountType === "WORKER" ? {
        create: {
          workerCode: `WRK-${crypto.randomBytes(4).toString("hex").toUpperCase()}`,
          firstName,
          lastName,
          phone: data.phone || null,
          gender: data.gender || null,
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
          expectedDailyWage: data.expectedDailyWage || null,
          jobType: data.jobType || null,
          totalExperienceYears: data.experience ? Number(data.experience) : null,
          addressLine1: data.addressLine1 || null,
          district: data.district || null,
          state: data.state || null,
          city: data.city || null,
          travelDistance: data.travelDistance ? Number(data.travelDistance) : null,
          notes: data.primarySkill ? `Primary Skill: ${data.primarySkill}` : null,
        }
      } : undefined,
      agency: data.accountType === "AGENCY" ? {
        create: {
          agencyCode: `AGC-${crypto.randomBytes(4).toString("hex").toUpperCase()}`,
          agencyName: data.agencyName || null,
          contactPerson: data.ownerName || null,
          phone: data.phone || null,
          email: data.email || null,
          addressLine1: data.addressLine1 || null,
          state: data.state || null,
          postalCode: data.pincode || null,
        }
      } : undefined,
      client: data.accountType === "CLIENT" ? {
        create: {
          clientCode: `CLI-${crypto.randomBytes(4).toString("hex").toUpperCase()}`,
          contactPerson: data.contactPerson || null,
          phone: data.phone || null,
          email: data.email || null,
        }
      } : undefined
    },
    select: {
      id: true,
      email: true,
      profileType: true,
      status: true,
      createdAt: true,
      worker: { select: { id: true } }
    },
  });

  if (data.accountType === "WORKER" && user.worker) {
    if (data.skill) {
      const slug = data.skill.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const skillRecord = await prisma.skill.upsert({
        where: { slug },
        update: {},
        create: { name: data.skill, slug },
      });
      await prisma.workerSkill.create({
        data: {
          workerId: user.worker.id,
          skillId: skillRecord.id,
          proficiencyLevel: "INTERMEDIATE",
          isPrimary: true,
          experienceYears: data.experience ? Number(data.experience) : null,
        }
      });
    }
    if (data.language) {
      const code = data.language.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const langRecord = await prisma.language.upsert({
        where: { code },
        update: {},
        create: { name: data.language, code },
      });
      await prisma.workerLanguage.create({
        data: {
          workerId: user.worker.id,
          languageId: langRecord.id,
          proficiencyLevel: "CONVERSATIONAL",
          isPrimary: true,
          canSpeak: true,
        }
      });
    }
  }

  return user;
};

export const login = async (data, meta) => {
  const normalizedEmail = data.email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: {
      id: true,
      passwordHash: true,
      status: true,
      profileType: true,
      failedLoginAttempts: true,
      lockedUntil: true,
      role: {
        select: {
          id: true,
          name: true,
          displayName: true,
        },
      },
    },
  });

  if (!user) {
    await bcrypt.compare(data.password, "$2b$10$dummyHashThatIs60CharsLong12345678901234567890123456789");
    throw new AppError("Invalid email or password", 401);
  }

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    throw new AppError(`Account is locked until ${user.lockedUntil.toISOString()}`, 403);
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);
  if (!isPasswordValid) {
    const failedAttempts = user.failedLoginAttempts + 1;
    const isLocked = failedAttempts >= 5;

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: failedAttempts,
          lockedUntil: isLocked ? new Date(Date.now() + 15 * 60 * 1000) : null,
        },
      }),
      prisma.authAuditLog.create({
        data: {
          userId: user.id,
          action: isLocked ? "ACCOUNT_LOCK" : "FAILED_LOGIN",
          ipAddress: meta?.ipAddress,
          userAgent: meta?.userAgent,
        },
      }),
    ]);

    throw new AppError("Invalid email or password", 401);
  }

  if (user.profileType === "WORKER" || user.profileType === "AGENCY") {
    switch (user.status) {
      case "SUSPENDED":
        throw new AppError("Your account has been suspended.", 403);
      case "REJECTED":
        throw new AppError("Your account has been rejected.", 403);
      case "DELETED":
        throw new AppError("Account not available.", 403);
      case "PENDING":
      case "ACTIVE":
        break;
      default:
        throw new AppError("Invalid account status.", 403);
    }
  } else {
    switch (user.status) {
      case "PENDING":
        throw new AppError("Your account is pending approval.", 403);
      case "SUSPENDED":
        throw new AppError("Your account has been suspended.", 403);
      case "REJECTED":
        throw new AppError("Your account has been rejected.", 403);
      case "DELETED":
        throw new AppError("Account not available.", 403);
      case "ACTIVE":
        break;
      default:
        throw new AppError("Invalid account status.", 403);
    }
  }

  return issueTokensAndUpdateUser(user, meta, "LOGIN");
};

export const refreshToken = async (token, meta) => {
  const payload = verifyRefreshToken(token);
  if (!payload || !payload.sub) {
    throw new AppError("Unauthorized", 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: {
      id: true,
      refreshTokenHash: true,
      refreshTokenExpiresAt: true,
      status: true,
      profileType: true,
      role: {
        select: {
          id: true,
          name: true,
          displayName: true,
        },
      },
    },
  });

  if (!user || !user.refreshTokenHash) {
    throw new AppError("Unauthorized", 401);
  }

  const isValid = await bcrypt.compare(token, user.refreshTokenHash);
  if (!isValid) {
    throw new AppError("Unauthorized", 401);
  }

  if (user.refreshTokenExpiresAt && user.refreshTokenExpiresAt < new Date()) {
    throw new AppError("Unauthorized", 401);
  }

  return issueTokensAndUpdateUser(user, meta, "REFRESH");
};

export const logout = async (token, meta) => {
  if (!token) return;

  const payload = verifyRefreshToken(token);
  if (!payload || !payload.sub) return;

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: { id: true },
  });

  if (user) {
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          refreshTokenHash: null,
          refreshTokenExpiresAt: null,
        },
      }),
      prisma.authAuditLog.create({
        data: {
          userId: user.id,
          action: "LOGOUT",
          ipAddress: meta?.ipAddress,
          userAgent: meta?.userAgent,
        },
      }),
    ]);
  }
};

export const getCurrentUser = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      avatar: true,
      status: true,
      profileType: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
      role: {
        select: {
          id: true,
          name: true,
          displayName: true,
        },
      },
    },
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

  let userWithProfile = { ...user };
  if (user.profileType === "CLIENT") {
    const clientProfile = await prisma.client.findUnique({
      where: { userId: user.id },
      select: { contactPerson: true },
    });
    if (clientProfile) {
      userWithProfile.clientProfile = clientProfile;
    }
  } else if (user.profileType === "WORKER") {
    const workerProfile = await prisma.worker.findUnique({
      where: { userId: user.id },
      select: { id: true, profileStatus: true },
    });
    if (workerProfile) {
      userWithProfile.workerProfile = workerProfile;
    }
  } else if (user.profileType === "AGENCY") {
    const agencyProfile = await prisma.agency.findUnique({
      where: { userId: user.id },
      select: { id: true, profileStatus: true, agencyName: true },
    });
    if (agencyProfile) {
      userWithProfile.agencyProfile = agencyProfile;
    }
  }

  return userWithProfile;
};

export const changePassword = async (userId, data, meta) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, passwordHash: true },
  });

  if (!user) {
    throw new AppError("Unauthorized", 401);
  }

  const isPasswordValid = await bcrypt.compare(data.currentPassword, user.passwordHash);
  if (!isPasswordValid) {
    throw new AppError("Unauthorized", 401);
  }

  const isSamePassword = await bcrypt.compare(data.newPassword, user.passwordHash);
  if (isSamePassword) {
    throw new AppError("New password cannot be the same as current password", 400);
  }

  const passwordHash = await bcrypt.hash(data.newPassword, authConfig.bcryptRounds);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        refreshTokenHash: null,
        refreshTokenExpiresAt: null,
      },
    }),
    prisma.authAuditLog.create({
      data: {
        userId: user.id,
        action: "PASSWORD_CHANGE",
        ipAddress: meta?.ipAddress,
        userAgent: meta?.userAgent,
      },
    }),
  ]);
};

export const forgotPassword = async (data) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
    select: { id: true },
  });

  if (!user) return;

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
  const resetTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetTokenHash,
      resetTokenExpiresAt,
    },
  });
};

export const resetPassword = async (data) => {
  const resetTokenHash = crypto.createHash("sha256").update(data.token).digest("hex");

  const user = await prisma.user.findFirst({
    where: {
      resetTokenHash,
      resetTokenExpiresAt: {
        gt: new Date(),
      },
    },
    select: { id: true },
  });

  if (!user) {
    throw new AppError("Invalid or expired reset token", 400);
  }

  const passwordHash = await bcrypt.hash(data.newPassword, authConfig.bcryptRounds);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      resetTokenHash: null,
      resetTokenExpiresAt: null,
      refreshTokenHash: null,
      refreshTokenExpiresAt: null,
    },
  });
};

export const resendVerification = async (data) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
    select: { id: true, emailVerified: true },
  });

  if (!user || user.emailVerified) return;

  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationTokenHash = crypto.createHash("sha256").update(verificationToken).digest("hex");
  const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      verificationTokenHash,
      verificationTokenExpiresAt,
    },
  });
};

export const verifyEmail = async (data) => {
  const verificationTokenHash = crypto.createHash("sha256").update(data.token).digest("hex");

  const user = await prisma.user.findFirst({
    where: {
      verificationTokenHash,
      verificationTokenExpiresAt: {
        gt: new Date(),
      },
    },
    select: { id: true },
  });

  if (!user) {
    throw new AppError("Invalid or expired verification token", 400);
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: true,
      emailVerifiedAt: new Date(),
      verificationTokenHash: null,
      verificationTokenExpiresAt: null,
    },
  });
};

export const verifyPassword = async (userId, password) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError("User not found", 404);
  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) throw new AppError("Invalid password", 401);
  return true;
};
