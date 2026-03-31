"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const feedbackSchema = new mongoose_1.Schema({
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
            validator: function (v) {
                if (!v)
                    return true; // Optional field
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
}, {
    timestamps: true,
});
// Indexes for query performance (Requirement 5.2)
feedbackSchema.index({ status: 1 });
feedbackSchema.index({ category: 1 });
feedbackSchema.index({ ai_priority: 1 });
feedbackSchema.index({ createdAt: -1 });
// Compound indexes for common queries
feedbackSchema.index({ status: 1, createdAt: -1 });
feedbackSchema.index({ category: 1, status: 1 });
feedbackSchema.index({ ai_priority: 1, createdAt: -1 });
exports.default = mongoose_1.default.model("Feedback", feedbackSchema);
//# sourceMappingURL=Feedback.js.map