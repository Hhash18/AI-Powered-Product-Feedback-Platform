import { Request, Response } from 'express';
import Feedback, { IFeedback } from '../models/Feedback';
import { geminiService } from '../services/gemini.service';

export class FeedbackController {
  // Create new feedback
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { title, description, category, userEmail, userName, userType } =
        req.body;

      // Validate input
      if (!title || !description) {
        res.status(400).json({
          error: 'Title and description are required',
        });
        return;
      }

      // Validate description minimum length
      if (description.trim().length < 20) {
        res.status(400).json({
          error: 'Description must be at least 20 characters',
        });
        return;
      }

      // Validate title is not empty
      if (!title.trim()) {
        res.status(400).json({
          error: 'Title cannot be empty',
        });
        return;
      }

      // Analyze with Gemini
      const analysis = await geminiService.analyzeAndCategorize(
        title,
        description,
        category // Pass user-selected category to AI for enhanced analysis
      );

      // Create feedback document
      const feedback = new Feedback({
        title: title.trim(),
        description: description.trim(),
        userEmail: userEmail?.trim() || undefined,
        userName: userName?.trim() || undefined,
        userType: userType || 'Guest',
        category: category || analysis.category,
        priority: analysis.priority,
        sentiment: analysis.sentiment,
        priorityScore: analysis.priorityScore,
        summary: analysis.summary,
        tags: analysis.tags,
        aiGenerated: true,
        status: 'New',
      });

      await feedback.save();

      res.status(201).json({
        message: 'Feedback submitted successfully',
        feedback,
      });
    } catch (error: any) {
      console.error('Error creating feedback:', error);
      res.status(500).json({
        error: 'Failed to create feedback',
        details: error.message,
      });
    }
  }

  // Get all feedback
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { status, category, priority, sort } = req.query;

      let query: any = {};

      if (status) query.status = status;
      if (category) query.category = category;
      if (priority) query.priority = priority;

      const sortBy = sort === 'oldest' ? 'createdAt' : '-createdAt';

      const feedback = await Feedback.find(query).sort(sortBy);

      res.json({
        total: feedback.length,
        feedback,
      });
    } catch (error: any) {
      console.error('Error fetching feedback:', error);
      res.status(500).json({
        error: 'Failed to fetch feedback',
        details: error.message,
      });
    }
  }

  // Get single feedback
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const feedback = await Feedback.findById(id);

      if (!feedback) {
        res.status(404).json({
          error: 'Feedback not found',
        });
        return;
      }

      res.json(feedback);
    } catch (error: any) {
      console.error('Error fetching feedback:', error);
      res.status(500).json({
        error: 'Failed to fetch feedback',
        details: error.message,
      });
    }
  }

  // Update feedback
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status, priority, category } = req.body;

      const feedback = await Feedback.findByIdAndUpdate(
        id,
        { status, priority, category },
        { new: true, runValidators: true }
      );

      if (!feedback) {
        res.status(404).json({
          error: 'Feedback not found',
        });
        return;
      }

      res.json({
        message: 'Feedback updated successfully',
        feedback,
      });
    } catch (error: any) {
      console.error('Error updating feedback:', error);
      res.status(500).json({
        error: 'Failed to update feedback',
        details: error.message,
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
          error: 'Feedback not found',
        });
        return;
      }

      res.json({
        message: 'Feedback deleted successfully',
      });
    } catch (error: any) {
      console.error('Error deleting feedback:', error);
      res.status(500).json({
        error: 'Failed to delete feedback',
        details: error.message,
      });
    }
  }

  // Get analytics
  static async getAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const total = await Feedback.countDocuments();
      const byStatus = await Feedback.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]);
      const byCategory = await Feedback.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
      ]);
      const byPriority = await Feedback.aggregate([
        { $group: { _id: '$priority', count: { $sum: 1 } } },
      ]);

      res.json({
        total,
        byStatus: Object.fromEntries(byStatus.map((s) => [s._id, s.count])),
        byCategory: Object.fromEntries(byCategory.map((c) => [c._id, c.count])),
        byPriority: Object.fromEntries(byPriority.map((p) => [p._id, p.count])),
      });
    } catch (error: any) {
      console.error('Error fetching analytics:', error);
      res.status(500).json({
        error: 'Failed to fetch analytics',
        details: error.message,
      });
    }
  }

  // Get insights
  static async getInsights(req: Request, res: Response): Promise<void> {
    try {
      const feedback = await Feedback.find().limit(50);
      const insights = await geminiService.generateInsights(feedback);

      res.json({
        insights,
      });
    } catch (error: any) {
      console.error('Error generating insights:', error);
      res.status(500).json({
        error: 'Failed to generate insights',
        details: error.message,
      });
    }
  }
}
