import mongoose, { Schema, Document } from 'mongoose';

export interface IFeedback extends Document {
  title: string;
  description: string;
  category?: string;
  priority?: 'Low' | 'Medium' | 'High' | 'Critical';
  summary?: string;
  userEmail?: string;
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
      default: 'Feature Request',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    summary: {
      type: String,
      maxlength: 500,
    },
    userEmail: {
      type: String,
      lowercase: true,
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
