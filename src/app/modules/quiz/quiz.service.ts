/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma, Quiz } from "@prisma/client";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import ApiError from "../../../errors/ApiError";
import { calculatePagination } from "../../../helpers/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { prisma } from "../../../shared/prisma";
import { quizSearchableFields } from "./quiz.constant";
import { ICreateQuiz, IQuizFilters } from "./quiz.interface";

export const createQuizToDB = async (
  user: JwtPayload | null,
  quizData: ICreateQuiz
): Promise<any> => {
  const {
    creatorId,
    categoryId,
    mark,
    multiChoice,
    question,
    timeTaken,
    quizAnswers,
  } = quizData;

  const newQuiz = await prisma.$transaction(async transactionClient => {
    const result = await transactionClient.quiz.create({
      data: {
        creatorId,
        categoryId,
        mark,
        multiChoice,
        question,
        timeTaken,
      },
    });

    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Unable to create quiz");
    }

    await transactionClient.quizAnswer.createMany({
      data: quizAnswers.map(ob => ({
        quizId: result.id,
        answer: ob.answer,
        explanation: ob.explanation,
        istrue: ob.istrue,
      })),
    });

    return result;
  });

  if (newQuiz) {
    const responseData = await prisma.quiz.findUnique({
      where: {
        id: newQuiz.id,
      },
      include: {
        quizAnswers: true,
      },
    });
    return responseData;
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create quiz!");
  }
};

export const getAllQuizFromDB = async (
  filters: IQuizFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Quiz[]>> => {
  const { page, size, skip, sortBy, sortOrder } =
    calculatePagination(paginationOptions);
  const { searchTerm, ...filtersData } = filters;

  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      OR: quizSearchableFields.map(field => ({
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

  const whereCondition: Prisma.QuizWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.quiz.findMany({
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
  const total = await prisma.quiz.count();
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

export const getSingleQuizFromDB = async (id: string): Promise<Quiz | null> => {
  const result = await prisma.quiz.findUnique({
    where: {
      id,
    },
    include: {
      quizAnswers: true,
    },
  });

  if (result) {
    return result;
  } else {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "There is no quiz with the id/Failed to fetched quiz"
    );
  }
};

export const updateSingleQuizToDB = async (
  id: string,
  payload: ICreateQuiz
): Promise<Partial<ICreateQuiz> | null> => {
  const {
    creatorId,
    categoryId,
    mark,
    multiChoice,
    question,
    timeTaken,
    quizAnswers,
  } = payload;

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

  const updateQuiz = await prisma.$transaction(async transactionClient => {
    const result = await transactionClient.quiz.update({
      where: {
        id,
      },
      data: {
        creatorId,
        categoryId,
        mark,
        multiChoice,
        question,
        timeTaken,
      },
    });

    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Unable to update quiz");
    }

    await transactionClient.quizAnswer.updateMany({
      where: {
        id,
      },
      data: quizAnswers.map(ob => ({
        quizId: id,
        answer: ob.answer,
        explanation: ob.explanation,
        istrue: ob.istrue,
      })),
    });

    return result;
  });

  if (updateQuiz) {
    const responseData = await prisma.quiz.findUnique({
      where: {
        id: updateQuiz.id,
      },
      include: {
        quizAnswers: true,
      },
    });
    return responseData;
  } else {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "There is no quiz with the id/Failed to update quiz"
    );
  }
};

export const deleteSingleQuizFromDB = async (
  id: string
): Promise<Partial<Quiz> | undefined> => {
  const deleteQuiz = await prisma.$transaction(async transactionClient => {
    const result1 = await transactionClient.quizAnswer.deleteMany({
      where: {
        id,
      },
    });

    if (!result1) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Unable to delete quiz");
    }
    const result2 = await transactionClient.quiz.delete({
      where: {
        id,
      },
    });

    return result2;
  });

  if (deleteQuiz) {
    return deleteQuiz;
  } else {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "There is no quiz with the id/Failed to delete quiz"
    );
  }
};
