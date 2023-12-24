import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import {
  createLeaderBoard,
  deleteSingleLeaderBoard,
  getAllLeaderBoard,
  getSingleLeaderBoard,
  updateSingleLeaderBoard,
} from "./leaderBoard.controller";
import {
  createLeaderBoardZodSchema,
  updateLeaderBoardZodSchema,
} from "./leaderBoard.validation";

const router = express.Router();

router.post(
  "/create-leaderBoard",
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.PERFORMER
  ),
  validateRequest(createLeaderBoardZodSchema),
  createLeaderBoard
);

router.get(
  "/",
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.PERFORMER
  ),
  getAllLeaderBoard
);

router.get(
  "/:id",
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.PERFORMER
  ),
  getSingleLeaderBoard
);

router.patch(
  "/:id",
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.PERFORMER
  ),
  validateRequest(updateLeaderBoardZodSchema),
  updateSingleLeaderBoard
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  deleteSingleLeaderBoard
);

export const LeaderBoardRoutes = router;
