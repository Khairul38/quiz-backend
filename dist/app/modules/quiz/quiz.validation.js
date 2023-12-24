"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateQuizZodSchema = exports.createQuizZodSchema = void 0;
const zod_1 = require("zod");
exports.createQuizZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        creatorId: zod_1.z.string({
            required_error: "creatorId is required",
        }),
        categoryId: zod_1.z.string({
            required_error: "categoryId is required",
        }),
        multiChoice: zod_1.z.boolean({
            required_error: "Multi Choice is required",
        }),
        mark: zod_1.z.number({
            required_error: "mark is required",
        }),
        timeTaken: zod_1.z.number({
            required_error: "timeTaken is required",
        }),
        question: zod_1.z.string({
            required_error: "question is required",
        }),
        quizAnswers: zod_1.z.array(zod_1.z.object({
            answer: zod_1.z.string({
                required_error: "Answer is required",
            }),
            explanation: zod_1.z.string({
                required_error: "Explanation is required",
            }),
            istrue: zod_1.z.number({
                required_error: "Correct answer (istrue) is required",
            }),
        }), {
            required_error: "Ordered Books is required",
        }),
    }),
});
exports.updateQuizZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        creatorId: zod_1.z.string().optional(),
        categoryId: zod_1.z.string().optional(),
        multiChoice: zod_1.z.boolean().optional(),
        mark: zod_1.z.number().optional(),
        timeTaken: zod_1.z.number().optional(),
        question: zod_1.z.string().optional(),
        quizAnswers: zod_1.z
            .array(zod_1.z.object({
            answer: zod_1.z.string().optional(),
            explanation: zod_1.z.string().optional(),
            istrue: zod_1.z.number().optional(),
        }))
            .optional(),
    }),
});
