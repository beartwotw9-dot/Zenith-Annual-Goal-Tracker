
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Goal, GoalCategory } from '../types';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goal: Partial<Goal>) => void;
  editingGoal?: Goal | null;
}

const GoalModal: React.FC<GoalModalProps> = ({ isOpen, onClose, onSave, editingGoal }) => {
  const [formData, setFormData] = useState<Partial<Goal>>({
    title: '',
    category: GoalCategory.GROWTH,
    krNumber: 'KR1',
    target: 0,
    actual: 0,
    unit: '次',
    description: ''
  });

  useEffect(() => {
    if (editingGoal) {
      setFormData(editingGoal);
    } else {
      setFormData({
        title: '',
        category: GoalCategory.GROWTH,
        krNumber: 'KR1',
        target: 0,
        actual: 0,
        unit: '次',
        description: ''
      });
    }
  }, [editingGoal, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-black text-slate-800">{editingGoal ? '編輯指標' : '新增年度指標'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-gray-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form className="p-6 space-y-4" onSubmit={(e) => { e.preventDefault(); onSave(formData); }}>
          <div className="grid grid-cols-4 gap-3">
             <div className="col-span-1">
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">KR 編號</label>
                <input 
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold bg-blue-50 text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.krNumber}
                  onChange={(e) => setFormData({...formData, krNumber: e.target.value})}
                />
             </div>
             <div className="col-span-3">
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">目標名稱</label>
                <input 
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="例如：100 支短影音"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
             </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">分類標籤</label>
              <select 
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value as GoalCategory})}
              >
                {Object.values(GoalCategory).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">計算單位</label>
              <input 
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"
                placeholder="次、天、本..."
                value={formData.unit}
                onChange={(e) => setFormData({...formData, unit: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">年度目標量</label>
              <input 
                type="number"
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold focus:outline-none"
                value={formData.target}
                onChange={(e) => setFormData({...formData, target: Number(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">初始進度 (選填)</label>
              <input 
                type="number"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"
                value={formData.actual}
                onChange={(e) => setFormData({...formData, actual: Number(e.target.value)})}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">具體行動描述</label>
            <textarea 
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none"
              placeholder="如何才算完成一次？"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3 rounded-lg transition-all shadow-lg shadow-blue-100 mt-2 uppercase tracking-widest text-xs"
          >
            {editingGoal ? 'UPDATE METRIC' : 'CREATE METRIC'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GoalModal;
