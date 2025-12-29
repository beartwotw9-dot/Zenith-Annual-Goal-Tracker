
import React from 'react';
import { YearStats } from '../types';
import { formatPercent } from '../utils';

interface DashboardProps {
  stats: YearStats;
}

const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  const items = [
    { label: '年底日', value: '12/31', sub: stats.year },
    { label: '更新日', value: stats.today, sub: 'Today' },
    { label: '已過天數', value: stats.daysElapsed, sub: 'Days' },
    { label: '還剩幾天', value: stats.daysRemaining, sub: 'Remaining' },
  ];

  return (
    <div className="bg-[#1e3a8a] text-white rounded-t-xl overflow-hidden shadow-xl">
      <div className="grid grid-cols-4 border-b border-blue-800">
        {items.map((item, idx) => (
          <div key={idx} className="border-r border-blue-800 p-4 text-center">
            <p className="text-[10px] uppercase tracking-widest text-blue-300 font-bold mb-1">{item.label}</p>
            <p className="text-xl font-black">{item.value}</p>
          </div>
        ))}
      </div>
      <div className="p-6 bg-blue-900 bg-opacity-40">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-bold text-blue-200">今年已過比例</span>
          <span className="text-3xl font-black text-white">{formatPercent(stats.yearProgress)}</span>
        </div>
        <div className="w-full bg-blue-950 rounded-full h-4 overflow-hidden border border-blue-800">
          <div 
            className="h-full bg-gradient-to-r from-blue-400 to-indigo-400 shadow-[0_0_15px_rgba(96,165,250,0.5)] transition-all duration-1000"
            style={{ width: `${stats.yearProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
