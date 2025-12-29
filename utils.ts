
import { YearStats, Goal } from './types';

export const getYearStats = (targetYear: number = 2026): YearStats => {
  const now = new Date();
  const year = targetYear;
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);
  const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  let elapsed = 0;
  if (now.getFullYear() === year) {
    elapsed = Math.ceil((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  } else if (now.getFullYear() > year) {
    elapsed = totalDays;
  }

  return {
    today: now.toLocaleDateString('zh-TW', { month: '2-digit', day: '2-digit' }),
    todayISO: now.toISOString().split('T')[0],
    daysElapsed: Math.max(0, elapsed),
    daysRemaining: Math.max(0, totalDays - elapsed),
    yearProgress: Math.min(100, (Math.max(0, elapsed) / totalDays) * 100),
    year
  };
};

export const formatPercent = (val: number) => `${val.toFixed(1)}%`;

export const getEfficiencyStatus = (achievementRate: number, yearProgress: number) => {
  if (achievementRate >= 100) return { label: '超標', color: 'text-red-600', icon: '🔥', bg: 'bg-red-50' };
  if (yearProgress <= 0) return { label: '準備中', color: 'text-slate-400', icon: '⏳', bg: 'bg-slate-50' };
  
  const diff = achievementRate - yearProgress;
  if (diff >= 5) return { label: '領先', color: 'text-emerald-600', icon: '🚀', bg: 'bg-emerald-50' };
  if (diff <= -5) return { label: '落後', color: 'text-amber-600', icon: '⚠️', bg: 'bg-amber-50' };
  return { label: '正常', color: 'text-blue-600', icon: '✅', bg: 'bg-blue-50' };
};

export const getDaysInMonth = (year: number, month: number) => {
  const date = new Date(year, month, 1);
  const days = [];
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  
  while (date.getMonth() === month) {
    const iso = date.toISOString().split('T')[0];
    const d = date.getDay();
    days.push({
      iso,
      day: date.getDate(),
      weekDay: weekDays[d],
      isWeekend: d === 0 || d === 6
    });
    date.setDate(date.getDate() + 1);
  }
  return days;
};

/**
 * 壓縮數據：移除冗餘欄位以縮短 URL 長度
 */
const compressGoals = (goals: Goal[]): any[] => {
  return goals.map(g => ({
    i: g.id,
    t: g.title,
    c: g.category,
    k: g.krNumber,
    tg: g.target,
    a: g.actual,
    u: g.unit,
    l: g.logs.map(log => ({ d: log.date, v: log.value }))
  }));
};

/**
 * 解壓縮數據
 */
const decompressGoals = (data: any[]): Goal[] => {
  return data.map(g => ({
    id: g.i,
    title: g.t,
    category: g.c,
    krNumber: g.k,
    target: g.tg,
    actual: g.a,
    unit: g.u,
    description: '', // 同步時省略描述
    logs: g.l.map((log: any) => ({ date: log.d, value: log.v })),
    createdAt: Date.now()
  }));
};

/**
 * 編碼為 URL-Safe Base64
 */
export const encodeDataForUrl = (goals: Goal[]): string => {
  try {
    const compressed = compressGoals(goals);
    const json = JSON.stringify(compressed);
    const utf8Bytes = new TextEncoder().encode(json);
    let binary = '';
    utf8Bytes.forEach(b => binary += String.fromCharCode(b));
    return btoa(binary)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  } catch (e) {
    console.error('Encode Error:', e);
    return "";
  }
};

/**
 * 從 URL-Safe Base64 解碼
 */
export const decodeDataFromUrl = (base64: string): Goal[] | null => {
  try {
    // 補回被移除的 '='
    let padding = '';
    const mod = base64.length % 4;
    if (mod > 0) padding = '='.repeat(4 - mod);
    
    const standardBase64 = base64
      .replace(/-/g, '+')
      .replace(/_/g, '/') + padding;
      
    const binary = atob(standardBase64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    
    const json = new TextDecoder().decode(bytes);
    const data = JSON.parse(json);
    return decompressGoals(data);
  } catch (e) {
    console.error('Decode Error:', e);
    return null;
  }
};
