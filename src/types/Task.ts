
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'doing' | 'done';
  priority?: 'low' | 'medium' | 'high';
  points: number;
  dueDate: Date;
  completedAt?: Date;
  createdAt: Date;
  tags?: string[];
  labels?: string[];
  recurrence?: 'none' | 'daily' | 'weekly' | 'monthly' | 'custom';
  recurrencePattern?: {
    weekdays?: number[]; // For weekly: 0-6 (Sunday to Saturday)
    customDates?: Date[]; // For custom recurrence
    endDate?: Date; // When to stop recurring
  };
  isRecurring?: boolean;
  originalTaskId?: string; // For tracking recurring task instances
  userId?: string; // TODO: Add when backend is ready
}

export interface UserStats {
  totalPoints: number;
  level: number;
  completedTasks: number;
  currentStreak: number;
  weeklyGoal?: number;
  monthlyGoal?: number;
}

// TODO: Add these interfaces when backend integration is ready
export interface ApiTask extends Omit<Task, 'dueDate' | 'completedAt' | 'createdAt'> {
  dueDate: string;
  completedAt?: string;
  createdAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'task' | 'event' | 'recurring';
  taskId?: string;
  googleEventId?: string; // For Google Calendar integration
}
