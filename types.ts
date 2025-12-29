
export enum GoalCategory {
  GROWTH = '成長輸入',
  HEALTH = '生活習慣',
  FINANCE = '財務管理',
  CAREER = '斜槓事業',
  SOCIAL = '社交生活',
  OTHER = '其他項目'
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  value: number;
}

export interface Goal {
  id: string;
  title: string;
  category: GoalCategory;
  krNumber: string; // 如 KR1, KR2
  target: number;
  actual: number;
  unit: string;
  description: string;
  logs: DailyLog[];
  createdAt: number;
}

export interface YearStats {
  today: string;
  todayISO: string;
  daysElapsed: number;
  daysRemaining: number;
  yearProgress: number;
  year: number;
}
