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
exports.deleteSingleUserFromDB =
  exports.updateSingleUserToDB =
  exports.getSingleUserFromDB =
  exports.getAllUserFromDB =
    void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prismaExcludeHelper_1 = require("../../../helpers/prismaExcludeHelper");
const prisma_1 = require("../../../shared/prisma");
const user_constant_1 = require("./user.constant");
const getAllUserFromDB = (filters, paginationOptions) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { page, size, skip, sortBy, sortOrder } = (0,
    paginationHelper_1.calculatePagination)(paginationOptions);
    const { searchTerm } = filters,
      filtersData = __rest(filters, ["searchTerm"]);
    const andCondition = [];
    if (searchTerm) {
      andCondition.push({
        OR: user_constant_1.userSearchableFields.map(field => ({
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
    const result = yield prisma_1.prisma.user.findMany({
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
      (0, prismaExcludeHelper_1.prismaExclude)(r, ["password"])
    );
    const total = yield prisma_1.prisma.user.count();
    return {
      meta: {
        total,
        page,
        size,
      },
      data: resultWithoutPassword,
    };
  });
exports.getAllUserFromDB = getAllUserFromDB;
const getSingleUserFromDB = id =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (result) {
      const userWithoutPassword = (0, prismaExcludeHelper_1.prismaExclude)(
        result,
        ["password"]
      );
      return userWithoutPassword;
    } else {
      throw new ApiError_1.default(
        http_status_1.default.BAD_REQUEST,
        "There is no user with the id"
      );
    }
  });
exports.getSingleUserFromDB = getSingleUserFromDB;
const updateSingleUserToDB = (id, payload) =>
  __awaiter(void 0, void 0, void 0, function* () {
    if (payload.email) {
      const isExist = yield prisma_1.prisma.user.findUnique({
        where: {
          email: payload.email,
        },
      });
      if (isExist) {
        throw new ApiError_1.default(
          http_status_1.default.CONFLICT,
          "Another user already exists with this email. Please provide a new email."
        );
      }
    }
    // hash password before update
    if (payload.password) {
      payload.password = yield bcrypt_1.default.hash(
        payload.password,
        Number(config_1.default.bcrypt_salt_rounds)
      );
    }
    const result = yield prisma_1.prisma.user.update({
      where: {
        id,
      },
      data: payload,
    });
    if (result) {
      const userWithoutPassword = (0, prismaExcludeHelper_1.prismaExclude)(
        result,
        ["password"]
      );
      return userWithoutPassword;
    } else {
      throw new ApiError_1.default(
        http_status_1.default.BAD_REQUEST,
        "There is no user with the id/Failed to update user"
      );
    }
  });
exports.updateSingleUserToDB = updateSingleUserToDB;
const deleteSingleUserFromDB = id =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.user.delete({
      where: {
        id,
      },
    });
    if (result) {
      const userWithoutPassword = (0, prismaExcludeHelper_1.prismaExclude)(
        result,
        ["password"]
      );
      return userWithoutPassword;
    }
  });
exports.deleteSingleUserFromDB = deleteSingleUserFromDB;
