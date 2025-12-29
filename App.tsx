
import React, { useState, useEffect, useMemo } from 'react';
import { Target, Plus, Download, Upload, RefreshCw, Share2, Lock, Save, ArrowLeft, Zap } from 'lucide-react';
import { Goal, GoalCategory, YearStats } from './types';
import { STORAGE_KEYS } from './constants';
import { getYearStats, getDaysInMonth, decodeDataFromUrl } from './utils';
import Dashboard from './components/Dashboard';
import GoalRow from './components/GoalRow';
import GoalModal from './components/GoalModal';
import ShareModal from './components/ShareModal';
import AICoachPanel from './components/AICoachPanel';

const TARGET_YEAR = 2026;

const App: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [stats, setStats] = useState<YearStats>(() => getYearStats(TARGET_YEAR));
  const [selectedMonth, setSelectedMonth] = useState(() => new Date().getMonth());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');
  const [isViewMode, setIsViewMode] = useState(false); 
  
  const yearKey = `${STORAGE_KEYS.GOALS}_${TARGET_YEAR}`;
  const monthDays = useMemo(() => getDaysInMonth(TARGET_YEAR, selectedMonth), [selectedMonth]);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#data=')) {
      const base64 = hash.replace('#data=', '');
      const importedData = decodeDataFromUrl(base64);
      if (importedData) {
        setGoals(importedData);
        setIsViewMode(true);
        return;
      }
    }

    const saved = localStorage.getItem(yearKey);
    let initialData: Goal[] = [];
    
    if (saved) {
      try {
        initialData = JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse local storage", e);
      }
    }
    
    if (initialData.length === 0) {
      initialData = [
        {
          id: '1', title: '2026 數位轉型計畫', category: GoalCategory.CAREER, krNumber: 'KR1',
          target: 100, actual: 0, unit: '次', description: '包含 100 篇專業內容發佈',
          logs: [], createdAt: Date.now()
        },
        {
          id: '2', title: '全年度健康跑', category: GoalCategory.HEALTH, krNumber: 'KR5',
          target: 200, actual: 0, unit: '天', description: '每次 5 公里',
          logs: [], createdAt: Date.now()
        }
      ];
    }
    setGoals(initialData);
  }, [yearKey]);

  const saveGoals = (newGoals: Goal[]) => {
    if (isViewMode) return;
    setSaveStatus('saving');
    setGoals(newGoals);
    localStorage.setItem(yearKey, JSON.stringify(newGoals));
    setTimeout(() => setSaveStatus('saved'), 500);
  };

  const handleImportToMine = () => {
    if (window.confirm('確定要將此計畫模板匯入為您的正式計畫嗎？這將會覆蓋您目前的本地資料。')) {
      localStorage.setItem(yearKey, JSON.stringify(goals));
      setIsViewMode(false);
      window.history.replaceState(null, "", window.location.pathname);
      alert('匯入成功！現在這是屬於您的計畫了，開始行動吧！');
    }
  };

  const handleExitPreview = () => {
    window.location.hash = "";
    window.location.reload();
  };

  const handleLog = (goalId: string, date: string) => {
    if (isViewMode) return;
    const updated = goals.map(g => {
      if (g.id !== goalId) return g;
      const existingIdx = g.logs.findIndex(l => l.date === date);
      let newLogs = [...g.logs];
      let newActual = g.actual;

      if (existingIdx > -1) {
        newLogs.splice(existingIdx, 1);
        newActual -= 1;
      } else {
        newLogs.push({ date, value: 1 });
        newActual += 1;
      }
      return { ...g, logs: newLogs, actual: newActual };
    });
    saveGoals(updated);
  };

  const handleExport = () => {
    const data = JSON.stringify(goals, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Zenith_2026_Backup.json`;
    a.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          saveGoals(imported);
          alert('匯入成功');
        }
      } catch (err) {
        alert('格式錯誤');
      }
    };
    reader.readAsText(file);
  };

  const handleSaveGoal = (data: Partial<Goal>) => {
    if (isViewMode) return;
    if (editingGoal) {
      saveGoals(goals.map(g => g.id === editingGoal.id ? { ...g, ...data } as Goal : g));
    } else {
      const newGoal: Goal = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        actual: data.actual || 0,
        logs: [],
        createdAt: Date.now()
      } as Goal;
      saveGoals([newGoal, ...goals]);
    }
    setIsModalOpen(false);
    setEditingGoal(null);
  };

  return (
    <div className="h-full flex flex-col font-sans select-none overflow-hidden bg-[#f8fafc]">
      {/* 唯讀模式 Banner */}
      {isViewMode && (
        <div className="bg-blue-600 text-white px-4 py-2.5 flex items-center justify-between text-[11px] font-black uppercase tracking-wider z-[60] shadow-lg">
          <div className="flex items-center space-x-2">
            <Zap className="w-3.5 h-3.5 fill-current text-yellow-300" />
            <span>正在查看他人分享的年度模板</span>
          </div>
          <div className="flex items-center space-x-3">
            <button onClick={handleExitPreview} className="hover:underline opacity-70">
              返回我的計畫
            </button>
            <button onClick={handleImportToMine} className="bg-white text-blue-600 px-4 py-1 rounded-full shadow-md flex items-center space-x-1.5 hover:bg-blue-50 transition-colors">
              <Save className="w-3 h-3" />
              <span>匯入為我的 2026 計畫</span>
            </button>
          </div>
        </div>
      )}

      <header className="bg-[#0f172a] text-white px-6 h-14 flex items-center justify-between sticky top-0 z-50 shrink-0 shadow-2xl">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-600 p-1.5 rounded-lg shadow-inner"><Target className="text-white w-5 h-5" /></div>
          <div>
            <h1 className="text-sm font-black tracking-tighter uppercase">Zenith 2026</h1>
            {!isViewMode && (
              <div className="flex items-center space-x-1.5 text-[9px] font-bold">
                <span className={`w-1.5 h-1.5 rounded-full ${saveStatus === 'saved' ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`}></span>
                <span className="text-slate-400 uppercase tracking-widest">{saveStatus === 'saved' ? 'Synced' : 'Syncing...'}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {!isViewMode && (
            <button 
              onClick={() => setIsShareModalOpen(true)} 
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-blue-900/40 transition-all active:scale-95"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden xs:inline">分享模板</span>
            </button>
          )}
          {!isViewMode && (
            <>
              <div className="hidden sm:flex items-center bg-white/5 rounded-lg p-0.5 border border-white/10 mx-2">
                 <button onClick={handleExport} title="備份資料" className="p-2 hover:bg-white/10 rounded-md transition-colors"><Download className="w-4 h-4 text-slate-300" /></button>
                 <label title="匯入備份" className="p-2 hover:bg-white/10 rounded-md transition-colors cursor-pointer">
                    <Upload className="w-4 h-4 text-slate-300" />
                    <input type="file" className="hidden" onChange={handleImport} accept=".json" />
                 </label>
              </div>
              <button onClick={() => { setEditingGoal(null); setIsModalOpen(true); }} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-xl text-xs font-black flex items-center space-x-2 transition-all">
                <Plus className="w-4 h-4" />
                <span className="hidden xs:inline">新增</span>
              </button>
            </>
          )}
        </div>
      </header>

      <main className="flex-grow overflow-y-auto px-4 py-6 sm:px-6">
        <div className="max-w-[1600px] mx-auto space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Dashboard stats={stats} />
              <div className="mt-4 bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Today Check-in</p>
                  <p className="text-sm font-black text-gray-800">{stats.todayISO}</p>
                </div>
                <div className="flex -space-x-1.5">
                   {goals.slice(0, 4).map(g => (
                     <button 
                        key={g.id} 
                        onClick={() => handleLog(g.id, stats.todayISO)} 
                        disabled={isViewMode}
                        className={`w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-black shadow-sm transition-all ${!isViewMode ? 'active:scale-90 hover:border-blue-200' : 'cursor-default'} ${g.logs.some(l => l.date === stats.todayISO) ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                       {g.krNumber.substring(0, 3)}
                     </button>
                   ))}
                </div>
              </div>
            </div>
            <div className="lg:col-span-2"><AICoachPanel goals={goals} stats={stats} /></div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex flex-col">
            <div className="grid grid-cols-[80px_200px_70px_70px_70px_70px_180px_1fr] bg-slate-800 text-white text-[10px] font-black uppercase sticky top-0 z-30 shadow-lg">
              <div className="p-3 border-r border-slate-700 flex items-center justify-center">KR</div>
              <div className="p-3 border-r border-slate-700 flex items-center justify-center text-blue-300">項目內容</div>
              <div className="p-3 border-r border-slate-700 flex items-center justify-center">目標</div>
              <div className="p-3 border-r border-slate-700 flex items-center justify-center">累積</div>
              <div className="p-3 border-r border-slate-700 flex items-center justify-center">剩餘</div>
              <div className="p-3 border-r border-slate-700 flex items-center justify-center text-emerald-400">％</div>
              <div className="p-3 border-r border-slate-700 flex items-center justify-center">年度視覺</div>
              <div className="flex overflow-hidden">
                {monthDays.map(d => (
                  <div key={d.iso} className={`flex-shrink-0 w-8 border-r border-slate-700 flex flex-col items-center justify-center py-1.5 ${d.isWeekend ? 'bg-slate-700' : ''}`}>
                    <span className="opacity-50 text-[7px] font-bold">{d.weekDay}</span>
                    <span className="text-[10px]">{d.day}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto custom-scrollbar">
              {goals.map(goal => (
                <GoalRow 
                  key={goal.id}
                  goal={goal}
                  yearProgress={stats.yearProgress}
                  monthDays={monthDays}
                  onLog={handleLog}
                  onEdit={(g) => { if(!isViewMode) { setEditingGoal(g); setIsModalOpen(true); } }}
                  isViewMode={isViewMode}
                />
              ))}
              {goals.length === 0 && (
                <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                  No goals defined yet. Click share to see templates!
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 h-12 flex items-center shrink-0 px-2 overflow-x-auto z-50">
        <div className="flex items-center space-x-1 p-1">
           {[...Array(12)].map((_, i) => (
             <button key={i} onClick={() => setSelectedMonth(i)} className={`px-4 py-1.5 text-[11px] font-black rounded-lg transition-all whitespace-nowrap ${selectedMonth === i ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-500 hover:bg-slate-100'}`}>
               {i + 1}月
             </button>
           ))}
        </div>
        <div className="ml-auto hidden sm:flex items-center space-x-2 px-6 border-l border-gray-100 text-[9px] font-black text-slate-400 uppercase tracking-widest">
           <span>Zenith OS v1.3</span>
           <RefreshCw className="w-3 h-3" />
        </div>
      </footer>

      <GoalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveGoal} editingGoal={editingGoal} />
      <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} currentGoals={goals} />
    </div>
  );
};

export default App;
