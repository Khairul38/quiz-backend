/* eslint-disable @typescript-eslint/no-explicit-any */
import { Category, Prisma } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { calculatePagination } from "../../../helpers/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { prisma } from "../../../shared/prisma";
import { categorySearchableFields } from "./category.constant";
import { ICategoryFilters } from "./category.interface";

export const createCategoryToDB = async (
  categoryData: Category
): Promise<Category> => {
  const result = await prisma.category.create({
    data: categoryData,
  });

  return result;
};

export const getAllCategoryFromDB = async (
  filters: ICategoryFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Category[]>> => {
  const { page, size, skip, sortBy, sortOrder } =
    calculatePagination(paginationOptions);
  const { searchTerm, ...filtersData } = filters;

  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      OR: categorySearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filtersData).length > 0) {
    andCondition.push({
      AND: Object.keys(filtersData).map(key => ({
        [key]: {
          equals: (filtersData as any)[key],
        },
      })),
    });
  }

  const whereCondition: Prisma.CategoryWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.category.findMany({
    where: whereCondition,
    skip,
    take: size,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : { createdAt: "desc" },
  });
  const total = await prisma.category.count();

  return {
    meta: {
      total,
      page,
      size,
    },
    data: result,
  };
};

export const getSingleCategoryFromDB = async (
  id: string
): Promise<Category | null> => {
  const result = await prisma.category.findUnique({
    where: {
      id,
    },
    include: {
      quizs: true,
    },
  });

  if (result) {
    return result;
  } else {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "There is no category with the id/Failed to fetched category"
    );
  }
};

export const updateSingleCategoryToDB = async (
  id: string,
  payload: Partial<Category>
): Promise<Partial<Category> | null> => {
  const result = await prisma.category.update({
    where: {
      id,
    },
    data: payload,
  });

  if (result) {
    return result;
  } else {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "There is no category with the id/Failed to update category"
    );
  }
};

export const deleteSingleCategoryFromDB = async (
  id: string
): Promise<Partial<Category> | undefined> => {
  const result = await prisma.category.delete({
    where: {
      id,
    },
  });

  if (result) {
    return result;
  } else {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "There is no category with the id/Failed to delete category"
    );
  }
};
