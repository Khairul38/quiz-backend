"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSingleQuizFromDB = exports.updateSingleQuizToDB = exports.getSingleQuizFromDB = exports.getAllQuizFromDB = exports.createQuizToDB = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = require("../../../shared/prisma");
const quiz_constant_1 = require("./quiz.constant");
const createQuizToDB = (user, quizData) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryId, mark, multiChoice, question, timeTaken, quizAnswers } = quizData;
    const newQuiz = yield prisma_1.prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield transactionClient.quiz.create({
            data: {
                creatorId: user === null || user === void 0 ? void 0 : user.id,
                categoryId,
                mark,
                multiChoice,
                question,
                timeTaken,
            },
        });
        if (!result) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Unable to create quiz");
        }
        yield transactionClient.quizAnswer.createMany({
            data: quizAnswers.map(ob => ({
                quizId: result.id,
                answer: ob.answer,
                explanation: ob.explanation,
                istrue: ob.istrue,
            })),
        });
        return result;
    }));
    if (newQuiz) {
        const responseData = yield prisma_1.prisma.quiz.findUnique({
            where: {
                id: newQuiz.id,
            },
            include: {
                quizAnswers: true,
            },
        });
        return responseData;
    }
    else {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Failed to create quiz!");
    }
});
exports.createQuizToDB = createQuizToDB;
const getAllQuizFromDB = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, size, skip, sortBy, sortOrder } = (0, paginationHelper_1.calculatePagination)(paginationOptions);
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const andCondition = [];
    if (searchTerm) {
        andCondition.push({
            OR: quiz_constant_1.quizSearchableFields.map(field => ({
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
                    equals: filtersData[key],
                },
            })),
        });
    }
    const whereCondition = andCondition.length > 0 ? { AND: andCondition } : {};
    const result = yield prisma_1.prisma.quiz.findMany({
        where: whereCondition,
        include: {
            quizAnswers: true,
        },
        skip,
        take: size,
        orderBy: sortBy && sortOrder
            ? {
                [sortBy]: sortOrder,
            }
            : { createdAt: "desc" },
    });
    const total = yield prisma_1.prisma.quiz.count();
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
});
exports.getAllQuizFromDB = getAllQuizFromDB;
const getSingleQuizFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.quiz.findUnique({
        where: {
            id,
        },
        include: {
            quizAnswers: true,
            category: true,
        },
    });
    if (result) {
        return result;
    }
    else {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "There is no quiz with the id/Failed to fetched quiz");
    }
});
exports.getSingleQuizFromDB = getSingleQuizFromDB;
const updateSingleQuizToDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { quizAnswers } = payload, quizData = __rest(payload, ["quizAnswers"]);
    if (payload.categoryId) {
        const isExist = yield prisma_1.prisma.category.findUnique({
            where: {
                id: payload.categoryId,
            },
        });
        if (!isExist) {
            throw new ApiError_1.default(http_status_1.default.CONFLICT, "There is no category with this category Id. Please provide a valid category Id.");
        }
    }
    const updateQuiz = yield prisma_1.prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const result1 = yield transactionClient.quiz.update({
            where: {
                id,
            },
            data: quizData,
        });
        if (!result1) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Unable to update quiz");
        }
        const result2 = yield transactionClient.quizAnswer.deleteMany({
            where: {
                quizId: id,
            },
        });
        if (!result2) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Unable to update quiz");
        }
        yield transactionClient.quizAnswer.createMany({
            data: quizAnswers.map(ob => ({
                quizId: result1.id,
                answer: ob.answer,
                explanation: ob.explanation,
                istrue: ob.istrue,
            })),
        });
        return result1;
    }));
    if (updateQuiz) {
        const responseData = yield prisma_1.prisma.quiz.findUnique({
            where: {
                id: updateQuiz.id,
            },
            include: {
                quizAnswers: true,
            },
        });
        return responseData;
    }
    else {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "There is no quiz with the id/Failed to update quiz");
    }
});
exports.updateSingleQuizToDB = updateSingleQuizToDB;
const deleteSingleQuizFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deleteQuiz = yield prisma_1.prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const result1 = yield transactionClient.quizAnswer.deleteMany({
            where: {
                quizId: id,
            },
        });
        if (!result1) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Unable to delete quiz");
        }
        const result2 = yield transactionClient.quiz.delete({
            where: {
                id,
            },
        });
        return result2;
    }));
    if (deleteQuiz) {
        return deleteQuiz;
    }
    else {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "There is no quiz with the id/Failed to delete quiz");
    }
});
exports.deleteSingleQuizFromDB = deleteSingleQuizFromDB;
