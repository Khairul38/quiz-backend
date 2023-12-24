/* eslint-disable @typescript-eslint/no-explicit-any */
import { LeaderBoard, Prisma } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { calculatePagination } from "../../../helpers/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { prisma } from "../../../shared/prisma";
import { ILeaderBoardFilters } from "./leaderBoard.interface";
import { leaderBoardSearchableFields } from "./leaderBoard.constant";

export const createLeaderBoardToDB = async (
  leaderBoardData: LeaderBoard
): Promise<LeaderBoard> => {
  const result = await prisma.leaderBoard.create({
    data: leaderBoardData,
    include: {
      user: true,
    },
  });

  return result;
};

export const getAllLeaderBoardFromDB = async (
  filters: ILeaderBoardFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<LeaderBoard[]>> => {
  const { page, size, skip, sortBy, sortOrder } =
    calculatePagination(paginationOptions);
  const { searchTerm, ...filtersData } = filters;

  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      OR: leaderBoardSearchableFields.map(field => ({
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

  const whereCondition: Prisma.LeaderBoardWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.leaderBoard.findMany({
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
  const total = await prisma.leaderBoard.count();
  const totalPage = Number(total) / Number(size);

  return {
    meta: {
      total,
      page,
      size,
      totalPage: Math.ceil(totalPage),
    },
    data: result,
  };
};

export const getSingleLeaderBoardFromDB = async (
  id: string
): Promise<LeaderBoard | null> => {
  const result = await prisma.leaderBoard.findUnique({
    where: {
      id,
    },
  });

  if (result) {
    return result;
  } else {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "There is no leaderBoard with the id/Failed to fetched leaderBoard"
    );
  }
};

export const updateSingleLeaderBoardToDB = async (
  id: string,
  payload: Partial<LeaderBoard>
): Promise<Partial<LeaderBoard> | null> => {
  if (payload.categoryId) {
    const isExist = await prisma.category.findUnique({
      where: {
        id: payload.categoryId,
      },
    });
    if (!isExist) {
      throw new ApiError(
        httpStatus.CONFLICT,
        "There is no category with this category Id. Please provide a valid category Id."
      );
    }
  }

  const result = await prisma.leaderBoard.update({
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
      "There is no leaderBoard with the id/Failed to update leaderBoard"
    );
  }
};

export const deleteSingleLeaderBoardFromDB = async (
  id: string
): Promise<Partial<LeaderBoard> | undefined> => {
  const result = await prisma.leaderBoard.delete({
    where: {
      id,
    },
  });

  if (result) {
    return result;
  } else {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "There is no leaderBoard with the id/Failed to delete leaderBoard"
    );
  }
};