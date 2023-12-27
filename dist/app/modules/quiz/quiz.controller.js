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
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSingleQuiz =
  exports.updateSingleQuiz =
  exports.getSingleQuiz =
  exports.getAllQuiz =
  exports.createQuiz =
    void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const quiz_service_1 = require("./quiz.service");
const pick_1 = __importDefault(require("../../../shared/pick"));
const quiz_constant_1 = require("./quiz.constant");
const pagination_1 = require("../../../constants/pagination");
exports.createQuiz = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield (0, quiz_service_1.createQuizToDB)(user, req.body);
    (0, sendResponse_1.default)(res, {
      success: true,
      statusCode: http_status_1.default.OK,
      message: "Quiz created successfully",
      data: result,
    });
  })
);
exports.getAllQuiz = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(
      req.query,
      quiz_constant_1.quizFilterableFields
    );
    const pagination = (0, pick_1.default)(
      req.query,
      pagination_1.paginationFields
    );
    const result = yield (0, quiz_service_1.getAllQuizFromDB)(
      filters,
      pagination
    );
    (0, sendResponse_1.default)(res, {
      statusCode: http_status_1.default.OK,
      success: true,
      message: "Quizs retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  })
);
exports.getSingleQuiz = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, quiz_service_1.getSingleQuizFromDB)(req.params.id);
    (0, sendResponse_1.default)(res, {
      statusCode: http_status_1.default.OK,
      success: true,
      message: "Single quiz fetched successfully",
      data: result,
    });
  })
);
exports.updateSingleQuiz = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const payload = req.body;
    const result = yield (0, quiz_service_1.updateSingleQuizToDB)(id, payload);
    (0, sendResponse_1.default)(res, {
      statusCode: http_status_1.default.OK,
      success: true,
      message: "Quiz updated successfully",
      data: result,
    });
  })
);
exports.deleteSingleQuiz = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield (0, quiz_service_1.deleteSingleQuizFromDB)(id);
    (0, sendResponse_1.default)(res, {
      statusCode: http_status_1.default.OK,
      success: true,
      message: "Quiz deleted successfully",
      data: result,
    });
  })
);
