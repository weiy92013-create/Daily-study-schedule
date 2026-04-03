import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  CheckCircle2, 
  Circle, 
  Gift, 
  Layout, 
  Plus, 
  Settings2 as Settings, 
  Trash2, 
  Edit3, 
  Star,
  Trophy,
  Coffee,
  Trees,
  Gamepad2,
  Package,
  Clock,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  PieChart as PieChartIcon,
  Award,
  TrendingUp,
  MoreHorizontal,
  X,
  Timer,
  BookOpen,
  Dumbbell,
  Calculator,
  FlaskConical,
  MoreVertical,
  Image as ImageIcon
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { Task, Reward, Medal, GradeRecord, AppState, TaskCategory } from './types';
import { cn } from './lib/utils';

const STORAGE_KEY = 'yuanyuan_study_plan_v2';
const START_DATE = '2026-04-03';

const CATEGORY_COLORS: Record<string, string> = {
  '语文': '#E74C3C',
  '数学': '#2980B9',
  '英语': '#F39C12',
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  '语文': <BookOpen className="w-4 h-4" />,
  '数学': <Calculator className="w-4 h-4" />,
  '英语': <BookOpen className="w-4 h-4" />,
};

const DEFAULT_REWARDS: Reward[] = [
  { id: '1', name: '自由活动时间', points: 200, icon: 'Gamepad2', color: '#6C5CE7' },
  { id: '2', name: '小零食', points: 200, icon: 'Coffee', color: '#FF6B6B' },
  { id: '3', name: '户外活动', points: 200, icon: 'Trees', color: '#FF9F43' },
  { id: '4', name: '零食大礼包', points: 500, icon: 'Package', color: '#4834D4' },
];

const DEFAULT_MEDALS: Medal[] = [
  { id: '1', name: '时间小新芽', description: '学习时间累计超50小时，学习之路刚刚萌芽！', unlocked: true, icon: 'Star', color: '#27AE60' },
  { id: '2', name: '知识探险家', description: '学习时间累计超80小时，希望你继续探险！', unlocked: true, icon: 'Compass', color: '#2980B9' },
  { id: '3', name: '智慧萤火虫', description: '学习时间累计超100小时，希望你如萤火虫般闪耀！', unlocked: true, icon: 'Zap', color: '#F1C40F' },
  { id: '4', name: '星空小学霸', description: '学习时间累计超150小时，希望你像星星一样闪耀！', unlocked: true, icon: 'Star', color: '#8E44AD' },
  { id: '5', name: '永恒时间大师', description: '学习时间累计超200小时，你是跨越时间的卓越者！', unlocked: false, icon: 'Clock', color: '#E67E22' },
  { id: '6', name: '活力小太阳', description: '总运动时间达到5小时，如太阳般充满能量！', unlocked: true, icon: 'Sun', color: '#E67E22' },
  { id: '7', name: '疾风小猎豹', description: '总运动时间达到20小时，速度与活力的象征！', unlocked: true, icon: 'Zap', color: '#9B59B6' },
  { id: '8', name: '全勤奖', description: '当月任务完成率100%，你是自律的榜样！', unlocked: true, icon: 'CheckCircle2', color: '#FF4757' },
];

const ACADEMIC_YEARS = [
  '2024-2025', '2025-2026', '2026-2027', '2027-2028', 
  '2028-2029', '2029-2030', '2030-2031', '2031-2032', 
  '2032-2033', '2033-2034', '2034-2035'
];
const GRADES = ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '初一', '初二', '初三'];
const SEMESTERS = ['上学期', '下学期'];
const SUBJECTS = ['语文', '数学', '英语'];

const INITIAL_TASKS: Task[] = [
  { id: '1', category: '语文', name: '小古文240句', description: '内容：背诵，看百度网盘常青藤爸爸讲解', frequency: '每天', plannedDuration: 30, actualDuration: 0, pointsReward: 2, pointsPenalty: -2, pointsOverdue: 1, completed: false, status: '未开始', createdAt: START_DATE },
  { id: '2', category: '语文', name: '月亮老师课程', description: '内容：看爱问云精读课+看书', frequency: '每天', plannedDuration: 45, actualDuration: 0, pointsReward: 3, pointsPenalty: -3, pointsOverdue: 1, completed: false, status: '未开始', createdAt: START_DATE },
  { id: '3', category: '语文', name: '默写三张表', description: '内容：默写语文书后面的三张表，每日10分钟', frequency: '每天', plannedDuration: 10, actualDuration: 0, pointsReward: 2, pointsPenalty: -2, pointsOverdue: 1, completed: false, status: '未开始', createdAt: START_DATE },
  { id: '4', category: '数学', name: '预习教材帮', description: '内容：预习教材帮相关章节', frequency: '每天', plannedDuration: 20, actualDuration: 0, pointsReward: 2, pointsPenalty: -2, pointsOverdue: 1, completed: false, status: '未开始', createdAt: START_DATE },
  { id: '5', category: '数学', name: '练习实验班', description: '内容：完成实验班练习题', frequency: '每天', plannedDuration: 30, actualDuration: 0, pointsReward: 2, pointsPenalty: -2, pointsOverdue: 1, completed: false, status: '未开始', createdAt: START_DATE },
  { id: '6', category: '数学', name: '练习帮', description: '内容：完成练习帮相关题目', frequency: '每天', plannedDuration: 20, actualDuration: 0, pointsReward: 2, pointsPenalty: -2, pointsOverdue: 1, completed: false, status: '未开始', createdAt: START_DATE },
  { id: '7', category: '英语', name: '听读D级', description: '内容：每日听读D级课文', frequency: '每天', plannedDuration: 20, actualDuration: 0, pointsReward: 2, pointsPenalty: -2, pointsOverdue: 1, completed: false, status: '未开始', createdAt: START_DATE },
  { id: '8', category: '英语', name: 'raz quiz', description: '内容：完成raz quiz测试', frequency: '每天', plannedDuration: 15, actualDuration: 0, pointsReward: 2, pointsPenalty: -2, pointsOverdue: 1, completed: false, status: '未开始', createdAt: START_DATE },
  { id: '9', category: '英语', name: '万词王', description: '内容：万词王单词打卡', frequency: '每天', plannedDuration: 15, actualDuration: 0, pointsReward: 2, pointsPenalty: -2, pointsOverdue: 1, completed: false, status: '未开始', createdAt: START_DATE },
  { id: '10', category: '数学', name: '数学改错日', description: '内容：固定数学改错', frequency: '周末', plannedDuration: 60, actualDuration: 0, pointsReward: 5, pointsPenalty: -5, pointsOverdue: 2, completed: false, status: '未开始', createdAt: START_DATE },
  { id: '11', category: '英语', name: '英语听力', description: '内容：英语听英语3小时', frequency: '周末', plannedDuration: 180, actualDuration: 0, pointsReward: 10, pointsPenalty: -10, pointsOverdue: 5, completed: false, status: '未开始', createdAt: START_DATE },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'daily' | 'stats' | 'medals' | 'grades' | 'rewards'>('daily');
  const [selectedDate, setSelectedDate] = useState(START_DATE);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const defaultState: AppState = {
      totalPoints: 200,
      tasks: INITIAL_TASKS,
      rewards: DEFAULT_REWARDS,
      medals: DEFAULT_MEDALS,
      grades: [],
      pointsHistory: [],
      settings: {
        showStudyTime: true,
        showExerciseTime: true,
        showTaskCount: true,
        showCompletionRate: true,
        showCharts: true,
        showMedals: true,
        showGrades: true,
        showWishlist: true,
      },
      stats: {
        studyTime: 5.3,
        exerciseTime: 0.0,
        taskCount: 9,
        completionRate: 100,
      },
      dailyData: {}
    };

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...defaultState,
          ...parsed,
          dailyData: parsed.dailyData || {},
          settings: {
            ...defaultState.settings,
            ...(parsed.settings || {})
          },
          stats: {
            ...defaultState.stats,
            ...(parsed.stats || {})
          }
        };
      } catch (e) {
        console.error("Failed to parse saved state", e);
        return defaultState;
      }
    }
    return defaultState;
  });

  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isAddingReward, setIsAddingReward] = useState(false);
  const [isAddingMedal, setIsAddingMedal] = useState(false);
  const [isAddingGrade, setIsAddingGrade] = useState(false);
  const [isAnalyzingGrades, setIsAnalyzingGrades] = useState(false);
  const [isShowingSettings, setIsShowingSettings] = useState(false);
  const [isShowingPointsHistory, setIsShowingPointsHistory] = useState(false);
  const [editingItem, setEditingItem] = useState<{ type: 'task' | 'reward' | 'medal' | 'grade', data: any } | null>(null);
  const [taskForm, setTaskForm] = useState<Partial<Task>>({});
  const [rewardForm, setRewardForm] = useState<Partial<Reward>>({});
  const [medalForm, setMedalForm] = useState<Partial<Medal>>({});
  const [gradeForm, setGradeForm] = useState<Partial<GradeRecord>>({});
  const [gradeFilters, setGradeFilters] = useState({
    academicYear: '全部',
    grade: '全部',
    semester: '全部',
    category: '全部'
  });
  const dateInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingItem) {
      if (editingItem.type === 'task') setTaskForm(editingItem.data);
      if (editingItem.type === 'reward') setRewardForm(editingItem.data);
      if (editingItem.type === 'medal') setMedalForm(editingItem.data);
      if (editingItem.type === 'grade') setGradeForm(editingItem.data);
    } else {
      if (isAddingTask) {
        setTaskForm({
          category: '语文',
          name: '',
          description: '',
          frequency: '每天',
          plannedDuration: 30,
          pointsReward: 2,
          pointsPenalty: -2,
        });
      }
      if (isAddingReward) {
        setRewardForm({
          name: '',
          points: 100,
          icon: 'Gift',
          color: '#4B79A1',
        });
      }
      if (isAddingMedal) {
        setMedalForm({
          name: '',
          description: '',
          unlocked: false,
          icon: 'Award',
          color: '#F1C40F',
        });
      }
      if (isAddingGrade) {
        setGradeForm({
          name: '',
          date: new Date().toISOString().split('T')[0],
          category: '语文',
          score: 0,
          totalScore: 100,
          targetScore: 95,
          averageScore: 80,
          highestScore: 100,
          academicYear: ACADEMIC_YEARS[0],
          grade: GRADES[0],
          semester: SEMESTERS[0],
          status: '优秀'
        });
      }
    }
  }, [editingItem, isAddingTask, isAddingReward, isAddingMedal, isAddingGrade]);

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleBatchAdd = () => {
    const batchTasks: Task[] = [
      { id: Math.random().toString(36).substr(2, 9), category: '语文', name: '小古文240句', description: '背诵，看百度网盘常青藤爸爸讲解', frequency: '每天', plannedDuration: 30, actualDuration: 0, pointsReward: 2, pointsPenalty: -2, pointsOverdue: 1, completed: false, status: '未开始', createdAt: selectedDate },
      { id: Math.random().toString(36).substr(2, 9), category: '数学', name: '练习帮', description: '完成练习帮相关题目', frequency: '每天', plannedDuration: 20, actualDuration: 0, pointsReward: 2, pointsPenalty: -2, pointsOverdue: 1, completed: false, status: '未开始', createdAt: selectedDate },
      { id: Math.random().toString(36).substr(2, 9), category: '英语', name: '听读D级', description: '每日听读D级课文', frequency: '每天', plannedDuration: 20, actualDuration: 0, pointsReward: 2, pointsPenalty: -2, pointsOverdue: 1, completed: false, status: '未开始', createdAt: selectedDate },
    ];
    updateState(prev => ({ ...prev, tasks: [...prev.tasks, ...batchTasks] }));
  };

  const handleResetTimer = (taskId: string) => {
    updateState(prev => {
      const currentDailyData = prev.dailyData[selectedDate]?.[taskId] || { completed: false, actualDuration: 0, status: '未开始' };
      return {
        ...prev,
        dailyData: {
          ...prev.dailyData,
          [selectedDate]: {
            ...(prev.dailyData[selectedDate] || {}),
            [taskId]: {
              ...currentDailyData,
              actualDuration: 0,
              status: '未开始'
            }
          }
        }
      };
    });
    if (activeTaskId === taskId) setActiveTaskId(null);
  };

  const handleDeleteTask = (taskId: string) => {
    updateState(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== taskId)
    }));
    if (activeTaskId === taskId) setActiveTaskId(null);
  };

  const handleClearDayTasks = () => {
    updateState(prev => {
      const newDailyData = { ...prev.dailyData };
      delete newDailyData[selectedDate];
      return {
        ...prev,
        tasks: prev.tasks.filter(t => t.createdAt !== selectedDate && t.frequency !== '每天'),
        dailyData: newDailyData
      };
    });
  };

  const handleClearAllTasks = () => {
    updateState(prev => ({
      ...prev,
      tasks: [],
      dailyData: {}
    }));
  };

  const handleDeleteReward = (rewardId: string) => {
    updateState(prev => ({
      ...prev,
      rewards: prev.rewards.filter(r => r.id !== rewardId)
    }));
  };

  const handleSaveGrade = () => {
    if (!gradeForm.name) return;
    
    updateState(prev => {
      const newGrade = {
        ...gradeForm,
        id: gradeForm.id || Math.random().toString(36).substr(2, 9),
      } as GradeRecord;

      return {
        ...prev,
        grades: gradeForm.id 
          ? prev.grades.map(g => g.id === gradeForm.id ? newGrade : g)
          : [newGrade, ...prev.grades]
      };
    });
    setIsAddingGrade(false);
    setEditingItem(null);
    setGradeForm({});
  };

  const handleDeleteGrade = (gradeId: string) => {
    updateState(prev => ({
      ...prev,
      grades: prev.grades.filter(g => g.id !== gradeId)
    }));
  };

  const handleClearAllMedals = () => {
    updateState(prev => ({
      ...prev,
      medals: []
    }));
  };

  const handleClearAllRewards = () => {
    updateState(prev => ({
      ...prev,
      rewards: []
    }));
  };

  const handleDeleteMedal = (medalId: string) => {
    updateState(prev => ({
      ...prev,
      medals: prev.medals.filter(m => m.id !== medalId)
    }));
  };

  const handleSaveTask = (taskData: Partial<Task>) => {
    updateState(prev => {
      if (editingItem && editingItem.type === 'task') {
        return {
          ...prev,
          tasks: prev.tasks.map(t => t.id === editingItem.data.id ? { ...t, ...taskData } as Task : t)
        };
      } else {
        const newTask: Task = {
          id: Math.random().toString(36).substr(2, 9),
          category: (taskData.category as TaskCategory) || '语文',
          name: taskData.name || '新计划',
          description: taskData.description || '',
          frequency: (taskData.frequency as any) || '每天',
          plannedDuration: taskData.plannedDuration || 30,
          actualDuration: 0,
          pointsReward: taskData.pointsReward || 2,
          pointsPenalty: taskData.pointsPenalty || -2,
          pointsOverdue: 1,
          completed: false,
          status: '未开始',
          createdAt: selectedDate,
          image: taskData.image,
        };
        return {
          ...prev,
          tasks: [...prev.tasks, newTask]
        };
      }
    });
    setIsAddingTask(false);
    setEditingItem(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'task' | 'reward') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (type === 'task') setTaskForm(prev => ({ ...prev, image: base64String }));
        if (type === 'reward') setRewardForm(prev => ({ ...prev, image: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSaveReward = (rewardData: Partial<Reward>) => {
    updateState(prev => {
      if (editingItem && editingItem.type === 'reward') {
        return {
          ...prev,
          rewards: prev.rewards.map(r => r.id === editingItem.data.id ? { ...r, ...rewardData } as Reward : r)
        };
      } else {
        const newReward: Reward = {
          id: Math.random().toString(36).substr(2, 9),
          name: rewardData.name || '新奖励',
          points: rewardData.points || 100,
          icon: rewardData.icon || 'Gift',
          color: rewardData.color || '#4B79A1',
          description: rewardData.description || '',
          image: rewardData.image,
        };
        return {
          ...prev,
          rewards: [...prev.rewards, newReward]
        };
      }
    });
    setIsAddingReward(false);
    setEditingItem(null);
  };

  const handleSaveMedal = (medalData: Partial<Medal>) => {
    updateState(prev => {
      if (editingItem && editingItem.type === 'medal') {
        return {
          ...prev,
          medals: prev.medals.map(m => m.id === editingItem.data.id ? { ...m, ...medalData } as Medal : m)
        };
      } else {
        const newMedal: Medal = {
          id: Math.random().toString(36).substr(2, 9),
          name: medalData.name || '新勋章',
          description: medalData.description || '',
          unlocked: medalData.unlocked || false,
          icon: medalData.icon || 'Award',
          color: medalData.color || '#F1C40F',
        };
        return {
          ...prev,
          medals: [...prev.medals, newMedal]
        };
      }
    });
    setIsAddingMedal(false);
    setEditingItem(null);
  };

  const handleToggleComplete = (taskId: string) => {
    updateState(prev => {
      const task = prev.tasks.find(t => t.id === taskId);
      if (!task) return prev;
      
      const currentDailyData = prev.dailyData[selectedDate]?.[taskId] || { completed: false, actualDuration: 0, status: '未开始' };
      const newCompleted = !currentDailyData.completed;
      const pointsChange = newCompleted ? task.pointsReward : task.pointsPenalty;
      
      const historyEntry = {
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString(),
        type: (newCompleted ? 'gain' : 'loss') as any,
        amount: Math.abs(pointsChange),
        reason: `${newCompleted ? '完成' : '取消完成'}任务: ${task.name} (${selectedDate})`
      };

      return {
        ...prev,
        totalPoints: prev.totalPoints + pointsChange,
        pointsHistory: [historyEntry, ...prev.pointsHistory],
        dailyData: {
          ...prev.dailyData,
          [selectedDate]: {
            ...(prev.dailyData[selectedDate] || {}),
            [taskId]: {
              ...currentDailyData,
              completed: newCompleted,
              status: newCompleted ? '已完成' : '未开始'
            }
          }
        }
      };
    });
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Real-time Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeTaskId) {
      interval = setInterval(() => {
        setState(prev => {
          const currentDailyData = prev.dailyData[selectedDate]?.[activeTaskId] || { completed: false, actualDuration: 0, status: '未开始' };
          return {
            ...prev,
            dailyData: {
              ...prev.dailyData,
              [selectedDate]: {
                ...(prev.dailyData[selectedDate] || {}),
                [activeTaskId]: {
                  ...currentDailyData,
                  actualDuration: currentDailyData.actualDuration + 1,
                  status: '进行中'
                }
              }
            }
          };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTaskId, selectedDate]);

  const today = useMemo(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  }, []);

  // Derived Stats
  const stats = useMemo(() => {
    const todayTasks = state.tasks.filter(t => {
      const isSelectedDate = t.createdAt === selectedDate;
      const isDaily = t.frequency === '每天';
      const isWeekend = t.frequency === '周末';
      const dateObj = new Date(selectedDate);
      const dayOfWeek = dateObj.getDay();
      const isCurrentDateWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      return isSelectedDate || isDaily || (isWeekend && isCurrentDateWeekend);
    });
    
    const dailyDataForDate = state.dailyData[selectedDate] || {};
    const studyTime = todayTasks.reduce((acc, t) => acc + (dailyDataForDate[t.id]?.actualDuration || 0), 0) / 3600;
    const taskCount = todayTasks.length;
    const completedCount = todayTasks.filter(t => dailyDataForDate[t.id]?.completed).length;
    const completionRate = taskCount > 0 ? Math.round((completedCount / taskCount) * 100) : 0;
    
    return {
      studyTime: studyTime.toFixed(1),
      taskCount,
      completionRate
    };
  }, [state.tasks, state.dailyData, selectedDate]);

  const filteredGrades = useMemo(() => {
    return state.grades.filter(g => {
      const matchYear = gradeFilters.academicYear === '全部' || g.academicYear === gradeFilters.academicYear;
      const matchGrade = gradeFilters.grade === '全部' || g.grade === gradeFilters.grade;
      const matchSemester = gradeFilters.semester === '全部' || g.semester === gradeFilters.semester;
      const matchSubject = gradeFilters.category === '全部' || g.category === gradeFilters.category;
      return matchYear && matchGrade && matchSemester && matchSubject;
    });
  }, [state.grades, gradeFilters]);

  const totalCompletedTasks = useMemo(() => {
    return Object.values(state.dailyData).reduce<number>((acc, day) => {
      return acc + Object.values(day).filter(d => d.completed).length;
    }, 0);
  }, [state.dailyData]);

  const totalDays = useMemo(() => {
    return Object.keys(state.dailyData).length;
  }, [state.dailyData]);

  const updateState = (updater: (prev: AppState) => AppState) => {
    setState(prev => updater(prev));
  };

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Charts Data
  const pieData = useMemo(() => {
    const categories = ['语文', '数学', '英语'];
    return categories.map(cat => {
      const taskIds = state.tasks.filter(t => t.category === cat).map(t => t.id);
      const total = Object.values(state.dailyData).reduce<number>((acc, day) => {
        return acc + taskIds.reduce((sum, id) => sum + (day[id]?.actualDuration || 0), 0);
      }, 0) / 3600;
      return { name: cat, value: parseFloat(total.toFixed(1)) || 0, color: CATEGORY_COLORS[cat] };
    });
  }, [state.tasks, state.dailyData]);

  const barData = useMemo(() => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }

    return dates.map(date => {
      const dayData = state.dailyData[date] || {};
      const row: any = { date: date.split('-').slice(1).join('/') };
      ['语文', '数学', '英语'].forEach(cat => {
        const taskIds = state.tasks.filter(t => t.category === cat).map(t => t.id);
        const duration = taskIds.reduce((sum, id) => sum + (dayData[id]?.actualDuration || 0), 0) / 3600;
        row[cat] = parseFloat(duration.toFixed(1));
      });
      return row;
    });
  }, [state.tasks, state.dailyData]);

  const gradeTrendData = useMemo(() => {
    const dates = Array.from(new Set(state.grades.map(g => g.date))).sort() as string[];
    return dates.map(date => {
      const entry: any = { date: date.slice(5) };
      SUBJECTS.forEach(sub => {
        const grade = state.grades.find(g => g.date === date && g.category === sub);
        if (grade) entry[sub] = grade.score;
      });
      return entry;
    });
  }, [state.grades]);

  const radarData = useMemo(() => {
    return SUBJECTS.map(sub => {
      const grades = state.grades.filter(g => g.category === sub);
      const avg = grades.length > 0 ? grades.reduce((acc, curr) => acc + curr.score, 0) / grades.length : 0;
      return { subject: sub, value: Math.round(avg), fullMark: 100 };
    });
  }, [state.grades]);

  return (
    <div className="min-h-screen bg-[#F0F4F8] font-sans text-[#2C3E50] pb-24 overflow-x-hidden">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#2C3E50] to-[#4B79A1] px-6 pt-10 pb-20 rounded-b-[40px] shadow-lg relative">
        <div className="max-w-4xl mx-auto flex justify-between items-start">
          <div className="text-white">
            <h1 className="text-3xl font-bold tracking-tight">学习计划与打卡统计助手</h1>
            <p className="text-sm opacity-80 mt-2">你已坚持打卡{totalDays}天，已累计完成{totalCompletedTasks}个学习计划！</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2 text-white border border-white/20 shadow-inner">
              <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
              <span className="font-black text-xl">{state.totalPoints}</span>
            </div>
            <button onClick={() => setIsShowingSettings(true)} className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-all border border-white/10 shadow-sm">
              <Settings className="w-6 h-6 text-white" />
            </button>
            <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 text-white text-sm border border-white/20">
              <span>源源</span>
              <ChevronRight className="w-4 h-4 rotate-90" />
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="absolute -bottom-10 left-6 right-6 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
          {state.settings?.showStudyTime && <StatCard label="今日学习时间" value={`${stats.studyTime}h`} icon={<Clock className="text-blue-500" />} onClick={() => setActiveTab('stats')} />}
          {state.settings?.showExerciseTime && <StatCard label="运动户外时间" value="0.0h" icon={<TrendingUp className="text-purple-500" />} onClick={() => setActiveTab('stats')} />}
          {state.settings?.showTaskCount && <StatCard label="今日任务数量" value={`${stats.taskCount}项`} icon={<Layout className="text-orange-500" />} onClick={() => setActiveTab('daily')} />}
          {state.settings?.showCompletionRate && <StatCard label="今日完成率" value={`${stats.completionRate}%`} icon={<CheckCircle2 className="text-green-500" />} onClick={() => setActiveTab('daily')} />}
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="max-w-4xl mx-auto px-6 mt-16">
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex gap-2 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setActiveTab('daily')} 
            className={cn(
              "flex-1 min-w-[100px] py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all",
              activeTab === 'daily' ? "bg-[#4B79A1] text-white shadow-md" : "text-gray-400 hover:bg-gray-50"
            )}
          >
            <Layout className="w-4 h-4" /> 每日计划
          </button>
          {state.settings?.showGrades && (
            <button 
              onClick={() => setActiveTab('grades')} 
              className={cn(
                "flex-1 min-w-[100px] py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all",
                activeTab === 'grades' ? "bg-[#4B79A1] text-white shadow-md" : "text-gray-400 hover:bg-gray-50"
              )}
            >
              <TrendingUp className="w-4 h-4" /> 成绩统计
            </button>
          )}
          {state.settings?.showCharts && (
            <button 
              onClick={() => setActiveTab('stats')} 
              className={cn(
                "flex-1 min-w-[100px] py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all",
                activeTab === 'stats' ? "bg-[#4B79A1] text-white shadow-md" : "text-gray-400 hover:bg-gray-50"
              )}
            >
              <BarChart3 className="w-4 h-4" /> 统计图表
            </button>
          )}
          {state.settings?.showMedals && (
            <button 
              onClick={() => setActiveTab('medals')} 
              className={cn(
                "flex-1 min-w-[100px] py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all",
                activeTab === 'medals' ? "bg-[#4B79A1] text-white shadow-md" : "text-gray-400 hover:bg-gray-50"
              )}
            >
              <Trophy className="w-4 h-4" /> 荣誉勋章
            </button>
          )}
          {state.settings?.showWishlist && (
            <button 
              onClick={() => setActiveTab('rewards')} 
              className={cn(
                "flex-1 min-w-[100px] py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all",
                activeTab === 'rewards' ? "bg-[#4B79A1] text-white shadow-md" : "text-gray-400 hover:bg-gray-50"
              )}
            >
              <Gift className="w-4 h-4" /> 积分奖励
            </button>
          )}
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 mt-8">
        <AnimatePresence mode="wait">
          {activeTab === 'daily' && (
            <motion.div key="daily" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2">
                  <Layout className="w-6 h-6 text-[#4B79A1]" />
                  <h2 className="text-xl font-bold">学习计划</h2>
                  <div className="bg-gray-100 p-1 rounded-md cursor-pointer"><MoreVertical className="w-4 h-4" /></div>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleBatchAdd} className="bg-[#5DADE2] text-white px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 shadow-sm hover:scale-105 transition-all"><Layout className="w-4 h-4" /> 批量添加</button>
                  <button onClick={() => setIsAddingTask(true)} className="bg-[#4B79A1] text-white px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 shadow-sm hover:scale-105 transition-all"><Plus className="w-4 h-4" /> 添加计划</button>
                  <button onClick={handleClearDayTasks} className="bg-orange-500 text-white px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 shadow-sm hover:scale-105 transition-all"><Trash2 className="w-4 h-4" /> 清空今日</button>
                  <button onClick={handleClearAllTasks} className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 shadow-sm hover:scale-105 transition-all"><Trash2 className="w-4 h-4" /> 清空全部</button>
                </div>
              </div>

              {/* Date Selector */}
              <div className="bg-[#EBF5FB] p-2 rounded-xl flex items-center justify-between border border-blue-100">
                <div className="flex items-center gap-4 px-4">
                  <span className="text-[#4B79A1] font-bold">2026年04月03日 第一周</span>
                  <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300" /> 逾期任务
                  </label>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={handlePrevDay} className="p-1.5 hover:bg-white rounded-lg transition-colors"><ChevronLeft className="w-5 h-5 text-[#4B79A1]" /></button>
                  <button onClick={() => setSelectedDate(today)} className="bg-[#4B79A1] text-white px-4 py-1 rounded-lg text-sm font-bold flex items-center gap-1 shadow-md hover:scale-105 transition-all"><Calendar className="w-4 h-4" /> 今天</button>
                  <button onClick={handleNextDay} className="p-1.5 hover:bg-white rounded-lg transition-colors"><ChevronRight className="w-5 h-5 text-[#4B79A1]" /></button>
                  <button onClick={() => dateInputRef.current?.showPicker()} className="p-1.5 hover:bg-white rounded-lg transition-colors relative">
                    <Layout className="w-5 h-5 text-[#4B79A1]" />
                    <input 
                      ref={dateInputRef}
                      type="date" 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </button>
                </div>
              </div>

              {/* Weekly Calendar */}
              <div className="grid grid-cols-8 gap-2">
                {['周三', '周四', '周五', '周六', '周日', '周一', '周二', '周三'].map((day, i) => {
                  const date = `2026-04-${(1 + i).toString().padStart(2, '0')}`;
                  const isSelected = selectedDate === date;
                  const isToday = today === date;
                  
                  return (
                    <div 
                      key={`${day}-${i}`} 
                      onClick={() => setSelectedDate(date)}
                      className={cn(
                        "p-3 rounded-xl text-center border transition-all cursor-pointer",
                        isSelected ? "bg-[#4B79A1] text-white border-[#4B79A1] shadow-md scale-105" : 
                        isToday ? "bg-[#FF9F1C] text-white border-[#FF9F1C]" : 
                        "bg-[#D6EAF8] text-[#4B79A1] border-[#AED6F1] hover:bg-[#AED6F1]"
                      )}
                    >
                      <div className="text-xs font-medium opacity-80">{day}</div>
                      <div className="text-lg font-bold">04/{(1 + i).toString().padStart(2, '0')}</div>
                    </div>
                  );
                })}
              </div>

              {/* Task List */}
              <div className="space-y-4">
                {state.tasks.filter(t => {
                  const isSelectedDate = t.createdAt === selectedDate;
                  const isDaily = t.frequency === '每天';
                  const isWeekend = t.frequency === '周末';
                  const dateObj = new Date(selectedDate);
                  const dayOfWeek = dateObj.getDay(); // 0 is Sunday, 6 is Saturday
                  const isCurrentDateWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                  
                  return isSelectedDate || isDaily || (isWeekend && isCurrentDateWeekend);
                }).map((task) => {
                  const dailyData = state.dailyData[selectedDate]?.[task.id] || { completed: false, actualDuration: 0, status: '未开始' };
                  return (
                    <TaskItem 
                      key={task.id} 
                      task={task} 
                      completed={dailyData.completed}
                      actualDuration={dailyData.actualDuration}
                      status={dailyData.status}
                      isActive={activeTaskId === task.id}
                      onToggleTimer={() => setActiveTaskId(activeTaskId === task.id ? null : task.id)}
                      onResetTimer={() => handleResetTimer(task.id)}
                      onDelete={() => handleDeleteTask(task.id)}
                      onToggleComplete={() => handleToggleComplete(task.id)}
                      onEdit={() => setEditingItem({ type: 'task', data: task })} 
                    />
                  );
                })}
              </div>
            </motion.div>
          )}

          {activeTab === 'grades' && (
            <motion.div key="grades" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-purple-500" />
                  <h2 className="text-xl font-bold">成绩统计追踪</h2>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setIsAddingGrade(true)}
                    className="bg-[#4B79A1] text-white px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 shadow-sm active:scale-95 transition-all"
                  >
                    <Plus className="w-4 h-4" /> 添加成绩
                  </button>
                  <button 
                    onClick={() => setIsAnalyzingGrades(true)}
                    className="bg-[#5DADE2] text-white px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 shadow-sm active:scale-95 transition-all"
                  >
                    <BarChart3 className="w-4 h-4" /> 成绩分析
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">学年:</span>
                  <select 
                    value={gradeFilters.academicYear}
                    onChange={(e) => setGradeFilters(prev => ({ ...prev, academicYear: e.target.value }))}
                    className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1 text-sm outline-none"
                  >
                    <option>全部</option>
                    {ACADEMIC_YEARS.map(year => <option key={year} value={year}>{year}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">年级:</span>
                  <select 
                    value={gradeFilters.grade}
                    onChange={(e) => setGradeFilters(prev => ({ ...prev, grade: e.target.value }))}
                    className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1 text-sm outline-none"
                  >
                    <option>全部</option>
                    {GRADES.map(grade => <option key={grade} value={grade}>{grade}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">学期:</span>
                  <select 
                    value={gradeFilters.semester}
                    onChange={(e) => setGradeFilters(prev => ({ ...prev, semester: e.target.value }))}
                    className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1 text-sm outline-none"
                  >
                    <option>全部</option>
                    {SEMESTERS.map(sem => <option key={sem} value={sem}>{sem}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">科目:</span>
                  <select 
                    value={gradeFilters.category}
                    onChange={(e) => setGradeFilters(prev => ({ ...prev, category: e.target.value }))}
                    className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1 text-sm outline-none"
                  >
                    <option>全部</option>
                    {SUBJECTS.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                  </select>
                </div>
                <button 
                  onClick={() => setGradeFilters({ academicYear: '全部', grade: '全部', semester: '全部', category: '全部' })}
                  className="bg-[#2C3E50] text-white px-4 py-1 rounded-lg text-sm font-bold active:scale-95 transition-all"
                >
                  重置
                </button>
              </div>

              {/* Grade List */}
              <div className="space-y-4">
                {filteredGrades.length > 0 ? (
                  filteredGrades.map((grade) => (
                    <div key={grade.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex group relative">
                      <div className="w-12 flex flex-col items-center justify-center text-white text-[10px] font-bold py-4 space-y-0.5" style={{ backgroundColor: CATEGORY_COLORS[grade.category as TaskCategory] }}>
                        {grade.category.split('').map((char, i) => <span key={i}>{char}</span>)}
                      </div>
                      <div className="flex-1 p-5 flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-blue-500" />
                            <h4 className="text-lg font-bold text-gray-700">{grade.name}</h4>
                            <span className="text-[10px] font-bold text-blue-400 bg-blue-50 px-2 py-0.5 rounded-full">{grade.grade} {grade.semester}</span>
                          </div>
                          <div className="flex gap-6 text-xs text-gray-400">
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {grade.date}</span>
                            <span className="flex items-center gap-1"><Star className="w-3 h-3" /> {grade.academicYear}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-xs">
                            <div className="text-blue-400">目标分：{grade.targetScore}</div>
                            <div className="text-purple-400">平均分：{grade.averageScore}</div>
                            <div className="text-green-400">排名：{grade.rank || '暂无排名'}</div>
                            <div className="text-red-400">最高分：{grade.highestScore}</div>
                          </div>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <div className={cn(
                            "w-16 h-16 rounded-full border-4 flex flex-col items-center justify-center",
                            grade.score >= 90 ? "border-green-500 text-green-600" : "border-red-400 text-red-500"
                          )}>
                            <div className="text-lg font-black leading-none">{grade.score}</div>
                            <div className="text-[8px] opacity-60">/{grade.totalScore}</div>
                          </div>
                          <span className={cn(
                            "text-[10px] font-bold px-3 py-0.5 rounded-full",
                            grade.status === '学神' ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"
                          )}>{grade.status}</span>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setEditingItem({ type: 'grade', data: grade })}
                          className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteGrade(grade.id)}
                          className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white p-12 rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-gray-400">
                    <TrendingUp className="w-12 h-12 mb-4 opacity-20" />
                    <p className="font-bold">暂无成绩记录</p>
                    <p className="text-sm">点击右上角“添加成绩”开始记录吧！</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'stats' && (
            <motion.div key="stats" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
              <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
                <h3 className="text-center font-bold text-[#4B79A1] mb-8">各分类总用时占比</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="middle" align="right" layout="vertical" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
                <h3 className="text-center font-bold text-[#4B79A1] mb-8">各分类每日用时对比</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="语文" stackId="a" fill={CATEGORY_COLORS['语文']} />
                      <Bar dataKey="数学" stackId="a" fill={CATEGORY_COLORS['数学']} />
                      <Bar dataKey="英语" stackId="a" fill={CATEGORY_COLORS['英语']} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
                <h3 className="text-center font-bold text-[#4B79A1] mb-8">各科目成绩趋势</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={gradeTrendData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 110]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="语文" stroke={CATEGORY_COLORS['语文']} strokeWidth={3} dot={{ r: 6 }} connectNulls />
                      <Line type="monotone" dataKey="数学" stroke={CATEGORY_COLORS['数学']} strokeWidth={3} dot={{ r: 6 }} connectNulls />
                      <Line type="monotone" dataKey="英语" stroke={CATEGORY_COLORS['英语']} strokeWidth={3} dot={{ r: 6 }} connectNulls />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
                <h3 className="text-center font-bold text-[#4B79A1] mb-8">薄弱环节分析</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar name="能力值" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'medals' && (
            <motion.div key="medals" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                  <h2 className="text-xl font-bold">勋章墙</h2>
                  <span className="bg-yellow-100 text-yellow-700 px-3 py-0.5 rounded-full text-xs font-bold">解锁24/总数40</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditingItem({ type: 'medal', data: {} })} className="bg-[#4B79A1] text-white px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 shadow-sm hover:scale-105 transition-all"><Plus className="w-4 h-4" /> 添加勋章</button>
                  <button onClick={handleClearAllMedals} className="bg-[#E74C3C] text-white px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 shadow-sm hover:scale-105 transition-all"><Trash2 className="w-4 h-4" /> 清空勋章</button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {state.medals.map((medal) => (
                  <div key={medal.id} className={cn(
                    "bg-white p-6 rounded-2xl shadow-sm border-2 text-center transition-all relative group",
                    medal.unlocked ? "border-yellow-200" : "border-gray-100 opacity-50 grayscale"
                  )}>
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button onClick={() => setEditingItem({ type: 'medal', data: medal })} className="p-1 bg-gray-100 hover:bg-gray-200 rounded-md shadow-sm transition-colors">
                        <Edit3 className="w-3 h-3 text-gray-500" />
                      </button>
                      <button onClick={() => handleDeleteMedal(medal.id)} className="p-1 bg-red-50 hover:bg-red-100 rounded-md shadow-sm transition-colors">
                        <Trash2 className="w-3 h-3 text-red-500" />
                      </button>
                    </div>
                    <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: `${medal.color}20` }}>
                      <Award className="w-8 h-8" style={{ color: medal.color }} />
                    </div>
                    <h4 className="font-bold text-sm mb-2">{medal.name}</h4>
                    <p className="text-[10px] text-gray-400 leading-tight">{medal.description}</p>
                    {!medal.unlocked && <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[1px] rounded-2xl"><Clock className="w-6 h-6 text-gray-400" /></div>}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'rewards' && (
            <motion.div key="rewards" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2">
                  <Gift className="w-6 h-6 text-pink-500" />
                  <h2 className="text-xl font-bold">积分奖励商城</h2>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setIsAddingReward(true)} className="bg-[#4B79A1] text-white px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 shadow-sm hover:scale-105 transition-all"><Plus className="w-4 h-4" /> 添加奖励</button>
                  <button onClick={handleClearAllRewards} className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 shadow-sm hover:scale-105 transition-all"><Trash2 className="w-4 h-4" /> 清空奖励</button>
                  <button onClick={() => setActiveTab('daily')} className="bg-[#5DADE2] text-white px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 shadow-sm hover:scale-105 transition-all"><ChevronLeft className="w-4 h-4" /> 返回计划</button>
                </div>
              </div>

              <div className="flex gap-2 mb-6">
                <button 
                  onClick={() => setIsShowingPointsHistory(false)}
                  className={cn(
                    "px-6 py-2 rounded-lg font-bold text-sm shadow-md transition-all",
                    !isShowingPointsHistory ? "bg-[#6C5CE7] text-white" : "bg-gray-100 text-gray-500"
                  )}
                >
                  奖励池
                </button>
                <button 
                  onClick={() => setIsShowingPointsHistory(true)}
                  className={cn(
                    "px-6 py-2 rounded-lg font-bold text-sm shadow-md transition-all",
                    isShowingPointsHistory ? "bg-[#6C5CE7] text-white" : "bg-gray-100 text-gray-500"
                  )}
                >
                  积分记录
                </button>
              </div>

              {!isShowingPointsHistory ? (
                <>
                  <button onClick={() => setIsAddingReward(true)} className="bg-[#4B79A1] text-white px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 shadow-sm mb-6 hover:scale-105 transition-all"><Plus className="w-4 h-4" /> 添加奖励</button>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {state.rewards.map((reward) => (
                      <div key={reward.id} className="bg-white rounded-[32px] overflow-hidden shadow-md border border-gray-100 flex flex-col group transition-all hover:shadow-xl">
                        <div className="h-2" style={{ backgroundColor: reward.color || '#4B79A1' }} />
                        <div className="p-8 flex flex-col items-center text-center flex-1 relative">
                          <div className="absolute top-4 right-4 flex gap-1">
                            <button onClick={() => setEditingItem({ type: 'reward', data: reward })} className="p-1 bg-gray-100 hover:bg-gray-200 rounded-md shadow-sm transition-colors">
                              <Edit3 className="w-3 h-3 text-gray-500" />
                            </button>
                            <button onClick={() => handleDeleteReward(reward.id)} className="p-1 bg-red-50 hover:bg-red-100 rounded-md shadow-sm transition-colors">
                              <Trash2 className="w-3 h-3 text-red-500" />
                            </button>
                          </div>
                          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 overflow-hidden" style={{ backgroundColor: `${reward.color || '#4B79A1'}15` }}>
                            {reward.image ? (
                              <img src={reward.image} alt={reward.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              renderRewardIcon(reward.icon, reward.color)
                            )}
                          </div>
                          <h3 className="text-xl font-bold text-gray-700 mb-4">{reward.name}</h3>
                          <div className="flex items-center justify-center gap-1 mb-6">
                            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                            <span className="font-black text-2xl text-yellow-600">{reward.points}</span>
                          </div>
                          <button 
                            onClick={() => {
                              if (state.totalPoints >= reward.points) {
                                updateState(prev => {
                                  const historyEntry = {
                                    id: Math.random().toString(36).substr(2, 9),
                                    date: new Date().toISOString(),
                                    type: 'redeem' as any,
                                    amount: reward.points,
                                    reason: `兑换奖励: ${reward.name}`
                                  };
                                  return {
                                    ...prev,
                                    totalPoints: prev.totalPoints - reward.points,
                                    pointsHistory: [historyEntry, ...prev.pointsHistory]
                                  };
                                });
                              }
                            }}
                            className={cn(
                              "w-full py-3 rounded-2xl font-bold text-white shadow-lg transition-all active:scale-95",
                              state.totalPoints >= reward.points 
                                ? "bg-gradient-to-r from-[#4B79A1] to-[#283E51] hover:scale-105" 
                                : "bg-gray-300 cursor-not-allowed shadow-none"
                            )}
                          >
                            {state.totalPoints >= reward.points ? '立即兑换' : '积分不足'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-lg">积分历史记录</h3>
                    <div className="text-sm text-gray-500">共 {state.pointsHistory.length} 条记录</div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                        <tr>
                          <th className="px-6 py-4">时间</th>
                          <th className="px-6 py-4">类型</th>
                          <th className="px-6 py-4">原因</th>
                          <th className="px-6 py-4">积分</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {state.pointsHistory.length > 0 ? (
                          state.pointsHistory.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 text-sm text-gray-500">
                                {new Date(item.date).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                              </td>
                              <td className="px-6 py-4">
                                <span className={cn(
                                  "px-2 py-1 rounded-full text-[10px] font-bold uppercase",
                                  item.type === 'gain' ? "bg-green-100 text-green-600" : 
                                  item.type === 'loss' ? "bg-red-100 text-red-600" : 
                                  "bg-blue-100 text-blue-600"
                                )}>
                                  {item.type === 'gain' ? '获得' : item.type === 'loss' ? '扣除' : '兑换'}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm font-medium text-gray-700">{item.reason}</td>
                              <td className={cn(
                                "px-6 py-4 font-bold",
                                item.type === 'gain' ? "text-green-600" : "text-red-600"
                              )}>
                                {item.type === 'gain' ? '+' : '-'}{item.amount}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">暂无积分记录</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Actions */}
      <div className="fixed bottom-8 left-0 right-0 px-6 flex justify-center gap-4">
        <button className="bg-[#27AE60] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg active:scale-95 transition-all"><TrendingUp className="w-5 h-5" /> 备份数据</button>
        <button className="bg-[#9B59B6] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg active:scale-95 transition-all"><TrendingUp className="w-5 h-5 rotate-180" /> 导入数据</button>
        <button onClick={() => setState(prev => ({ ...prev, tasks: [] }))} className="bg-[#E74C3C] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg active:scale-95 transition-all"><Trash2 className="w-5 h-5" /> 清空学习计划</button>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isShowingSettings && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsShowingSettings(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl relative z-10">
              <div className="bg-[#4B79A1] px-8 py-6 flex justify-between items-center text-white">
                <div className="flex items-center gap-2">
                  <Settings className="w-6 h-6" />
                  <h3 className="text-xl font-bold">统计卡片显示和隐藏设置</h3>
                </div>
                <button onClick={() => setIsShowingSettings(false)} className="p-1 hover:bg-white/10 rounded-full transition-colors"><X className="w-6 h-6" /></button>
              </div>
              <div className="p-8 space-y-4">
                {[
                  { key: 'showStudyTime', label: '今日学习时间' },
                  { key: 'showExerciseTime', label: '运动户外时间' },
                  { key: 'showTaskCount', label: '今日任务数量' },
                  { key: 'showCompletionRate', label: '今日完成率' },
                  { key: 'showCharts', label: '统计图表汇总' },
                  { key: 'showMedals', label: '荣誉勋章墙' },
                  { key: 'showGrades', label: '成绩统计追踪' },
                  { key: 'showWishlist', label: '积分许愿墙' },
                ].map((item) => (
                  <label key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-100 transition-all">
                    <span className="font-bold text-gray-700">{item.label}</span>
                    <input 
                      type="checkbox" 
                      checked={state.settings ? (state.settings as any)[item.key] : true} 
                      onChange={(e) => updateState(prev => ({ 
                        ...prev, 
                        settings: { ...prev.settings, [item.key]: e.target.checked } 
                      }))}
                      className="w-5 h-5 rounded border-gray-300 text-[#4B79A1] focus:ring-[#4B79A1]"
                    />
                  </label>
                ))}
                <div className="flex gap-4 pt-4">
                  <button onClick={() => setIsShowingSettings(false)} className="flex-1 py-3 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-900 transition-all">取消</button>
                  <button onClick={() => setIsShowingSettings(false)} className="flex-1 py-3 bg-[#4B79A1] text-white rounded-xl font-bold hover:bg-[#3B6991] transition-all">保存</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {isAnalyzingGrades && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAnalyzingGrades(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-white w-full max-w-4xl rounded-[32px] overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[90vh]">
              <div className="bg-[#5DADE2] px-8 py-6 flex justify-between items-center text-white">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-6 h-6" />
                  <h3 className="text-xl font-bold">成绩深度分析</h3>
                </div>
                <button onClick={() => setIsAnalyzingGrades(false)} className="p-1 hover:bg-white/10 rounded-full transition-colors"><X className="w-6 h-6" /></button>
              </div>
              <div className="p-8 overflow-y-auto space-y-8">
                {filteredGrades.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                        <h4 className="font-bold text-gray-700 mb-6 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-blue-500" /> 成绩趋势分析
                        </h4>
                        <div className="h-[250px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={[...filteredGrades].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} />
                              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                              <YAxis domain={[0, 110]} />
                              <Tooltip />
                              <Line type="monotone" dataKey="score" stroke="#4B79A1" strokeWidth={3} dot={{ r: 4 }} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                        <h4 className="font-bold text-gray-700 mb-6 flex items-center gap-2">
                          <PieChartIcon className="w-4 h-4 text-purple-500" /> 状态分布
                        </h4>
                        <div className="h-[250px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie 
                                data={[
                                  { name: '学神', value: filteredGrades.filter(g => g.status === '学神').length, color: '#27AE60' },
                                  { name: '优秀', value: filteredGrades.filter(g => g.status === '优秀').length, color: '#5DADE2' },
                                  { name: '待提高', value: filteredGrades.filter(g => g.status === '待提高').length, color: '#E74C3C' },
                                ].filter(d => d.value > 0)} 
                                cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value"
                              >
                                {[
                                  { name: '学神', color: '#27AE60' },
                                  { name: '优秀', color: '#5DADE2' },
                                  { name: '待提高', color: '#E74C3C' },
                                ].map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                      <h4 className="font-bold text-gray-700 mb-6 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-green-500" /> 科目得分对比
                      </h4>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={SUBJECTS.map(sub => ({
                            name: sub,
                            avg: Math.round(filteredGrades.filter(g => g.category === sub).reduce((acc, curr) => acc + curr.score, 0) / (filteredGrades.filter(g => g.category === sub).length || 1)),
                            max: Math.max(...filteredGrades.filter(g => g.category === sub).map(g => g.score), 0)
                          }))}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis domain={[0, 110]} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="avg" name="平均分" fill="#5DADE2" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="max" name="最高分" fill="#27AE60" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="py-20 text-center text-gray-400">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p className="text-lg font-bold">暂无足够数据进行分析</p>
                    <p>请先添加一些成绩记录吧！</p>
                  </div>
                )}
              </div>
              <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
                <button onClick={() => setIsAnalyzingGrades(false)} className="px-8 py-2.5 bg-[#4B79A1] text-white rounded-xl font-bold shadow-lg active:scale-95 transition-all">关闭分析</button>
              </div>
            </motion.div>
          </div>
        )}

        {(isAddingTask || isAddingReward || isAddingMedal || isAddingGrade || editingItem) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setIsAddingTask(false); setIsAddingReward(false); setIsAddingMedal(false); setIsAddingGrade(false); setEditingItem(null); }} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-white w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl relative z-10">
              <div className="bg-[#4B79A1] px-8 py-6 flex justify-between items-center text-white">
                <h3 className="text-xl font-bold">
                  {editingItem ? '编辑' : '添加'}
                  {editingItem?.type === 'reward' || isAddingReward ? '奖励' : 
                   editingItem?.type === 'medal' || isAddingMedal ? '勋章' : 
                   editingItem?.type === 'grade' || isAddingGrade ? '成绩' : '计划'}
                </h3>
                <button onClick={() => { setIsAddingTask(false); setIsAddingReward(false); setIsAddingMedal(false); setIsAddingGrade(false); setEditingItem(null); }} className="p-1 hover:bg-white/10 rounded-full transition-colors"><X className="w-6 h-6" /></button>
              </div>
              <div className="p-8 max-h-[70vh] overflow-y-auto space-y-6">
                {(editingItem?.type === 'grade' || isAddingGrade) ? (
                  <>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">考试名称 *</label>
                        <input 
                          type="text" 
                          value={gradeForm.name || ''}
                          onChange={(e) => setGradeForm({ ...gradeForm, name: e.target.value })}
                          placeholder="例如：第一次单元测试" 
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#4B79A1] transition-all" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">考试日期 *</label>
                        <input 
                          type="date" 
                          value={gradeForm.date || ''}
                          onChange={(e) => setGradeForm({ ...gradeForm, date: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#4B79A1] transition-all" 
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">学年</label>
                        <select 
                          value={gradeForm.academicYear || ACADEMIC_YEARS[0]}
                          onChange={(e) => setGradeForm({ ...gradeForm, academicYear: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#4B79A1] transition-all"
                        >
                          {ACADEMIC_YEARS.map(year => <option key={year} value={year}>{year}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">年级</label>
                        <select 
                          value={gradeForm.grade || GRADES[0]}
                          onChange={(e) => setGradeForm({ ...gradeForm, grade: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#4B79A1] transition-all"
                        >
                          {GRADES.map(grade => <option key={grade} value={grade}>{grade}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">学期</label>
                        <select 
                          value={gradeForm.semester || SEMESTERS[0]}
                          onChange={(e) => setGradeForm({ ...gradeForm, semester: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#4B79A1] transition-all"
                        >
                          {SEMESTERS.map(sem => <option key={sem} value={sem}>{sem}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">科目</label>
                        <select 
                          value={gradeForm.category || '语文'}
                          onChange={(e) => setGradeForm({ ...gradeForm, category: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#4B79A1] transition-all"
                        >
                          {SUBJECTS.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">状态</label>
                        <select 
                          value={gradeForm.status || '优秀'}
                          onChange={(e) => setGradeForm({ ...gradeForm, status: e.target.value as any })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#4B79A1] transition-all"
                        >
                          <option value="学神">学神</option>
                          <option value="优秀">优秀</option>
                          <option value="待提高">待提高</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">得分 *</label>
                        <input 
                          type="number" 
                          value={gradeForm.score || 0}
                          onChange={(e) => setGradeForm({ ...gradeForm, score: parseFloat(e.target.value) })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#4B79A1] transition-all" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">总分</label>
                        <input 
                          type="number" 
                          value={gradeForm.totalScore || 100}
                          onChange={(e) => setGradeForm({ ...gradeForm, totalScore: parseFloat(e.target.value) })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#4B79A1] transition-all" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">目标分</label>
                        <input 
                          type="number" 
                          value={gradeForm.targetScore || 95}
                          onChange={(e) => setGradeForm({ ...gradeForm, targetScore: parseFloat(e.target.value) })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#4B79A1] transition-all" 
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">平均分</label>
                        <input 
                          type="number" 
                          value={gradeForm.averageScore || 80}
                          onChange={(e) => setGradeForm({ ...gradeForm, averageScore: parseFloat(e.target.value) })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#4B79A1] transition-all" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">最高分</label>
                        <input 
                          type="number" 
                          value={gradeForm.highestScore || 100}
                          onChange={(e) => setGradeForm({ ...gradeForm, highestScore: parseFloat(e.target.value) })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#4B79A1] transition-all" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">排名 (可选)</label>
                      <input 
                        type="text" 
                        value={gradeForm.rank || ''}
                        onChange={(e) => setGradeForm({ ...gradeForm, rank: e.target.value })}
                        placeholder="例如：第3名" 
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#4B79A1] transition-all" 
                      />
                    </div>
                    <div className="flex gap-4 pt-4">
                      <button onClick={() => { setIsAddingGrade(false); setEditingItem(null); }} className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all">取消</button>
                      <button onClick={handleSaveGrade} className="flex-1 py-4 bg-[#4B79A1] text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all">保存成绩</button>
                    </div>
                  </>
                ) : (editingItem?.type === 'reward' || isAddingReward) ? (
                  <>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">奖励名称 *</label>
                        <input 
                          type="text" 
                          value={rewardForm.name || ''}
                          onChange={(e) => setRewardForm({ ...rewardForm, name: e.target.value })}
                          placeholder="例如：看电视30分钟" 
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#4B79A1] transition-all" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">所需积分 *</label>
                        <input 
                          type="number" 
                          value={rewardForm.points || 0}
                          onChange={(e) => setRewardForm({ ...rewardForm, points: parseInt(e.target.value) })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#4B79A1] transition-all" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">奖励图片</label>
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
                          {rewardForm.image ? (
                            <img src={rewardForm.image} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <ImageIcon className="w-8 h-8 text-gray-400" />
                          )}
                        </div>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'reward')}
                          className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                      </div>
                    </div>
                    <div className="flex gap-4 pt-4">
                      <button onClick={() => { setIsAddingReward(false); setEditingItem(null); }} className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all">取消</button>
                      <button onClick={() => handleSaveReward(rewardForm)} className="flex-1 py-4 bg-[#4B79A1] text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all">保存奖励</button>
                    </div>
                  </>
                ) : (editingItem?.type === 'medal' || isAddingMedal) ? (
                  <>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">勋章名称 *</label>
                        <input 
                          type="text" 
                          value={medalForm.name || ''}
                          onChange={(e) => setMedalForm({ ...medalForm, name: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#4B79A1] transition-all" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">勋章颜色</label>
                        <input 
                          type="color" 
                          value={medalForm.color || '#F1C40F'}
                          onChange={(e) => setMedalForm({ ...medalForm, color: e.target.value })}
                          className="w-full h-12 p-1 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#4B79A1] transition-all" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">勋章描述</label>
                      <textarea 
                        rows={3} 
                        value={medalForm.description || ''}
                        onChange={(e) => setMedalForm({ ...medalForm, description: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#4B79A1] transition-all resize-none" 
                      />
                    </div>
                    <div className="flex gap-4 pt-4">
                      <button onClick={() => { setIsAddingMedal(false); setEditingItem(null); }} className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all">取消</button>
                      <button onClick={() => handleSaveMedal(medalForm)} className="flex-1 py-4 bg-[#4B79A1] text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all">保存勋章</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">任务分类 *</label>
                        <select 
                          value={taskForm.category || '语文'}
                          onChange={(e) => setTaskForm({ ...taskForm, category: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#4B79A1] transition-all"
                        >
                          <option value="语文">语文</option>
                          <option value="数学">数学</option>
                          <option value="英语">英语</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">任务名称 *</label>
                        <input 
                          type="text" 
                          value={taskForm.name || ''}
                          onChange={(e) => setTaskForm({ ...taskForm, name: e.target.value })}
                          placeholder="例如：听读英语课文" 
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#4B79A1] transition-all" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">任务说明</label>
                      <textarea 
                        rows={3} 
                        value={taskForm.description || ''}
                        onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                        placeholder="详细描述任务内容..." 
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#4B79A1] transition-all resize-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">任务图片</label>
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
                          {taskForm.image ? (
                            <img src={taskForm.image} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <ImageIcon className="w-8 h-8 text-gray-400" />
                          )}
                        </div>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'task')}
                          className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">计划用时 (分钟)</label>
                        <input 
                          type="number" 
                          value={taskForm.plannedDuration || 30}
                          onChange={(e) => setTaskForm({ ...taskForm, plannedDuration: parseInt(e.target.value) })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#4B79A1]" 
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl border border-blue-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#4B79A1] rounded-full flex items-center justify-center text-white"><Star className="w-5 h-5" /></div>
                        <div>
                          <div className="font-bold text-[#4B79A1]">积分奖惩</div>
                          <div className="text-xs text-gray-500">完成加分，未完成扣分</div>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="text-center">
                          <div className="text-[10px] text-gray-400 uppercase font-bold">完成奖励</div>
                          <input 
                            type="number" 
                            value={taskForm.pointsReward || 0}
                            onChange={(e) => setTaskForm({ ...taskForm, pointsReward: parseInt(e.target.value) })}
                            className="w-16 text-center font-bold text-green-600 bg-transparent border-b-2 border-green-200 outline-none" 
                          />
                        </div>
                        <div className="text-center">
                          <div className="text-[10px] text-gray-400 uppercase font-bold">未完成扣减</div>
                          <input 
                            type="number" 
                            value={taskForm.pointsPenalty || 0}
                            onChange={(e) => setTaskForm({ ...taskForm, pointsPenalty: parseInt(e.target.value) })}
                            className="w-16 text-center font-bold text-red-600 bg-transparent border-b-2 border-red-200 outline-none" 
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4 pt-4">
                      <button onClick={() => { setIsAddingTask(false); setEditingItem(null); }} className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all">取消</button>
                      <button onClick={() => handleSaveTask(taskForm)} className="flex-1 py-4 bg-[#4B79A1] text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all">保存计划</button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

const StatCard: React.FC<{ label: string, value?: string, icon: React.ReactNode, onClick?: () => void }> = ({ label, value, icon, onClick }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }} 
      onClick={onClick}
      className={cn(
        "bg-white p-3 rounded-2xl shadow-md border border-gray-100 flex flex-col items-center text-center cursor-pointer transition-all",
        onClick && "hover:border-blue-200 hover:shadow-blue-100"
      )}
    >
      <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center mb-2">{icon}</div>
      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tight leading-tight mb-1">{label}</div>
      {value && <div className="text-lg font-black text-[#2C3E50]">{value}</div>}
    </motion.div>
  );
};

const TaskItem: React.FC<{ 
  task: Task, 
  completed: boolean,
  actualDuration: number,
  status: string,
  isActive: boolean, 
  onToggleTimer: () => void, 
  onResetTimer: () => void,
  onDelete: () => void,
  onToggleComplete: () => void, 
  onEdit: () => void 
}> = ({ task, completed, actualDuration, status, isActive, onToggleTimer, onResetTimer, onDelete, onToggleComplete, onEdit }) => {
  const categoryColor = CATEGORY_COLORS[task.category] || '#95A5A6';
  const categoryIcon = CATEGORY_ICONS[task.category] || <MoreHorizontal className="w-4 h-4" />;

  return (
    <motion.div layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex group">
      <div className="w-12 flex flex-col items-center justify-center text-white text-sm font-bold py-4 px-2" style={{ backgroundColor: categoryColor }}>
        {task.category.split('').map((char, i) => <span key={i}>{char}</span>)}
      </div>
      <div className="flex-1 p-5 flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-1.5 rounded-lg bg-gray-50" style={{ color: categoryColor }}>
              {categoryIcon}
            </div>
            <h4 className="text-lg font-bold text-gray-700">{task.name}</h4>
            <span className="text-[10px] font-bold text-blue-400 bg-blue-50 px-2 py-0.5 rounded-full">{task.frequency}</span>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 relative flex gap-4">
            {task.image && (
              <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                <img src={task.image} alt={task.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            )}
            <div className="flex-1">
              <p className="text-sm text-gray-500 leading-relaxed">{task.description}</p>
              <div className="mt-3 flex gap-4 text-[10px] font-bold">
                <span className="text-green-600 bg-green-50 px-2 py-1 rounded-md">奖励积分: +{task.pointsReward}</span>
                <span className="text-red-600 bg-red-50 px-2 py-1 rounded-md">未完成扣减: {task.pointsPenalty}</span>
              </div>
            </div>
            <div className="absolute top-2 right-2 flex gap-1">
              <button onClick={onEdit} className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-md shadow-sm transition-colors">
                <Edit3 className="w-4 h-4 text-gray-500" />
              </button>
              <button onClick={onDelete} className="p-1.5 bg-red-50 hover:bg-red-100 rounded-md shadow-sm transition-colors">
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-3 min-w-[140px]">
          <div className={cn(
            "text-3xl font-mono font-black tracking-widest px-4 py-2 rounded-xl border transition-all relative",
            isActive ? "bg-red-50 border-red-200 text-red-500 animate-pulse" : "bg-gray-50 border-gray-100 text-[#2C3E50]"
          )}>
            {Math.floor(actualDuration / 3600).toString().padStart(2, '0')}:
            {Math.floor((actualDuration % 3600) / 60).toString().padStart(2, '0')}:
            {(actualDuration % 60).toString().padStart(2, '0')}
            
            <button 
              onClick={(e) => { e.stopPropagation(); onResetTimer(); }}
              className="absolute -top-2 -right-2 bg-gray-200 hover:bg-gray-300 text-gray-500 p-1 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
              title="清零"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
          <div className="flex gap-2 w-full">
            <button 
              onClick={onToggleTimer}
              className={cn(
                "flex-1 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95",
                isActive ? "bg-red-500 text-white" : "bg-[#4B79A1] text-white"
              )}
            >
              {isActive ? <Timer className="w-4 h-4 animate-spin" /> : <Timer className="w-4 h-4" />}
              {isActive ? '停止' : '开始'}
            </button>
            <button 
              onClick={onToggleComplete}
              className={cn(
                "flex-1 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95",
                completed ? "bg-[#27AE60] text-white" : "bg-gray-100 text-gray-400 hover:bg-gray-200"
              )}
            >
              <CheckCircle2 className="w-4 h-4" /> {completed ? '已完成' : '未完成'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

function renderRewardIcon(iconName: string, color?: string) {
  const style = color ? { color } : {};
  switch (iconName) {
    case 'Trees': return <Trees className="w-10 h-10" style={style} />;
    case 'Coffee': return <Coffee className="w-10 h-10" style={style} />;
    case 'Gamepad2': return <Gamepad2 className="w-10 h-10" style={style} />;
    case 'Package': return <Package className="w-10 h-10" style={style} />;
    case 'Dumbbell': return <Dumbbell className="w-10 h-10" style={style} />;
    case 'Apple': return <Coffee className="w-10 h-10" style={style} />;
    case 'Gift': return <Gift className="w-10 h-10" style={style} />;
    default: return <Star className="w-10 h-10" style={style} />;
  }
}
