import { GoogleGenerativeAI } from "@google/generative-ai";

interface AnalysisResult {
    category: string;
    priority: "Low" | "Medium" | "High" | "Critical";
    sentiment: "Positive" | "Neutral" | "Negative";
    priorityScore: number; // 1-10
    summary: string;
    tags: string[];
}

export class GeminiService {
    private genAI: GoogleGenerativeAI | null;
    private model: any;
    private apiKeyAvailable: boolean;

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        this.apiKeyAvailable = !!apiKey;

        if (apiKey) {
            this.genAI = new GoogleGenerativeAI(apiKey);
            this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            console.log("✓ Gemini API initialized");
        } else {
            this.genAI = null;
            console.warn("⚠ GEMINI_API_KEY not set. Using fallback defaults for analysis.");
        }
    }

    async analyzeAndCategorize(title: string, description: string, userCategory?: string): Promise<AnalysisResult> {
        // Use fallback defaults if Gemini API is not available
        if (!this.apiKeyAvailable || !this.model) {
            console.warn('Using fallback analysis (no Gemini API)');
            const sentiment = description.toLowerCase().includes('not') || description.toLowerCase().includes('problem')
              ? 'Negative'
              : description.toLowerCase().includes('great') || description.toLowerCase().includes('love')
              ? 'Positive'
              : 'Neutral';

            return {
                category: userCategory || 'Other',
                priority: 'Medium',
                sentiment,
                priorityScore: 5,
                summary: description.substring(0, 200),
                tags: ['feedback', 'auto-analyzed'],
            };
        }

        const categoryContext = userCategory ? `Note: The user has already categorized this as "${userCategory}". Use this context but still analyze if it fits better in another category.` : "";

        const prompt = `
    You are a product feedback analyst. Analyze the following feedback and provide:
    1. category: One of [Bug, Feature Request, Improvement, Other]
    2. sentiment: One of [Positive, Neutral, Negative]
    3. priority_score: A number from 1 (low) to 10 (critical)
    4. summary: A concise 1-2 sentence summary
    5. tags: An array of 2-4 relevant tags/keywords as strings

    ${categoryContext}

    Feedback:
    Title: ${title}
    Description: ${description}

    Respond in VALID JSON format ONLY with these exact keys: category, sentiment, priority_score, summary, tags
    Example: {"category": "Feature Request", "sentiment": "Positive", "priority_score": 7, "summary": "User wants...", "tags": ["UI", "Performance"]}
    `;

        try {
            const result = await this.model.generateContent(prompt);
            const responseText = result.response.text();

            // Extract JSON from response
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error("No valid JSON found in response");
            }

            const parsed = JSON.parse(jsonMatch[0]);

            // Convert priority_score to priority level
            const getPriorityLevel = (score: number): "Low" | "Medium" | "High" | "Critical" => {
                if (score <= 3) return "Low";
                if (score <= 6) return "Medium";
                if (score <= 8) return "High";
                return "Critical";
            };

            return {
                category: parsed.category || userCategory || "Other",
                sentiment: parsed.sentiment || "Neutral",
                priority: getPriorityLevel(parsed.priority_score || 5),
                priorityScore: Math.max(1, Math.min(10, parsed.priority_score || 5)),
                summary: parsed.summary || description.substring(0, 200),
                tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 5) : [],
            };
        } catch (error) {
            console.error("Error analyzing feedback with Gemini:", error);
            // Return defaults on error - feedback still gets saved
            return {
                category: userCategory || "Other",
                sentiment: "Neutral",
                priority: "Medium",
                priorityScore: 5,
                summary: description.substring(0, 200),
                tags: [],
            };
        }
    }

    async generateInsights(feedbackList: any[]): Promise<string> {
        if (feedbackList.length === 0) {
            return "No feedback to analyze.";
        }

        // Use fallback if Gemini API is not available
        if (!this.apiKeyAvailable || !this.model) {
            console.warn('Using fallback insights (no Gemini API)');
            const categories = feedbackList.reduce((acc: any, f) => {
                acc[f.category] = (acc[f.category] || 0) + 1;
                return acc;
            }, {});

            const categoryList = Object.entries(categories)
                .map(([cat, count]) => `${cat}: ${count} feedback(s)`)
                .join(', ');

            return `Feedback Analysis Summary:\n- Total feedback: ${feedbackList.length}\n- Categories: ${categoryList}\n- Note: Full AI analysis unavailable without Gemini API key.`;
        }

        const feedbackText = feedbackList.map((f) => `- [${f.category}] ${f.title}: ${f.description}`).join("\n");

        const prompt = `
    Analyze the following product feedback and provide key insights:

    ${feedbackText}

    Provide a brief summary of:
    1. Main themes and patterns
    2. Most common categories and issues
    3. Highest priority items
    4. Top 3 recommendations for the product team

    Keep the response concise but actionable.
    `;

        try {
            const result = await this.model.generateContent(prompt);
            return result.response.text();
        } catch (error) {
            console.error("Error generating insights:", error);
            return "Unable to generate insights at this time.";
        }
    }
}

export const geminiService = new GeminiService();
