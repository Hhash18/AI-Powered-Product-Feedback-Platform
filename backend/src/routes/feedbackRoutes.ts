import express from "express";
import { FeedbackController } from "../controllers/feedbackController";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

// Public POST route
router.post("/", FeedbackController.create);

// Public GET routes (specific before general)
router.get("/summary", FeedbackController.getSummary);

// Protected routes (specific routes BEFORE parameter routes!)
router.get("/analytics", authMiddleware, FeedbackController.getAnalytics);
router.get("/insights", authMiddleware, FeedbackController.getInsights);

// General routes (after specific ones)
router.get("/", FeedbackController.getAll);
router.get("/:id", FeedbackController.getById);
router.put("/:id", authMiddleware, FeedbackController.update);
router.delete("/:id", authMiddleware, FeedbackController.delete);

export default router;
