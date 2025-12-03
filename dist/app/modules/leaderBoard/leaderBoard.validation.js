"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLeaderBoardZodSchema = exports.createLeaderBoardZodSchema =
  void 0;
const zod_1 = require("zod");
exports.createLeaderBoardZodSchema = zod_1.z.object({
  body: zod_1.z.object({
    totalMark: zod_1.z.number({
      required_error: "totalMark is required",
    }),
    correctlyAnswer: zod_1.z.string({
      required_error: "correctlyAnswer is required",
    }),
    userId: zod_1.z.string({
      required_error: "userId is required",
    }),
    categoryId: zod_1.z.string({
      required_error: "categoryId is required",
    }),
  }),
});
exports.updateLeaderBoardZodSchema = zod_1.z.object({
  body: zod_1.z.object({
    totalMark: zod_1.z.number().optional(),
    correctlyAnswer: zod_1.z.string().optional(),
    userId: zod_1.z.string().optional(),
    categoryId: zod_1.z.string().optional(),
  }),
});
