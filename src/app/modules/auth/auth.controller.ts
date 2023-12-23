import { User } from "@prisma/client";
import { Request, Response } from "express";
import httpStatus from "http-status";
import config from "../../../config";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { IRefreshTokenResponse } from "./auth.interface";
import {
  createUserToDB,
  loginUserFromDB,
  refreshTokenUserFromDB,
} from "./auth.service";

export const createUser = catchAsync(async (req: Request, res: Response) => {
  const { ...user } = req.body;

  const result = await createUserToDB(user);

  sendResponse<Partial<User>>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User signup successfully",
    data: result,
  });
});

export const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;
  const result = await loginUserFromDB(loginData);
  const { refreshToken, accessToken } = result;

  // set refresh token into cookie
  const cookieOptions = {
    secure: config.env === "production",
    httpOnly: true,
  };

  res.cookie("refreshToken", refreshToken, cookieOptions);

  sendResponse<string>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User signin successfully !",
    token: accessToken,
  });
});

export const refreshTokenUser = catchAsync(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;

    const result = await refreshTokenUserFromDB(refreshToken);

    // set refresh token into cookie
    const cookieOptions = {
      secure: config.env === "production",
      httpOnly: true,
    };

    res.cookie("refreshToken", refreshToken, cookieOptions);

    sendResponse<IRefreshTokenResponse>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "New user access token generated successfully !",
      data: result,
    });
  }
);
