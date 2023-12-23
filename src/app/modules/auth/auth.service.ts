import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";
import config from "../../../config";
import ApiError from "../../../errors/ApiError";
import { createToken, verifyToken } from "../../../helpers/jwtHelpers";
import { isPasswordMatched } from "../../../helpers/passwordMatchHelper";
import { prismaExclude } from "../../../helpers/prismaExcludeHelper";
import { prisma } from "../../../shared/prisma";
import {
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from "./auth.interface";

export const createUserToDB = async (
  userData: User
): Promise<Partial<User>> => {
  // hash password before create
  userData.password = await bcrypt.hash(
    userData.password,
    Number(config.bcrypt_salt_rounds)
  );

  const createdUser = await prisma.user.create({
    data: userData,
  });

  if (createdUser) {
    const userWithoutPassword = prismaExclude<User, "password">(createdUser, [
      "password",
    ]);
    return userWithoutPassword;
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create user!");
  }
};

export const loginUserFromDB = async (
  payload: ILoginUser
): Promise<ILoginUserResponse> => {
  const { email, password } = payload;

  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!isUserExist) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "User does not exist with this email"
    );
  }

  if (
    isUserExist.password &&
    !(await isPasswordMatched(password, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password is incorrect");
  }

  //create access token & refresh token
  const { id, role, name } = isUserExist;
  const accessToken = createToken(
    { id, role, email, name },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = createToken(
    { id, role, email, name },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const refreshTokenUserFromDB = async (
  token: string
): Promise<IRefreshTokenResponse> => {
  //verify token
  // invalid token - synchronous
  let verifiedToken = null;
  try {
    verifiedToken = verifyToken(token, config.jwt.refresh_secret as Secret);
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, "Invalid Refresh Token");
  }

  console.log(verifiedToken);

  const { email, name } = verifiedToken;

  // tumi delete hye gso  kintu tumar refresh token ase
  // checking deleted user's refresh token
  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
  }

  //generate new token
  const newAccessToken = createToken(
    {
      id: isUserExist.id,
      role: isUserExist.role,
      email,
      name,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};
