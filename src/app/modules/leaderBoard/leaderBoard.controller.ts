import { LeaderBoard } from "@prisma/client";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { paginationFields } from "../../../constants/pagination";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import {
  createLeaderBoardToDB,
  deleteSingleLeaderBoardFromDB,
  getAllLeaderBoardFromDB,
  getSingleLeaderBoardFromDB,
  updateSingleLeaderBoardToDB,
} from "./leaderBoard.service";
import { leaderBoardFilterableFields } from "./leaderBoard.constant";

export const createLeaderBoard = catchAsync(
  async (req: Request, res: Response) => {
    const { ...leaderBoard } = req.body;

    const result = await createLeaderBoardToDB(leaderBoard);

    sendResponse<LeaderBoard>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "LeaderBoard created successfully",
      data: result,
    });
  }
);

export const getAllLeaderBoard = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, leaderBoardFilterableFields);
    const pagination = pick(req.query, paginationFields);

    const result = await getAllLeaderBoardFromDB(filters, pagination);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "LeaderBoards fetched successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

export const getSingleLeaderBoard = catchAsync(
  async (req: Request, res: Response) => {
    const result = await getSingleLeaderBoardFromDB(req.params.id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Single leaderBoard fetched successfully",
      data: result,
    });
  }
);

export const updateSingleLeaderBoard = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;
    const result = await updateSingleLeaderBoardToDB(id, payload);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "LeaderBoard updated successfully",
      data: result,
    });
  }
);

export const deleteSingleLeaderBoard = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await deleteSingleLeaderBoardFromDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "LeaderBoard deleted successfully",
      data: result,
    });
  }
);
