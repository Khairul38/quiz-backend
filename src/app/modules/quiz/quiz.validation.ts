import { z } from "zod";

export const createQuizZodSchema = z.object({
  body: z.object({
    creatorId: z.string({
      required_error: "creatorId is required",
    }),
    categoryId: z.string({
      required_error: "categoryId is required",
    }),
    multiChoice: z.boolean({
      required_error: "Multi Choice is required",
    }),
    mark: z.number({
      required_error: "mark is required",
    }),
    timeTaken: z.number({
      required_error: "timeTaken is required",
    }),
    question: z.string({
      required_error: "question is required",
    }),
    quizAnswers: z.array(
      z.object({
        answer: z.string({
          required_error: "Answer is required",
        }),
        explanation: z.string({
          required_error: "Explanation is required",
        }),
        istrue: z.boolean({
          required_error: "Correct answer (istrue) is required",
        }),
      }),
      {
        required_error: "Ordered Books is required",
      }
    ),
  }),
});

export const updateQuizZodSchema = z.object({
  body: z.object({
    creatorId: z.string().optional(),
    categoryId: z.string().optional(),
    multiChoice: z.boolean().optional(),
    mark: z.number().optional(),
    timeTaken: z.number().optional(),
    question: z.string().optional(),
    quizAnswers: z
      .array(
        z.object({
          answer: z.string().optional(),
          explanation: z.string().optional(),
          istrue: z.boolean().optional(),
        })
      )
      .optional(),
  }),
});
