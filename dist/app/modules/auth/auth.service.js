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
exports.refreshTokenUserFromDB = exports.loginUserFromDB = exports.createUserToDB = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const passwordMatchHelper_1 = require("../../../helpers/passwordMatchHelper");
const prismaExcludeHelper_1 = require("../../../helpers/prismaExcludeHelper");
const prisma_1 = require("../../../shared/prisma");
const createUserToDB = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    // hash password before create
    userData.password = yield bcrypt_1.default.hash(userData.password, Number(config_1.default.bcrypt_salt_rounds));
    const createdUser = yield prisma_1.prisma.user.create({
        data: userData,
    });
    if (createdUser) {
        const userWithoutPassword = (0, prismaExcludeHelper_1.prismaExclude)(createdUser, [
            "password",
        ]);
        return userWithoutPassword;
    }
    else {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Failed to create user!");
    }
});
exports.createUserToDB = createUserToDB;
const loginUserFromDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    const isUserExist = yield prisma_1.prisma.user.findUnique({
        where: {
            email,
        },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User does not exist with this email");
    }
    if (isUserExist.password &&
        !(yield (0, passwordMatchHelper_1.isPasswordMatched)(password, isUserExist.password))) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Password is incorrect");
    }
    //create access token & refresh token
    const { id, role, name } = isUserExist;
    const accessToken = (0, jwtHelpers_1.createToken)({ id, role, email, name }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    const refreshToken = (0, jwtHelpers_1.createToken)({ id, role, email, name }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return {
        accessToken,
        refreshToken,
    };
});
exports.loginUserFromDB = loginUserFromDB;
const refreshTokenUserFromDB = (token) => __awaiter(void 0, void 0, void 0, function* () {
    //verify token
    // invalid token - synchronous
    let verifiedToken = null;
    try {
        verifiedToken = (0, jwtHelpers_1.verifyToken)(token, config_1.default.jwt.refresh_secret);
    }
    catch (err) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "Invalid Refresh Token");
    }
    const { email, name } = verifiedToken;
    // tumi delete hye gso  kintu tumar refresh token ase
    // checking deleted user's refresh token
    const isUserExist = yield prisma_1.prisma.user.findUnique({
        where: {
            email,
        },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User does not exist");
    }
    //generate new token
    const newAccessToken = (0, jwtHelpers_1.createToken)({
        id: isUserExist.id,
        role: isUserExist.role,
        email,
        name,
    }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    return {
        accessToken: newAccessToken,
    };
});
exports.refreshTokenUserFromDB = refreshTokenUserFromDB;
