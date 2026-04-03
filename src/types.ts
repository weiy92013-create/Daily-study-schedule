export type TaskCategory = string;

export interface Task {
  id: string;
  category: TaskCategory;
  name: string;
  description: string;
  image?: string;
  frequency: '每天' | '仅当天' | '每周' | '周末';
  plannedDuration: number; // minutes
  actualDuration: number; // seconds
  pointsReward: number;
  pointsPenalty: number;
  pointsOverdue: number;
  completed: boolean;
  status: '进行中' | '计时完成' | '逾期完成' | '手动完成' | '未完成' | '未开始' | '已完成';
  createdAt: string;
}

export interface Reward {
  id: string;
  name: string;
  description?: string;
  image?: string;
  points: number;
  icon: string;
  color?: string;
}

export interface Medal {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  icon: string;
  color: string;
}

export interface GradeRecord {
  id: string;
  name: string; // e.g., "第五次考试"
  date: string;
  category: TaskCategory;
  score: number;
  totalScore: number;
  targetScore: number;
  averageScore: number;
  highestScore: number;
  rank?: string;
  academicYear: string; // e.g., "2024-2025"
  grade: string; // e.g., "三年级"
  semester: string; // e.g., "上学期"
  status: '学神' | '优秀' | '待提高';
}

export interface PointsHistory {
  id: string;
  date: string;
  type: 'gain' | 'loss' | 'redeem';
  amount: number;
  reason: string;
}

export interface AppState {
  totalPoints: number;
  tasks: Task[];
  rewards: Reward[];
  medals: Medal[];
  grades: GradeRecord[];
  pointsHistory: PointsHistory[];
  settings: {
    showStudyTime: boolean;
    showExerciseTime: boolean;
    showTaskCount: boolean;
    showCompletionRate: boolean;
    showCharts: boolean;
    showMedals: boolean;
    showGrades: boolean;
    showWishlist: boolean;
  };
  stats: {
    studyTime: number; // hours
    exerciseTime: number; // hours
    taskCount: number;
    completionRate: number;
  };
  dailyData: Record<string, Record<string, { completed: boolean; actualDuration: number; status: string }>>; // date -> taskId -> data
}
