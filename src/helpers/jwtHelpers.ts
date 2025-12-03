import jwt, { JwtPayload, Secret } from "jsonwebtoken";

export const createToken = (
  payload: Record<string, unknown>,
  secret: Secret,
  expireTime: string
): string => {
  return jwt.sign(payload, secret, {
    expiresIn: expireTime as jwt.SignOptions["expiresIn"],
  });
};

export const verifyToken = (token: string, secret: Secret): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};
