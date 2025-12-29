
import React from 'react';
import { 
  TrendingUp, 
  Heart, 
  Wallet, 
  Briefcase, 
  Users, 
  Grid,
  Zap,
  Flame,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { GoalCategory } from './types';

export const CATEGORY_ICONS: Record<GoalCategory, React.ReactNode> = {
  [GoalCategory.GROWTH]: <TrendingUp className="w-5 h-5 text-emerald-500" />,
  [GoalCategory.HEALTH]: <Heart className="w-5 h-5 text-rose-500" />,
  [GoalCategory.FINANCE]: <Wallet className="w-5 h-5 text-amber-500" />,
  [GoalCategory.CAREER]: <Briefcase className="w-5 h-5 text-blue-500" />,
  [GoalCategory.SOCIAL]: <Users className="w-5 h-5 text-purple-500" />,
  [GoalCategory.OTHER]: <Grid className="w-5 h-5 text-gray-500" />,
};

export const STORAGE_KEYS = {
  GOALS: 'zenith_goals',
  LOGS: 'zenith_logs'
};
