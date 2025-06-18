
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'doing' | 'done';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  points: number;
  dueDate: Date;
  dueTime?: string; // HH:MM format
  completedAt?: Date;
  createdAt: Date;
  tags?: string[];
  labels?: string[];
  boardId?: string; // For board association
  
  // Enhanced recurrence options
  recurrence?: 'none' | 'daily' | 'weekly' | 'monthly' | 'custom';
  recurrencePattern?: {
    // For weekly recurrence
    weekdays?: number[]; // 0-6 (Sunday to Saturday)
    
    // For monthly recurrence
    monthlyType?: 'date' | 'weekday'; // Repeat on specific date or weekday
    monthlyDate?: number; // Day of month (1-31)
    monthlyWeekday?: number; // Day of week (0-6)
    monthlyWeek?: number; // Which week (1-4, or -1 for last)
    
    // For custom recurrence
    customDates?: Date[];
    interval?: number; // Every X days/weeks/months
    
    // Recurrence limits
    endDate?: Date;
    maxOccurrences?: number;
    
    // Time settings
    resetTime?: string; // HH:MM when task should reset to todo
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
  completionRate?: number;
  averageTasksPerDay?: number;
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
