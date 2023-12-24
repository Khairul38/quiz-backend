import { Category } from "@prisma/client";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { paginationFields } from "../../../constants/pagination";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { categoryFilterableFields } from "./category.constant";
import {
  createCategoryToDB,
  deleteSingleCategoryFromDB,
  getAllCategoryFromDB,
  getSingleCategoryFromDB,
  updateSingleCategoryToDB,
} from "./category.service";

export const createCategory = catchAsync(
  async (req: Request, res: Response) => {
    const result = await createCategoryToDB(req.body);

    sendResponse<Category>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Category created successfully",
      data: result,
    });
  }
);

export const getAllCategory = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, categoryFilterableFields);
    const pagination = pick(req.query, paginationFields);

    const result = await getAllCategoryFromDB(filters, pagination);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All category fetched successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

export const getSingleCategory = catchAsync(
  async (req: Request, res: Response) => {
    const result = await getSingleCategoryFromDB(req.params.id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Single category fetched successfully",
      data: result,
    });
  }
);

export const updateSingleCategory = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;
    const result = await updateSingleCategoryToDB(id, payload);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Category updated successfully",
      data: result,
    });
  }
);

export const deleteSingleCategory = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await deleteSingleCategoryFromDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Category deleted successfully",
      data: result,
    });
  }
);
