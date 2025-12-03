"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(
  require("../../middlewares/validateRequest")
);
const quiz_controller_1 = require("./quiz.controller");
const quiz_validation_1 = require("./quiz.validation");
const router = express_1.default.Router();
router.post(
  "/create-quiz",
  (0, auth_1.default)(
    user_1.ENUM_USER_ROLE.SUPER_ADMIN,
    user_1.ENUM_USER_ROLE.ADMIN
  ),
  (0, validateRequest_1.default)(quiz_validation_1.createQuizZodSchema),
  quiz_controller_1.createQuiz
);
router.get(
  "/",
  (0, auth_1.default)(
    user_1.ENUM_USER_ROLE.SUPER_ADMIN,
    user_1.ENUM_USER_ROLE.ADMIN,
    user_1.ENUM_USER_ROLE.PERFORMER
  ),
  quiz_controller_1.getAllQuiz
);
router.get(
  "/:id",
  (0, auth_1.default)(
    user_1.ENUM_USER_ROLE.SUPER_ADMIN,
    user_1.ENUM_USER_ROLE.ADMIN,
    user_1.ENUM_USER_ROLE.PERFORMER
  ),
  quiz_controller_1.getSingleQuiz
);
router.patch(
  "/:id",
  (0, auth_1.default)(
    user_1.ENUM_USER_ROLE.SUPER_ADMIN,
    user_1.ENUM_USER_ROLE.ADMIN
  ),
  (0, validateRequest_1.default)(quiz_validation_1.updateQuizZodSchema),
  quiz_controller_1.updateSingleQuiz
);
router.delete(
  "/:id",
  (0, auth_1.default)(
    user_1.ENUM_USER_ROLE.SUPER_ADMIN,
    user_1.ENUM_USER_ROLE.ADMIN
  ),
  quiz_controller_1.deleteSingleQuiz
);
exports.QuizRoutes = router;
