"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const feedbackController_1 = require("../controllers/feedbackController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Public POST route
router.post("/", feedbackController_1.FeedbackController.create);
// Public GET routes (specific before general)
router.get("/summary", feedbackController_1.FeedbackController.getSummary);
// Protected routes (specific routes BEFORE parameter routes!)
router.get("/analytics", auth_1.authMiddleware, feedbackController_1.FeedbackController.getAnalytics);
router.get("/insights", auth_1.authMiddleware, feedbackController_1.FeedbackController.getInsights);
// General routes (after specific ones)
router.get("/", feedbackController_1.FeedbackController.getAll);
router.get("/:id", feedbackController_1.FeedbackController.getById);
router.put("/:id", auth_1.authMiddleware, feedbackController_1.FeedbackController.update);
router.delete("/:id", auth_1.authMiddleware, feedbackController_1.FeedbackController.delete);
exports.default = router;
//# sourceMappingURL=feedbackRoutes.js.map