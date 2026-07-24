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
