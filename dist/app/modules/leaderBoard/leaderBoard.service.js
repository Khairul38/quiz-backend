"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __rest =
  (this && this.__rest) ||
  function (s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (
          e.indexOf(p[i]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(s, p[i])
        )
          t[p[i]] = s[p[i]];
      }
    return t;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSingleLeaderBoardFromDB =
  exports.updateSingleLeaderBoardToDB =
  exports.getSingleLeaderBoardFromDB =
  exports.getAllLeaderBoardFromDB =
  exports.createLeaderBoardToDB =
    void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prismaExcludeHelper_1 = require("../../../helpers/prismaExcludeHelper");
const prisma_1 = require("../../../shared/prisma");
const leaderBoard_constant_1 = require("./leaderBoard.constant");
const createLeaderBoardToDB = leaderBoardData =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.leaderBoard.create({
      data: leaderBoardData,
      include: {
        user: true,
      },
    });
    if (result) {
      const userWithoutPassword = (0, prismaExcludeHelper_1.prismaExclude)(
        result.user,
        ["password"]
      );
      return Object.assign(Object.assign({}, result), {
        user: userWithoutPassword,
      });
    }
  });
exports.createLeaderBoardToDB = createLeaderBoardToDB;
const getAllLeaderBoardFromDB = (filters, paginationOptions) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { page, size, skip, sortBy, sortOrder } = (0,
    paginationHelper_1.calculatePagination)(paginationOptions);
    const { searchTerm } = filters,
      filtersData = __rest(filters, ["searchTerm"]);
    const andCondition = [];
    if (searchTerm) {
      andCondition.push({
        OR: leaderBoard_constant_1.leaderBoardSearchableFields.map(field => ({
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
    const result = yield prisma_1.prisma.leaderBoard.findMany({
      where: whereCondition,
      include: {
        user: true,
      },
      skip,
      take: size,
      orderBy:
        sortBy && sortOrder
          ? {
              [sortBy]: sortOrder,
            }
          : { createdAt: "desc" },
    });
    const total = yield prisma_1.prisma.leaderBoard.count();
    const totalPage = Number(total) / Number(size);
    if (result) {
      const resultWithoutPassword = result.map(r => {
        const userWithoutPassword = (0, prismaExcludeHelper_1.prismaExclude)(
          r.user,
          ["password"]
        );
        return Object.assign(Object.assign({}, r), {
          user: userWithoutPassword,
        });
      });
      return {
        meta: {
          total,
          page,
          size,
          totalPage: Math.ceil(totalPage),
        },
        data: resultWithoutPassword,
      };
    }
  });
exports.getAllLeaderBoardFromDB = getAllLeaderBoardFromDB;
const getSingleLeaderBoardFromDB = id =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.leaderBoard.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
      },
    });
    if (result) {
      const userWithoutPassword = (0, prismaExcludeHelper_1.prismaExclude)(
        result.user,
        ["password"]
      );
      return Object.assign(Object.assign({}, result), {
        user: userWithoutPassword,
      });
    } else {
      throw new ApiError_1.default(
        http_status_1.default.BAD_REQUEST,
        "There is no leaderBoard with the id/Failed to fetched leaderBoard"
      );
    }
  });
exports.getSingleLeaderBoardFromDB = getSingleLeaderBoardFromDB;
const updateSingleLeaderBoardToDB = (id, payload) =>
  __awaiter(void 0, void 0, void 0, function* () {
    if (payload.categoryId) {
      const isExist = yield prisma_1.prisma.category.findUnique({
        where: {
          id: payload.categoryId,
        },
      });
      if (!isExist) {
        throw new ApiError_1.default(
          http_status_1.default.CONFLICT,
          "There is no category with this category Id. Please provide a valid category Id."
        );
      }
    }
    const result = yield prisma_1.prisma.leaderBoard.update({
      where: {
        id,
      },
      data: payload,
    });
    if (result) {
      return result;
    } else {
      throw new ApiError_1.default(
        http_status_1.default.BAD_REQUEST,
        "There is no leaderBoard with the id/Failed to update leaderBoard"
      );
    }
  });
exports.updateSingleLeaderBoardToDB = updateSingleLeaderBoardToDB;
const deleteSingleLeaderBoardFromDB = id =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.leaderBoard.delete({
      where: {
        id,
      },
    });
    if (result) {
      return result;
    } else {
      throw new ApiError_1.default(
        http_status_1.default.BAD_REQUEST,
        "There is no leaderBoard with the id/Failed to delete leaderBoard"
      );
    }
  });
exports.deleteSingleLeaderBoardFromDB = deleteSingleLeaderBoardFromDB;
