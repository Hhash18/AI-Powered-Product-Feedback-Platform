import { GoogleGenerativeAI } from '@google/generative-ai';

interface AnalysisResult {
  category: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  summary: string;
}

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async analyzeAndCategorize(
    title: string,
    description: string,
    userCategory?: string
  ): Promise<AnalysisResult> {
    const categoryContext = userCategory
      ? `Note: The user has already categorized this as "${userCategory}". Use this context but still analyze if it fits better in another category.`
      : '';

    const prompt = `
    You are a product feedback analyst. Analyze the following feedback and provide:
    1. Category: One of [Bug, Feature Request, Improvement, Documentation, Performance, Other]
    2. Priority: One of [Low, Medium, High, Critical]
    3. Summary: A concise 1-2 sentence summary

    ${categoryContext}

    Feedback:
    Title: ${title}
    Description: ${description}

    Respond in JSON format ONLY with keys: category, priority, summary
    Example: {"category": "Feature Request", "priority": "High", "summary": "User wants..."}
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const responseText = result.response.text();

      // Extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      return {
        category: parsed.category || userCategory || 'Other',
        priority: parsed.priority || 'Medium',
        summary: parsed.summary || description.substring(0, 200),
      };
    } catch (error) {
      console.error('Error analyzing feedback with Gemini:', error);
      // Return user's selection or default values on error
      return {
        category: userCategory || 'Other',
        priority: 'Medium',
        summary: description.substring(0, 200),
      };
    }
  }

  async generateInsights(feedbackList: any[]): Promise<string> {
    if (feedbackList.length === 0) {
      return 'No feedback to analyze.';
    }

    const feedbackText = feedbackList
      .map((f) => `- [${f.category}] ${f.title}: ${f.description}`)
      .join('\n');

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
      console.error('Error generating insights:', error);
      return 'Unable to generate insights at this time.';
    }
  }
}

export const geminiService = new GeminiService();
