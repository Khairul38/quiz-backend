"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategoryZodSchema = exports.createCategoryZodSchema = void 0;
const zod_1 = require("zod");
exports.createCategoryZodSchema = zod_1.z.object({
  body: zod_1.z.object({
    name: zod_1.z.string({
      required_error: "Name is required",
    }),
  }),
});
exports.updateCategoryZodSchema = zod_1.z.object({
  body: zod_1.z.object({
    name: zod_1.z.string().optional(),
  }),
});
