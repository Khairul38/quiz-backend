"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaderBoardRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const leaderBoard_controller_1 = require("./leaderBoard.controller");
const leaderBoard_validation_1 = require("./leaderBoard.validation");
const router = express_1.default.Router();
router.post("/create-leaderBoard", (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.PERFORMER), (0, validateRequest_1.default)(leaderBoard_validation_1.createLeaderBoardZodSchema), leaderBoard_controller_1.createLeaderBoard);
router.get("/", (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.PERFORMER), leaderBoard_controller_1.getAllLeaderBoard);
router.get("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.PERFORMER), leaderBoard_controller_1.getSingleLeaderBoard);
router.patch("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.PERFORMER), (0, validateRequest_1.default)(leaderBoard_validation_1.updateLeaderBoardZodSchema), leaderBoard_controller_1.updateSingleLeaderBoard);
router.delete("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), leaderBoard_controller_1.deleteSingleLeaderBoard);
exports.LeaderBoardRoutes = router;
