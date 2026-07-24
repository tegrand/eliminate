import jwt from "jsonwebtoken";

import authConfig from "../../config/auth.config.js";

export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role.name,
      profileType: user.profileType,
    },
    authConfig.accessSecret,
    {
      expiresIn: authConfig.accessExpiresIn,
    }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      sub: user.id,
    },
    authConfig.refreshSecret,
    {
      expiresIn: authConfig.refreshExpiresIn,
    }
  );
};

export const parseExpToMs = (expStr) => {
  if (!expStr) return 7 * 24 * 60 * 60 * 1000;
  const match = expStr.match(/^(\d+)(d|h|m|s)$/);
  if (!match) return 7 * 24 * 60 * 60 * 1000;
  const val = parseInt(match[1]);
  switch (match[2]) {
    case 'd': return val * 24 * 60 * 60 * 1000;
    case 'h': return val * 60 * 60 * 1000;
    case 'm': return val * 60 * 1000;
    case 's': return val * 1000;
    default: return 7 * 24 * 60 * 60 * 1000;
  }
};
