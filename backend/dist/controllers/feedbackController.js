"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackController = void 0;
const Feedback_1 = __importDefault(require("../models/Feedback"));
const gemini_service_1 = require("../services/gemini.service");
const testStore_1 = require("../utils/testStore");
const database_1 = require("../utils/database");
class FeedbackController {
    // Create new feedback
    static async create(req, res) {
        let titleTrimmed = "";
        let descriptionTrimmed = "";
        let category = undefined;
        let userEmail = undefined;
        let userName = undefined;
        let userType = undefined;
        let analysis = null;
        try {
            const { title, description, category: reqCategory, userEmail: reqEmail, userName: reqName, userType: reqType } = req.body;
            category = reqCategory;
            userEmail = reqEmail;
            userName = reqName;
            userType = reqType;
            // Input sanitization and validation
            if (!title || typeof title !== "string") {
                res.status(400).json({
                    success: false,
                    error: "Title is required and must be a string",
                    message: "Invalid input",
                });
                return;
            }
            if (!description || typeof description !== "string") {
                res.status(400).json({
                    success: false,
                    error: "Description is required and must be a string",
                    message: "Invalid input",
                });
                return;
            }
            titleTrimmed = title.trim();
            descriptionTrimmed = description.trim();
            if (titleTrimmed.length === 0 || titleTrimmed.length > 200) {
                res.status(400).json({
                    success: false,
                    error: "Title must be between 1 and 200 characters",
                    message: "Invalid input",
                });
                return;
            }
            if (descriptionTrimmed.length < 20 || descriptionTrimmed.length > 5000) {
                res.status(400).json({
                    success: false,
                    error: "Description must be between 20 and 5000 characters",
                    message: "Invalid input",
                });
                return;
            }
            // Analyze with Gemini (before database operations)
            analysis = await gemini_service_1.geminiService.analyzeAndCategorize(titleTrimmed, descriptionTrimmed, category);
            // Create feedback document
            const feedback = new Feedback_1.default({
                title: titleTrimmed,
                description: descriptionTrimmed,
                userEmail: userEmail?.trim() || undefined,
                userName: userName?.trim() || undefined,
                userType: userType || "Guest",
                category: category || analysis.category,
                priority: analysis.priority,
                sentiment: analysis.sentiment,
                priorityScore: analysis.priorityScore,
                summary: analysis.summary,
                tags: analysis.tags,
                aiGenerated: true,
                status: "New",
            });
            await feedback.save();
            res.status(201).json({
                success: true,
                data: feedback,
                message: "Feedback submitted successfully",
            });
        }
        catch (error) {
            console.error("=== FULL ERROR OBJECT ===");
            console.error("Error:", error);
            console.error("Error message:", error?.message);
            console.error("Error name:", error?.name);
            console.error("Error code:", error?.code);
            console.error("=======================");
            // Check if it's a MongoDB connection error or timeout - be more permissive
            const isMongoError = error.message?.includes('connect') ||
                error.message?.includes('timeout') ||
                error.message?.includes('buffering') ||
                error.message?.includes('ECONNREFUSED') ||
                error.message?.includes('MongoNetworkError') ||
                error.message?.includes('MongooseError') ||
                error.message?.includes('querySrv') ||
                error.name === 'MongoNetworkError' ||
                error.name === 'MongooseError';
            if (isMongoError) {
                console.warn('✓ MongoDB error detected - using test mode with in-memory store');
                // Store in memory for test mode - use previously calculated analysis
                const testFeedback = testStore_1.testStore.addFeedback({
                    title: titleTrimmed,
                    description: descriptionTrimmed,
                    category: category || (analysis?.category || "Other"),
                    userEmail: userEmail?.trim() || undefined,
                    userName: userName?.trim() || undefined,
                    userType: userType || "Guest",
                    priority: analysis?.priority || "Medium",
                    sentiment: analysis?.sentiment || "Neutral",
                    priorityScore: analysis?.priorityScore || 5,
                    summary: analysis?.summary || descriptionTrimmed.substring(0, 200),
                    tags: analysis?.tags || [],
                    status: "New",
                });
                res.status(201).json({
                    success: true,
                    data: testFeedback,
                    message: "Feedback submitted successfully (test mode - stored in memory)",
                });
                return;
            }
            console.error("Error not recognized as MongoDB error, returning 500");
            res.status(500).json({
                success: false,
                error: "Failed to create feedback",
                message: error.message || "Unknown error",
            });
        }
    }
    // Get all feedback with filters and pagination
    static async getAll(req, res) {
        // If MongoDB is not connected, use test store directly
        if (!(0, database_1.isMongoConnected)()) {
            console.log("🔄 MongoDB not connected - using test store");
            const { status, category, priority, page = 1, limit = 20 } = req.query;
            const pageNum = Math.max(1, Number(page) || 1);
            const limitNum = Math.min(100, Math.max(1, Number(limit) || 20));
            const result = testStore_1.testStore.getAllFeedback({
                status: status,
                category: category,
                priority: priority,
            });
            const skip = (pageNum - 1) * limitNum;
            const paginatedFeedback = result.items.slice(skip, skip + limitNum);
            res.status(200).json({
                success: true,
                data: {
                    feedback: paginatedFeedback,
                    pagination: {
                        total: result.total,
                        page: pageNum,
                        limit: limitNum,
                        pages: Math.ceil(result.total / limitNum),
                    },
                },
                message: "Feedback retrieved successfully (test mode)",
            });
            return;
        }
        try {
            const { status, category, priority, sort, page = 1, limit = 20 } = req.query;
            let query = {};
            if (status && typeof status === "string")
                query.status = status;
            if (category && typeof category === "string")
                query.category = category;
            if (priority && typeof priority === "string")
                query.priority = priority;
            const sortBy = sort === "oldest" ? "createdAt" : "-createdAt";
            const pageNum = Math.max(1, Number(page) || 1);
            const limitNum = Math.min(100, Math.max(1, Number(limit) || 20));
            const skip = (pageNum - 1) * limitNum;
            const feedback = await Feedback_1.default.find(query).sort(sortBy).skip(skip).limit(limitNum);
            const total = await Feedback_1.default.countDocuments(query);
            res.status(200).json({
                success: true,
                data: {
                    feedback,
                    pagination: {
                        total,
                        page: pageNum,
                        limit: limitNum,
                        pages: Math.ceil(total / limitNum),
                    },
                },
                message: "Feedback retrieved successfully",
            });
        }
        catch (error) {
            console.error("Error fetching feedback:", error?.message);
            // Fallback to test store on error
            const { status, category, priority, page = 1, limit = 20 } = req.query;
            const pageNum = Math.max(1, Number(page) || 1);
            const limitNum = Math.min(100, Math.max(1, Number(limit) || 20));
            const result = testStore_1.testStore.getAllFeedback({
                status: status,
                category: category,
                priority: priority,
            });
            const skip = (pageNum - 1) * limitNum;
            const paginatedFeedback = result.items.slice(skip, skip + limitNum);
            res.status(200).json({
                success: true,
                data: {
                    feedback: paginatedFeedback,
                    pagination: {
                        total: result.total,
                        page: pageNum,
                        limit: limitNum,
                        pages: Math.ceil(result.total / limitNum),
                    },
                },
                message: "Feedback retrieved successfully (test mode)",
            });
        }
    }
    // Get single feedback by ID
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const feedback = await Feedback_1.default.findById(id);
            if (!feedback) {
                res.status(404).json({
                    success: false,
                    error: "Feedback not found",
                    message: "No feedback item with this ID",
                });
                return;
            }
            res.status(200).json({
                success: true,
                data: feedback,
                message: "Feedback retrieved successfully",
            });
        }
        catch (error) {
            console.error("Error fetching feedback:", error);
            // Fallback for MongoDB unavailable or invalid ID
            res.status(404).json({
                success: false,
                error: "Feedback not found",
                message: "No feedback item with this ID",
            });
        }
    }
    // Update feedback (status, priority, category)
    static async update(req, res) {
        try {
            const { id } = req.params;
            const { status, priority, category } = req.body;
            const updateData = {};
            if (status)
                updateData.status = status;
            if (priority)
                updateData.priority = priority;
            if (category)
                updateData.category = category;
            if (Object.keys(updateData).length === 0) {
                res.status(400).json({
                    success: false,
                    error: "At least one field must be provided for update",
                    message: "Invalid input",
                });
                return;
            }
            const feedback = await Feedback_1.default.findByIdAndUpdate(id, updateData, {
                new: true,
                runValidators: true,
            });
            if (!feedback) {
                res.status(404).json({
                    success: false,
                    error: "Feedback not found",
                    message: "No feedback item with this ID",
                });
                return;
            }
            res.status(200).json({
                success: true,
                data: feedback,
                message: "Feedback updated successfully",
            });
        }
        catch (error) {
            console.error("Error updating feedback:", error);
            // Fallback for MongoDB unavailable
            res.status(404).json({
                success: false,
                error: "Feedback not found",
                message: "Unable to update feedback (database unavailable)",
            });
        }
    }
    // Delete feedback
    static async delete(req, res) {
        try {
            const { id } = req.params;
            const feedback = await Feedback_1.default.findByIdAndDelete(id);
            if (!feedback) {
                res.status(404).json({
                    success: false,
                    error: "Feedback not found",
                    message: "No feedback item with this ID",
                });
                return;
            }
            res.status(200).json({
                success: true,
                data: { deletedId: id },
                message: "Feedback deleted successfully",
            });
        }
        catch (error) {
            console.error("Error deleting feedback:", error);
            // Fallback for MongoDB unavailable
            res.status(404).json({
                success: false,
                error: "Feedback not found",
                message: "Unable to delete feedback (database unavailable)",
            });
        }
    }
    // Get analytics (total, by status, by category, by priority)
    static async getAnalytics(req, res) {
        // If MongoDB is not connected, use test store directly
        if (!(0, database_1.isMongoConnected)()) {
            console.log("🔄 MongoDB not connected - using test store for analytics");
            const analytics = testStore_1.testStore.getAnalytics();
            res.status(200).json({
                success: true,
                data: analytics,
                message: "Analytics retrieved successfully (test mode)",
            });
            return;
        }
        try {
            const total = await Feedback_1.default.countDocuments();
            const byStatus = await Feedback_1.default.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]);
            const byCategory = await Feedback_1.default.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }]);
            const byPriority = await Feedback_1.default.aggregate([{ $group: { _id: "$priority", count: { $sum: 1 } } }]);
            const bySentiment = await Feedback_1.default.aggregate([{ $group: { _id: "$sentiment", count: { $sum: 1 } } }]);
            res.status(200).json({
                success: true,
                data: {
                    total,
                    byStatus: Object.fromEntries(byStatus.map((s) => [s._id, s.count])),
                    byCategory: Object.fromEntries(byCategory.map((c) => [c._id, c.count])),
                    byPriority: Object.fromEntries(byPriority.map((p) => [p._id, p.count])),
                    bySentiment: Object.fromEntries(bySentiment.map((s) => [s._id, s.count])),
                },
                message: "Analytics retrieved successfully",
            });
        }
        catch (error) {
            console.error("Error fetching analytics (using test store):", error?.message);
            // Use test store analytics
            const analytics = testStore_1.testStore.getAnalytics();
            res.status(200).json({
                success: true,
                data: analytics,
                message: "Analytics retrieved successfully (test mode)",
            });
        }
    }
    // Get AI-generated insights from feedback
    static async getInsights(req, res) {
        // If MongoDB is not connected, use test store directly
        if (!(0, database_1.isMongoConnected)()) {
            console.log("🔄 MongoDB not connected - using test store for insights");
            const result = testStore_1.testStore.getAllFeedback();
            if (result.items.length === 0) {
                res.status(200).json({
                    success: true,
                    data: {
                        insights: "No feedback available for analysis",
                    },
                    message: "No feedback to analyze",
                });
                return;
            }
            const insights = await gemini_service_1.geminiService.generateInsights(result.items);
            res.status(200).json({
                success: true,
                data: { insights },
                message: "Insights generated successfully (test mode)",
            });
            return;
        }
        try {
            const feedback = await Feedback_1.default.find().limit(50);
            if (feedback.length === 0) {
                res.status(200).json({
                    success: true,
                    data: {
                        insights: "No feedback available for analysis",
                    },
                    message: "No feedback to analyze",
                });
                return;
            }
            const insights = await gemini_service_1.geminiService.generateInsights(feedback);
            res.status(200).json({
                success: true,
                data: { insights },
                message: "Insights generated successfully",
            });
        }
        catch (error) {
            console.error("Error generating insights (using test store):", error?.message);
            // Use test store data for insights
            const result = testStore_1.testStore.getAllFeedback();
            if (result.items.length === 0) {
                res.status(200).json({
                    success: true,
                    data: {
                        insights: "No feedback available for analysis",
                    },
                    message: "No feedback to analyze",
                });
                return;
            }
            const insights = await gemini_service_1.geminiService.generateInsights(result.items);
            res.status(200).json({
                success: true,
                data: { insights },
                message: "Insights generated successfully (test mode)",
            });
        }
    }
    // Get AI-generated trend summary
    static async getSummary(req, res) {
        // If MongoDB is not connected, use test store directly
        if (!(0, database_1.isMongoConnected)()) {
            console.log("🔄 MongoDB not connected - using test store for summary");
            const result = testStore_1.testStore.getAllFeedback();
            if (result.items.length === 0) {
                res.status(200).json({
                    success: true,
                    data: {
                        summary: "No feedback available for summarization",
                    },
                    message: "No feedback to summarize",
                });
                return;
            }
            const summary = await gemini_service_1.geminiService.generateInsights(result.items);
            res.status(200).json({
                success: true,
                data: { summary },
                message: "Trend summary generated successfully (test mode)",
            });
            return;
        }
        try {
            const feedback = await Feedback_1.default.find().limit(50);
            if (feedback.length === 0) {
                res.status(200).json({
                    success: true,
                    data: {
                        summary: "No feedback available for summarization",
                    },
                    message: "No feedback to summarize",
                });
                return;
            }
            const summary = await gemini_service_1.geminiService.generateInsights(feedback);
            res.status(200).json({
                success: true,
                data: { summary },
                message: "Trend summary generated successfully",
            });
        }
        catch (error) {
            console.error("Error generating summary (using test store):", error?.message);
            // Fallback to test store
            const result = testStore_1.testStore.getAllFeedback();
            if (result.items.length === 0) {
                res.status(200).json({
                    success: true,
                    data: {
                        summary: "No feedback available for summarization",
                    },
                    message: "No feedback to summarize",
                });
                return;
            }
            const summary = await gemini_service_1.geminiService.generateInsights(result.items);
            res.status(200).json({
                success: true,
                data: { summary },
                message: "Trend summary generated successfully (test mode)",
            });
        }
    }
}
exports.FeedbackController = FeedbackController;
//# sourceMappingURL=feedbackController.js.map