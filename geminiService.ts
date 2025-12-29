
import { GoogleGenAI, Type } from "@google/genai";
import { Goal, YearStats, GoalCategory } from "./types";

const MODEL_NAME = 'gemini-3-pro-preview';

export const getAICoachFeedback = async (goals: Goal[], stats: YearStats): Promise<string> => {
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
      model: MODEL_NAME,
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });
    return response.text || "我現在無法產生建議，請繼續努力！";
  } catch (error) {
    console.error("AI Coach Error:", error);
    return "AI 教練目前休息中。你做得很好，請繼續保持專注！";
  }
};

export const generateGoalsFromVision = async (vision: string): Promise<Partial<Goal>[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    你是一位專業的個人戰略顧問。請根據使用者的 2026 年願景，將其拆解為 4 到 6 個具體的「關鍵成果 (Key Results, KR)」。
    
    使用者願景： "${vision}"
    
    規則：
    1. 每個 KR 必須是可量化的 (SMART 原則)。
    2. 必須分類到以下分類中：${Object.values(GoalCategory).join(', ')}。
    3. KR 編號請以 KR1, KR2... 依序排列。
    4. 設定合理的年度目標量 (target) 與單位 (unit)。
    5. 提供一段具體的行動描述 (description)，說明如何達成該目標。
    
    請以 JSON 格式回傳。
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              category: { type: Type.STRING, enum: Object.values(GoalCategory) },
              krNumber: { type: Type.STRING },
              target: { type: Type.NUMBER },
              unit: { type: Type.STRING },
              description: { type: Type.STRING }
            },
            required: ["title", "category", "krNumber", "target", "unit", "description"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text);
  } catch (error) {
    console.error("Plan Generation Error:", error);
    throw error;
  }
};
