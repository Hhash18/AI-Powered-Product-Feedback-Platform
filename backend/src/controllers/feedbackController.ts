import { Request, Response } from "express";
import Feedback, { IFeedback } from "../models/Feedback";
import { geminiService } from "../services/gemini.service";

export class FeedbackController {
    // Create new feedback
    static async create(req: Request, res: Response): Promise<void> {
        try {
            const { title, description, category, userEmail, userName, userType } = req.body;

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

            const titleTrimmed = title.trim();
            const descriptionTrimmed = description.trim();

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

            // Analyze with Gemini
            const analysis = await geminiService.analyzeAndCategorize(titleTrimmed, descriptionTrimmed, category);

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
            console.error("Error creating feedback:", error);
            res.status(500).json({
                success: false,
                error: "Failed to create feedback",
                message: error.message,
            });
        }
    }

    // Get all feedback with filters and pagination
    static async getAll(req: Request, res: Response): Promise<void> {
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
            console.error("Error fetching feedback:", error);
            res.status(500).json({
                success: false,
                error: "Failed to fetch feedback",
                message: error.message,
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
            res.status(500).json({
                success: false,
                error: "Failed to fetch feedback",
                message: error.message,
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
            res.status(500).json({
                success: false,
                error: "Failed to update feedback",
                message: error.message,
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
            res.status(500).json({
                success: false,
                error: "Failed to delete feedback",
                message: error.message,
            });
        }
    }

    // Get analytics (total, by status, by category, by priority)
    static async getAnalytics(req: Request, res: Response): Promise<void> {
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
            console.error("Error fetching analytics:", error);
            res.status(500).json({
                success: false,
                error: "Failed to fetch analytics",
                message: error.message,
            });
        }
    }

    // Get AI-generated insights from feedback
    static async getInsights(req: Request, res: Response): Promise<void> {
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
            console.error("Error generating insights:", error);
            res.status(500).json({
                success: false,
                error: "Failed to generate insights",
                message: error.message,
            });
        }
    }

    // Get AI-generated trend summary
    static async getSummary(req: Request, res: Response): Promise<void> {
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
            console.error("Error generating summary:", error);
            res.status(500).json({
                success: false,
                error: "Failed to generate summary",
                message: error.message,
            });
        }
    }
}
