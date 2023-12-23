import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { getUserProfileFromDB } from "./profile.service";

export const getUserProfile = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;
    const result = await getUserProfileFromDB(user);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User profile retrieved successfully",
      data: result,
    });
  }
);
