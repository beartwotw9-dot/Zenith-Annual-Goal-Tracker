
import React from 'react';
import { Goal, YearStats } from '../types';
import { CATEGORY_ICONS } from '../constants';
import { formatPercent, getEfficiencyStatus } from '../utils';
import { Edit2, Plus, Minus, Trash2 } from 'lucide-react';

interface GoalCardProps {
  goal: Goal;
  yearProgress: number;
  onUpdate: (id: string, delta: number) => void;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, yearProgress, onUpdate, onEdit, onDelete }) => {
  const achievementRate = (goal.actual / goal.target) * 100;
  const remaining = Math.max(0, goal.target - goal.actual);
  const efficiency = getEfficiencyStatus(achievementRate, yearProgress);

  const getProgressColor = () => {
    if (achievementRate >= 100) return 'bg-red-600';
    if (achievementRate >= 50) return 'bg-amber-600';
    return 'bg-gray-400';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full hover:shadow-md transition-shadow group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gray-50 rounded-lg">
            {CATEGORY_ICONS[goal.category]}
          </div>
          <div>
            <h3 className="font-bold text-gray-800 line-clamp-1">{goal.title}</h3>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{goal.category}</span>
          </div>
        </div>
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(goal)} className="p-1.5 hover:bg-gray-100 rounded-md text-gray-400 hover:text-blue-500">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={() => onDelete(goal.id)} className="p-1.5 hover:bg-gray-100 rounded-md text-gray-400 hover:text-rose-500">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-6 flex-grow italic line-clamp-2">
        {goal.description || '暫無具體描述...'}
      </p>

      <div className="grid grid-cols-3 gap-2 mb-6">
        <div className="text-center p-2 bg-gray-50 rounded-xl">
          <p className="text-[10px] text-gray-400 font-bold uppercase">目標</p>
          <p className="text-sm font-bold text-gray-700">{goal.target} <span className="text-[10px] font-normal">{goal.unit}</span></p>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded-xl">
          <p className="text-[10px] text-gray-400 font-bold uppercase">已執行</p>
          <p className="text-sm font-bold text-blue-600">{goal.actual} <span className="text-[10px] font-normal text-gray-400">{goal.unit}</span></p>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded-xl">
          <p className="text-[10px] text-gray-400 font-bold uppercase">剩餘</p>
          <p className="text-sm font-bold text-gray-700">{remaining} <span className="text-[10px] font-normal text-gray-400">{goal.unit}</span></p>
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <div className="flex justify-between items-center text-sm">
          <span className="font-bold text-gray-700">達成率: {formatPercent(achievementRate)} {achievementRate >= 100 && '🔥'}</span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-opacity-10 ${efficiency.color.replace('text', 'bg')} ${efficiency.color}`}>
            {efficiency.icon} {efficiency.label}
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
          <div 
            className={`h-full ${getProgressColor()} transition-all duration-700`}
            style={{ width: `${Math.min(100, achievementRate)}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
        <div className="flex items-center space-x-2">
           <button 
            onClick={() => onUpdate(goal.id, -1)}
            disabled={goal.actual <= 0}
            className="w-8 h-8 flex items-center justify-center bg-gray-50 text-gray-500 rounded-full hover:bg-gray-100 disabled:opacity-30 transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onUpdate(goal.id, 1)}
            className="w-8 h-8 flex items-center justify-center bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="text-[10px] text-gray-400 font-mono">
          REF: YEAR {yearProgress.toFixed(1)}%
        </div>
      </div>
    </div>
  );
};

export default GoalCard;
