
import React from 'react';
import { Goal } from '../types';
import { formatPercent, getEfficiencyStatus } from '../utils';
import { Check, Flame, MoreHorizontal, Lock } from 'lucide-react';

interface GoalRowProps {
  goal: Goal;
  yearProgress: number;
  monthDays: { iso: string, day: number, isWeekend: boolean }[];
  onLog: (goalId: string, date: string) => void;
  onEdit: (goal: Goal) => void;
  isViewMode?: boolean;
}

const GoalRow: React.FC<GoalRowProps> = ({ goal, yearProgress, monthDays, onLog, onEdit, isViewMode = false }) => {
  const achievementRate = (goal.actual / goal.target) * 100;
  const remaining = Math.max(0, goal.target - goal.actual);
  const efficiency = getEfficiencyStatus(achievementRate, yearProgress);

  const getBarColor = () => {
    if (achievementRate >= 100) return 'bg-red-600';
    if (achievementRate >= 50) return 'bg-slate-500';
    return 'bg-slate-300';
  };

  return (
    <div className={`grid grid-cols-[80px_200px_70px_70px_70px_70px_180px_1fr] items-stretch border-b border-gray-100 hover:bg-blue-50/40 transition-colors group bg-white`}>
      <div className="p-3 text-[10px] font-black text-slate-400 border-r border-gray-100 flex items-center justify-center text-center uppercase tracking-tighter">
        {goal.krNumber || 'KR'}
      </div>

      <div className={`p-3 border-r border-gray-100 flex items-center justify-between ${isViewMode ? 'cursor-default' : 'cursor-pointer'}`} onClick={() => !isViewMode && onEdit(goal)}>
        <div className="truncate">
          <p className={`text-xs font-black truncate ${!isViewMode ? 'text-slate-800 group-hover:text-blue-600' : 'text-slate-600'}`}>{goal.title}</p>
          <p className="text-[8px] text-slate-400 font-bold uppercase">{goal.category}</p>
        </div>
      </div>

      <div className="p-3 text-center border-r border-gray-100 text-[11px] font-bold text-slate-500 flex items-center justify-center font-mono">{goal.target}</div>
      <div className="p-3 text-center border-r border-gray-100 text-[11px] font-black text-blue-700 bg-blue-50/20 flex items-center justify-center font-mono">{goal.actual}</div>
      <div className="p-3 text-center border-r border-gray-100 text-[11px] font-bold text-slate-400 flex items-center justify-center font-mono">{remaining}</div>
      <div className={`p-3 text-center border-r border-gray-100 text-[11px] font-black flex items-center justify-center font-mono ${achievementRate >= 100 ? 'text-red-600' : 'text-slate-700'}`}>
        {Math.round(achievementRate)}%
      </div>

      <div className="p-3 border-r border-gray-100 flex items-center space-x-2">
        <div className="flex-grow bg-slate-100 h-5 rounded overflow-hidden relative border border-slate-200 shadow-inner">
          <div 
            className={`h-full ${getBarColor()} transition-all duration-1000 ease-out`} 
            style={{ width: `${Math.min(100, achievementRate)}%` }} 
          />
        </div>
        <span className="text-[10px]">{efficiency.icon}</span>
      </div>

      <div className="flex divide-x divide-gray-50 overflow-x-auto bg-slate-50/10">
        {monthDays.map(d => {
          const isLogged = goal.logs.some(l => l.date === d.iso);
          return (
            <button
              key={d.iso}
              disabled={isViewMode}
              onClick={() => onLog(goal.id, d.iso)}
              className={`flex-shrink-0 w-8 h-full flex items-center justify-center transition-all ${
                d.isWeekend ? 'bg-slate-100/50' : ''
              } ${isViewMode ? 'cursor-default' : 'hover:bg-blue-100 active:scale-90'}`}
            >
              {isLogged ? (
                <div className={`w-5 h-5 rounded-md flex items-center justify-center shadow-sm ${isViewMode ? 'bg-slate-400' : 'bg-blue-600'}`}>
                  <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                </div>
              ) : (
                <div className="w-4 h-4 border border-slate-200 rounded-sm" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default GoalRow;
