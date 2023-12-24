import express from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { CategoryRoutes } from "../modules/category/category.route";
import { LeaderBoardRoutes } from "../modules/leaderBoard/leaderBoard.route";
import { ProfileRoutes } from "../modules/profile/profile.route";
import { QuizRoutes } from "../modules/quiz/quiz.route";
import { UserRoutes } from "../modules/user/user.route";

const router = express.Router();

const moduleRoutes = [
  // ... routes
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/profile",
    route: ProfileRoutes,
  },
  {
    path: "/categories",
    route: CategoryRoutes,
  },
  {
    path: "/quizs",
    route: QuizRoutes,
  },
  {
    path: "/leaderBoards",
    route: LeaderBoardRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
