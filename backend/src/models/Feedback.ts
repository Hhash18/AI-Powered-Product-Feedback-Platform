import mongoose, { Schema, Document } from "mongoose";

export interface IFeedback extends Document {
    title: string;
    description: string;
    category?: "Bug" | "Feature Request" | "Improvement" | "Other";
    status?: "New" | "In Review" | "Resolved";
    submitterName?: string;
    submitterEmail?: string;
    // AI fields — populated after Gemini responds
    ai_category?: string;
    ai_sentiment?: "Positive" | "Neutral" | "Negative";
    ai_priority?: number; // 1-10
    ai_summary?: string;
    ai_tags?: string[];
    ai_processed: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const feedbackSchema = new Schema<IFeedback>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 120,
        },
        description: {
            type: String,
            required: true,
            trim: true,
            minlength: 20,
            maxlength: 5000,
        },
        category: {
            type: String,
            enum: ["Bug", "Feature Request", "Improvement", "Other"],
            default: "Other",
        },
        status: {
            type: String,
            enum: ["New", "In Review", "Resolved"],
            default: "New",
        },
        submitterName: {
            type: String,
            trim: true,
            maxlength: 100,
        },
        submitterEmail: {
            type: String,
            lowercase: true,
            sparse: true,
            validate: {
                validator: function (v: string) {
                    if (!v) return true; // Optional field
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
                },
                message: "Invalid email format",
            },
        },
        // AI fields
        ai_category: {
            type: String,
            trim: true,
        },
        ai_sentiment: {
            type: String,
            enum: ["Positive", "Neutral", "Negative"],
            default: "Neutral",
        },
        ai_priority: {
            type: Number,
            min: 1,
            max: 10,
            default: 5,
        },
        ai_summary: {
            type: String,
            maxlength: 500,
        },
        ai_tags: {
            type: [String],
            default: [],
        },
        ai_processed: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

// Indexes for query performance (Requirement 5.2)
feedbackSchema.index({ status: 1 });
feedbackSchema.index({ category: 1 });
feedbackSchema.index({ ai_priority: 1 });
feedbackSchema.index({ createdAt: -1 });

// Compound indexes for common queries
feedbackSchema.index({ status: 1, createdAt: -1 });
feedbackSchema.index({ category: 1, status: 1 });
feedbackSchema.index({ ai_priority: 1, createdAt: -1 });

export default mongoose.model<IFeedback>("Feedback", feedbackSchema);
