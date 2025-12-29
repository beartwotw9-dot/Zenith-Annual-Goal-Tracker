
import { GoogleGenAI, Type } from "@google/genai";
import { Goal, YearStats } from "./types";

export const getAICoachFeedback = async (goals: Goal[], stats: YearStats): Promise<string> => {
  // Initialize GoogleGenAI with the API key from environment variables directly as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const goalsSummary = goals.map(g => ({
    title: g.title,
    progress: ((g.actual / g.target) * 100).toFixed(1) + '%',
    status: g.actual >= g.target ? 'Done' : 'In Progress'
  }));

  const prompt = `
    Context: Annual Goal Tracking System.
    Year Progress: ${stats.yearProgress.toFixed(1)}%.
    Today is: ${stats.today}.
    Days Remaining: ${stats.daysRemaining}.

    User's Goals:
    ${JSON.stringify(goalsSummary, null, 2)}

    Task: Act as a high-performance executive coach. Analyze the user's progress. 
    1. Identify goals lagging behind the year progress.
    2. Provide 3 specific, actionable tips to boost efficiency.
    3. Use an encouraging, professional, and slightly motivating tone.
    4. Format in Markdown. Keep it concise.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
      }
    });
    // Use .text property to access the generated content as per SDK requirements
    return response.text || "I couldn't generate advice right now. Keep pushing towards your goals!";
  } catch (error) {
    console.error("AI Coach Error:", error);
    return "The AI Coach is taking a break. You're doing great—stay focused on your targets!";
  }
};
