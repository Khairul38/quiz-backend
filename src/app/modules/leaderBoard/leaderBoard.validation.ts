import { z } from "zod";

export const createLeaderBoardZodSchema = z.object({
  body: z.object({
    totalMark: z.number({
      required_error: "totalMark is required",
    }),
    correctlyAnswer: z.string({
      required_error: "correctlyAnswer is required",
    }),
    userId: z.string({
      required_error: "userId is required",
    }),
    categoryId: z.string({
      required_error: "categoryId is required",
    }),
  }),
});

export const updateLeaderBoardZodSchema = z.object({
  body: z.object({
    totalMark: z.number().optional(),
    correctlyAnswer: z.string().optional(),
    userId: z.string().optional(),
    categoryId: z.string().optional(),
  }),
});
