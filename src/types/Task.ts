
export interface Task {
  id: string;
  title: string;
  dueDate: Date;
  recurrence: 'once' | 'daily' | 'weekly';
  status: 'todo' | 'doing' | 'done';
  completedAt?: Date;
  points: number;
}

export interface UserStats {
  totalPoints: number;
  level: number;
  completedTasks: number;
  currentStreak: number;
}
