import { Request, Response } from "express";
import Feedback, { IFeedback } from "../models/Feedback";
import { geminiService } from "../services/gemini.service";
import { testStore } from "../utils/testStore";
import { isMongoConnected } from "../utils/database";

export class FeedbackController {
    // Create new feedback
    static async create(req: Request, res: Response): Promise<void> {
        let titleTrimmed = "";
        let descriptionTrimmed = "";
        let category: any = undefined;
        let userEmail: any = undefined;
        let userName: any = undefined;
        let userType: any = undefined;
        let analysis: any = null;

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
            analysis = await geminiService.analyzeAndCategorize(titleTrimmed, descriptionTrimmed, category);

            // Create feedback document
            const feedback = new Feedback({
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
        } catch (error: any) {
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
                const testFeedback = testStore.addFeedback({
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
    static async getAll(req: Request, res: Response): Promise<void> {
        // If MongoDB is not connected, use test store directly
        if (!isMongoConnected()) {
            console.log("🔄 MongoDB not connected - using test store");
            const { status, category, priority, page = 1, limit = 20 } = req.query;
            const pageNum = Math.max(1, Number(page) || 1);
            const limitNum = Math.min(100, Math.max(1, Number(limit) || 20));

            const result = testStore.getAllFeedback({
                status: status as string | undefined,
                category: category as string | undefined,
                priority: priority as string | undefined,
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

            let query: any = {};

            if (status && typeof status === "string") query.status = status;
            if (category && typeof category === "string") query.category = category;
            if (priority && typeof priority === "string") query.priority = priority;

            const sortBy = sort === "oldest" ? "createdAt" : "-createdAt";
            const pageNum = Math.max(1, Number(page) || 1);
            const limitNum = Math.min(100, Math.max(1, Number(limit) || 20));
            const skip = (pageNum - 1) * limitNum;

            const feedback = await Feedback.find(query).sort(sortBy).skip(skip).limit(limitNum);
            const total = await Feedback.countDocuments(query);

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
        } catch (error: any) {
            console.error("Error fetching feedback:", error?.message);
            // Fallback to test store on error
            const { status, category, priority, page = 1, limit = 20 } = req.query;
            const pageNum = Math.max(1, Number(page) || 1);
            const limitNum = Math.min(100, Math.max(1, Number(limit) || 20));

            const result = testStore.getAllFeedback({
                status: status as string | undefined,
                category: category as string | undefined,
                priority: priority as string | undefined,
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
    static async getById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            const feedback = await Feedback.findById(id);

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
        } catch (error: any) {
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
    static async update(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { status, priority, category } = req.body;

            const updateData: any = {};
            if (status) updateData.status = status;
            if (priority) updateData.priority = priority;
            if (category) updateData.category = category;

            if (Object.keys(updateData).length === 0) {
                res.status(400).json({
                    success: false,
                    error: "At least one field must be provided for update",
                    message: "Invalid input",
                });
                return;
            }

            const feedback = await Feedback.findByIdAndUpdate(id, updateData, {
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
        } catch (error: any) {
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
    static async delete(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            const feedback = await Feedback.findByIdAndDelete(id);

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
        } catch (error: any) {
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
    static async getAnalytics(req: Request, res: Response): Promise<void> {
        // If MongoDB is not connected, use test store directly
        if (!isMongoConnected()) {
            console.log("🔄 MongoDB not connected - using test store for analytics");
            const analytics = testStore.getAnalytics();
            res.status(200).json({
                success: true,
                data: analytics,
                message: "Analytics retrieved successfully (test mode)",
            });
            return;
        }

        try {
            const total = await Feedback.countDocuments();
            const byStatus = await Feedback.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]);
            const byCategory = await Feedback.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }]);
            const byPriority = await Feedback.aggregate([{ $group: { _id: "$priority", count: { $sum: 1 } } }]);
            const bySentiment = await Feedback.aggregate([{ $group: { _id: "$sentiment", count: { $sum: 1 } } }]);

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
        } catch (error: any) {
            console.error("Error fetching analytics (using test store):", error?.message);
            // Use test store analytics
            const analytics = testStore.getAnalytics();
            res.status(200).json({
                success: true,
                data: analytics,
                message: "Analytics retrieved successfully (test mode)",
            });
        }
    }

    // Get AI-generated insights from feedback
    static async getInsights(req: Request, res: Response): Promise<void> {
        // If MongoDB is not connected, use test store directly
        if (!isMongoConnected()) {
            console.log("🔄 MongoDB not connected - using test store for insights");
            const result = testStore.getAllFeedback();

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

            const insights = await geminiService.generateInsights(result.items as any);
            res.status(200).json({
                success: true,
                data: { insights },
                message: "Insights generated successfully (test mode)",
            });
            return;
        }

        try {
            const feedback = await Feedback.find().limit(50);

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

            const insights = await geminiService.generateInsights(feedback);

            res.status(200).json({
                success: true,
                data: { insights },
                message: "Insights generated successfully",
            });
        } catch (error: any) {
            console.error("Error generating insights (using test store):", error?.message);
            // Use test store data for insights
            const result = testStore.getAllFeedback();

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

            const insights = await geminiService.generateInsights(result.items as any);
            res.status(200).json({
                success: true,
                data: { insights },
                message: "Insights generated successfully (test mode)",
            });
        }
    }

    // Get AI-generated trend summary
    static async getSummary(req: Request, res: Response): Promise<void> {
        // If MongoDB is not connected, use test store directly
        if (!isMongoConnected()) {
            console.log("🔄 MongoDB not connected - using test store for summary");
            const result = testStore.getAllFeedback();

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

            const summary = await geminiService.generateInsights(result.items as any);
            res.status(200).json({
                success: true,
                data: { summary },
                message: "Trend summary generated successfully (test mode)",
            });
            return;
        }

        try {
            const feedback = await Feedback.find().limit(50);

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

            const summary = await geminiService.generateInsights(feedback);

            res.status(200).json({
                success: true,
                data: { summary },
                message: "Trend summary generated successfully",
            });
        } catch (error: any) {
            console.error("Error generating summary (using test store):", error?.message);
            // Fallback to test store
            const result = testStore.getAllFeedback();

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

            const summary = await geminiService.generateInsights(result.items as any);
            res.status(200).json({
                success: true,
                data: { summary },
                message: "Trend summary generated successfully (test mode)",
            });
        }
    }
}
