import express from "express";
import { FeedbackController } from "../controllers/feedbackController";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

// Public routes - specific routes BEFORE parameter routes
router.post("/", FeedbackController.create);
router.get("/summary", FeedbackController.getSummary);
router.get("/", FeedbackController.getAll);
router.get("/:id", FeedbackController.getById);

// Protected routes (admin only)
router.get("/analytics", authMiddleware, FeedbackController.getAnalytics);
router.get("/insights", authMiddleware, FeedbackController.getInsights);
router.put("/:id", authMiddleware, FeedbackController.update);
router.delete("/:id", authMiddleware, FeedbackController.delete);

export default router;
