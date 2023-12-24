import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import {
  createCategory,
  deleteSingleCategory,
  getAllCategory,
  getSingleCategory,
  updateSingleCategory,
} from "./category.controller";
import {
  createCategoryZodSchema,
  updateCategoryZodSchema,
} from "./category.validation";

const router = express.Router();

router.post(
  "/create-category",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(createCategoryZodSchema),
  createCategory
);

router.get(
  "/",
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.PERFORMER
  ),
  getAllCategory
);

router.get(
  "/:id",
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.PERFORMER
  ),
  getSingleCategory
);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(updateCategoryZodSchema),
  updateSingleCategory
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  deleteSingleCategory
);

export const CategoryRoutes = router;
