import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import {
  createQuiz,
  deleteSingleQuiz,
  getAllQuiz,
  getSingleQuiz,
  updateSingleQuiz,
} from "./quiz.controller";
import { createQuizZodSchema, updateQuizZodSchema } from "./quiz.validation";

const router = express.Router();

router.post(
  "/create-quiz",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(createQuizZodSchema),
  createQuiz
);

router.get(
  "/",
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.PERFORMER
  ),
  getAllQuiz
);

router.get(
  "/:id",
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.PERFORMER
  ),
  getSingleQuiz
);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(updateQuizZodSchema),
  updateSingleQuiz
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  deleteSingleQuiz
);

export const QuizRoutes = router;
