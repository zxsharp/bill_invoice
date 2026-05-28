import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export const signAccess = (userId: string) => {
  return jwt.sign({ userId }, env.JWT_ACCESS_SECRET, { expiresIn: env.JWT_ACCESS_EXPIRES_IN as any });
};

export const signRefresh = (userId: string) => {
  return jwt.sign({ userId }, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN as any });
};

export const verifyAccess = (token: string) => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as { userId: string };
};

export const verifyRefresh = (token: string) => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as { userId: string };
};
