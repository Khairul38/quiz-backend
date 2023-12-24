import { Quiz } from "@prisma/client";
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import {
  createQuizToDB,
  getAllQuizFromDB,
  getSingleQuizFromDB,
  updateSingleQuizToDB,
  deleteSingleQuizFromDB,
} from "./quiz.service";
import pick from "../../../shared/pick";
import { quizFilterableFields } from "./quiz.constant";
import { paginationFields } from "../../../constants/pagination";

export const createQuiz = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const result = await createQuizToDB(user, req.body);

  sendResponse<Quiz>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Quiz created successfully",
    data: result,
  });
});

export const getAllQuiz = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, quizFilterableFields);
  const pagination = pick(req.query, paginationFields);

  const result = await getAllQuizFromDB(filters, pagination);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Quizs retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const getSingleQuiz = catchAsync(async (req: Request, res: Response) => {
  const result = await getSingleQuizFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Single quiz fetched successfully",
    data: result,
  });
});

export const updateSingleQuiz = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;
    const result = await updateSingleQuizToDB(id, payload);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Quiz updated successfully",
      data: result,
    });
  }
);

export const deleteSingleQuiz = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await deleteSingleQuizFromDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Quiz deleted successfully",
      data: result,
    });
  }
);
