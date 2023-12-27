/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma, User } from "@prisma/client";
import bcrypt from "bcrypt";
import httpStatus from "http-status";
import config from "../../../config";
import ApiError from "../../../errors/ApiError";
import { calculatePagination } from "../../../helpers/paginationHelper";
import { prismaExclude } from "../../../helpers/prismaExcludeHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { prisma } from "../../../shared/prisma";
import { userSearchableFields } from "./user.constant";
import { IUserFilters } from "./user.interface";

export const getAllUserFromDB = async (
  filters: IUserFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Partial<User>[]>> => {
  const { page, size, skip, sortBy, sortOrder } =
    calculatePagination(paginationOptions);
  const { searchTerm, ...filtersData } = filters;

  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      OR: userSearchableFields.map(field => ({
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

  const whereCondition: Prisma.UserWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.user.findMany({
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

  const resultWithoutPassword = result.map(r =>
    prismaExclude<User, "password">(r, ["password"])
  );

  const total = await prisma.user.count();

  return {
    meta: {
      total,
      page,
      size,
    },
    data: resultWithoutPassword,
  };
};

export const getSingleUserFromDB = async (
  id: string
): Promise<Partial<User> | null> => {
  const result = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (result) {
    const userWithoutPassword = prismaExclude<User, "password">(result, [
      "password",
    ]);
    return userWithoutPassword;
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, "There is no user with the id");
  }
};

export const updateSingleUserToDB = async (
  id: string,
  payload: Partial<User>
): Promise<Partial<User> | null> => {
  if (payload.email) {
    const isExist = await prisma.user.findUnique({
      where: {
        email: payload.email,
      },
    });
    if (isExist && isExist.id === id) {
      throw new ApiError(
        httpStatus.CONFLICT,
        "Another user already exists with this email. Please provide a new email."
      );
    }
  }

  // hash password before update
  if (payload.password) {
    payload.password = await bcrypt.hash(
      payload.password,
      Number(config.bcrypt_salt_rounds)
    );
  }

  const result = await prisma.user.update({
    where: {
      id,
    },
    data: payload,
  });

  if (result) {
    const userWithoutPassword = prismaExclude<User, "password">(result, [
      "password",
    ]);
    return userWithoutPassword;
  } else {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "There is no user with the id/Failed to update user"
    );
  }
};

export const deleteSingleUserFromDB = async (
  id: string
): Promise<Partial<User> | undefined> => {
  const result = await prisma.user.delete({
    where: {
      id,
    },
  });
  if (result) {
    const userWithoutPassword = prismaExclude<User, "password">(result, [
      "password",
    ]);
    return userWithoutPassword;
  }
};
