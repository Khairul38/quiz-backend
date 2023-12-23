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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfileFromDB = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prismaExcludeHelper_1 = require("../../../helpers/prismaExcludeHelper");
const prisma_1 = require("../../../shared/prisma");
const getUserProfileFromDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.user.findUnique({
        where: {
            id: user === null || user === void 0 ? void 0 : user.id,
        },
    });
    if (result) {
        const userWithoutPassword = (0, prismaExcludeHelper_1.prismaExclude)(result, [
            "password",
        ]);
        return userWithoutPassword;
    }
    else {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "User not found");
    }
});
exports.getUserProfileFromDB = getUserProfileFromDB;
