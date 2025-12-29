
import React, { useState } from 'react';
import { Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { getAICoachFeedback } from '../geminiService';
import { Goal, YearStats } from '../types';

interface AICoachPanelProps {
  goals: Goal[];
  stats: YearStats;
}

const AICoachPanel: React.FC<AICoachPanelProps> = ({ goals, stats }) => {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleConsult = async () => {
    if (goals.length === 0) return;
    setIsLoading(true);
    const result = await getAICoachFeedback(goals, stats);
    setFeedback(result);
    setIsLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-6 text-white shadow-2xl overflow-hidden relative mb-12">
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <Sparkles className="w-32 h-32" />
      </div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-500 bg-opacity-20 p-2 rounded-xl border border-indigo-400 border-opacity-30">
              <Sparkles className="w-6 h-6 text-indigo-300" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Zenith AI 教練</h2>
              <p className="text-xs text-indigo-300">基於 Gemini 3 的進度分析與建議</p>
            </div>
          </div>
          {feedback && !isLoading && (
            <button 
              onClick={handleConsult}
              className="p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors"
            >
              <RefreshCw className="w-5 h-5 text-indigo-200" />
            </button>
          )}
        </div>

        {!feedback && !isLoading ? (
          <div className="text-center py-8">
            <p className="text-indigo-200 mb-6">你的年度進度目前為 {stats.yearProgress.toFixed(1)}%。<br/>讓 AI 幫你分析哪些目標需要加把勁？</p>
            <button 
              onClick={handleConsult}
              className="bg-white text-indigo-900 px-8 py-3 rounded-2xl font-bold hover:bg-indigo-50 transition-colors shadow-xl"
            >
              獲取 AI 教練建議
            </button>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-300 mb-4" />
            <p className="text-indigo-200 animate-pulse">正在分析目標與數據中...</p>
          </div>
        ) : (
          <div className="bg-white bg-opacity-5 rounded-2xl p-5 border border-white border-opacity-10 backdrop-blur-sm prose prose-invert max-w-none">
            <div className="text-sm leading-relaxed text-indigo-50 whitespace-pre-wrap">
              {feedback}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AICoachPanel;
