"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = require("../modules/auth/auth.route");
const category_route_1 = require("../modules/category/category.route");
const leaderBoard_route_1 = require("../modules/leaderBoard/leaderBoard.route");
const profile_route_1 = require("../modules/profile/profile.route");
const quiz_route_1 = require("../modules/quiz/quiz.route");
const user_route_1 = require("../modules/user/user.route");
const router = express_1.default.Router();
const moduleRoutes = [
  // ... routes
  {
    path: "/auth",
    route: auth_route_1.AuthRoutes,
  },
  {
    path: "/users",
    route: user_route_1.UserRoutes,
  },
  {
    path: "/profile",
    route: profile_route_1.ProfileRoutes,
  },
  {
    path: "/categories",
    route: category_route_1.CategoryRoutes,
  },
  {
    path: "/quizs",
    route: quiz_route_1.QuizRoutes,
  },
  {
    path: "/leaderBoards",
    route: leaderBoard_route_1.LeaderBoardRoutes,
  },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
