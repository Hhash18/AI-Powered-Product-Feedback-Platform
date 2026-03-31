import mongoose, { Document } from "mongoose";
export interface IFeedback extends Document {
    title: string;
    description: string;
    category?: "Bug" | "Feature Request" | "Improvement" | "Other";
    status?: "New" | "In Review" | "Resolved";
    submitterName?: string;
    submitterEmail?: string;
    ai_category?: string;
    ai_sentiment?: "Positive" | "Neutral" | "Negative";
    ai_priority?: number;
    ai_summary?: string;
    ai_tags?: string[];
    ai_processed: boolean;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IFeedback, {}, {}, {}, mongoose.Document<unknown, {}, IFeedback, {}, {}> & IFeedback & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Feedback.d.ts.map