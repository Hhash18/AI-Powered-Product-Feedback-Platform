interface AnalysisResult {
    category: string;
    priority: "Low" | "Medium" | "High" | "Critical";
    sentiment: "Positive" | "Neutral" | "Negative";
    priorityScore: number;
    summary: string;
    tags: string[];
}
export declare class GeminiService {
    private genAI;
    private model;
    private apiKeyAvailable;
    constructor();
    analyzeAndCategorize(title: string, description: string, userCategory?: string): Promise<AnalysisResult>;
    generateInsights(feedbackList: any[]): Promise<string>;
}
export declare const geminiService: GeminiService;
export {};
//# sourceMappingURL=gemini.service.d.ts.map