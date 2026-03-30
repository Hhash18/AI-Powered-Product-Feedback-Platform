import mongoose, { Schema, Document } from 'mongoose';

export interface IFeedback extends Document {
  title: string;
  description: string;
  category?: string;
  priority?: 'Low' | 'Medium' | 'High' | 'Critical';
  sentiment?: 'Positive' | 'Neutral' | 'Negative';
  priorityScore?: number; // 1-10
  summary?: string;
  tags?: string[];
  userEmail?: string;
  userName?: string;
  userType?: 'User' | 'Admin' | 'Guest';
  status?: 'New' | 'Reviewed' | 'In Progress' | 'Completed' | 'Archived';
  aiGenerated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const feedbackSchema = new Schema<IFeedback>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
      minlength: 20,
    },
    category: {
      type: String,
      enum: [
        'Bug',
        'Feature Request',
        'Improvement',
        'Documentation',
        'Performance',
        'Other',
      ],
      default: 'Improvement',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    sentiment: {
      type: String,
      enum: ['Positive', 'Neutral', 'Negative'],
      default: 'Neutral',
    },
    priorityScore: {
      type: Number,
      min: 1,
      max: 10,
      default: 5,
    },
    summary: {
      type: String,
      maxlength: 500,
    },
    tags: {
      type: [String],
      default: [],
    },
    userEmail: {
      type: String,
      lowercase: true,
      sparse: true,
    },
    userName: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    userType: {
      type: String,
      enum: ['User', 'Admin', 'Guest'],
      default: 'Guest',
    },
    status: {
      type: String,
      enum: ['New', 'Reviewed', 'In Progress', 'Completed', 'Archived'],
      default: 'New',
    },
    aiGenerated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IFeedback>('Feedback', feedbackSchema);
