
import React, { useState } from 'react';
import { X, Wand2, Loader2, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';
import { Goal, GoalCategory } from '../types';
import { generateGoalsFromVision } from '../geminiService';
import { CATEGORY_ICONS } from '../constants';

interface PlanGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (newGoals: Partial<Goal>[]) => void;
}

const PlanGeneratorModal: React.FC<PlanGeneratorModalProps> = ({ isOpen, onClose, onApply }) => {
  const [vision, setVision] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewGoals, setPreviewGoals] = useState<Partial<Goal>[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!vision.trim()) return;
    setIsGenerating(true);
    setError(null);
    try {
      const result = await generateGoalsFromVision(vision);
      setPreviewGoals(result);
    } catch (err) {
      setError("AI 策略生成失敗，請檢查網路或稍後再試。");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
          <div className="flex items-center space-x-2">
            <Wand2 className="w-5 h-5" />
            <h2 className="text-lg font-black uppercase tracking-tight">AI 2026 戰略生成器</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto">
          {previewGoals.length === 0 ? (
            <div className="space-y-6">
              <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl">
                <h3 className="text-indigo-900 font-bold mb-2 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2" />
                  輸入你的 2026 願景咒語
                </h3>
                <p className="text-sm text-indigo-700/70 mb-4">
                  描述你希望在 2026 年達成的狀態，AI 會為你拆解成具體的關鍵指標 (KR)。
                </p>
                <textarea 
                  value={vision}
                  onChange={(e) => setVision(e.target.value)}
                  placeholder="例如：我希望在 2026 年成為一名成功的數位遊牧民族，月收入超過 10 萬，並跑完人生第一場馬拉松..."
                  className="w-full h-32 p-4 rounded-xl border-2 border-indigo-200 focus:border-indigo-500 focus:ring-0 resize-none text-slate-800 placeholder-slate-300 transition-all"
                />
              </div>

              {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}

              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !vision.trim()}
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-200 flex items-center justify-center space-x-2 disabled:opacity-50 transition-all active:scale-[0.98]"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>正在構思您的 2026 藍圖...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    <span>生成個人化戰略</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-slate-800 font-black">AI 為您規劃的 KR 指標</h3>
                <button onClick={() => setPreviewGoals([])} className="text-xs font-bold text-indigo-600 hover:underline">重新輸入願景</button>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {previewGoals.map((goal, idx) => (
                  <div key={idx} className="border border-slate-100 bg-slate-50 p-4 rounded-xl flex items-start space-x-4">
                    <div className="bg-white p-2 rounded-lg shadow-sm shrink-0">
                      {CATEGORY_ICONS[goal.category as GoalCategory]}
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-black text-indigo-500 uppercase">{goal.krNumber}</span>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-200/50 px-2 py-0.5 rounded-full">{goal.category}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-800">{goal.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{goal.description}</p>
                      <div className="mt-2 text-[11px] font-black text-slate-400">
                        目標：{goal.target} {goal.unit}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex space-x-3 pt-4">
                <button 
                  onClick={() => setPreviewGoals([])}
                  className="flex-1 py-4 border-2 border-slate-100 text-slate-400 font-bold rounded-2xl hover:bg-slate-50 transition-colors"
                >
                  捨棄
                </button>
                <button 
                  onClick={() => onApply(previewGoals)}
                  className="flex-[2] py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-100 flex items-center justify-center space-x-2 transition-all active:scale-[0.98]"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>匯入我的 2026 計畫</span>
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-center space-x-2">
           <div className="flex items-center space-x-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <span>Powered by Gemini 3 Pro Strategic Engine</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PlanGeneratorModal;
