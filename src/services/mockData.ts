// Mock data service - replace with real API calls when backend is ready
// This service provides mock data that matches the expected API responses

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  points: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  allDay: boolean;
  userId: string;
  taskId?: string;
}

export interface UserStats {
  totalTasks: number;
  completedTasks: number;
  totalPoints: number;
  streak: number;
  level: number;
  badges: string[];
}

export interface PerformanceData {
  tasksCompletedThisWeek: number;
  tasksCompletedLastWeek: number;
  pointsEarnedThisWeek: number;
  pointsEarnedLastWeek: number;
  productivityScore: number;
  weeklyProgress: Array<{
    day: string;
    tasks: number;
    points: number;
  }>;
}

class MockDataService {
  // Mock tasks data
  private mockTasks: Task[] = [
    {
      id: '1',
      title: 'Implementar autenticação',
      description: 'Criar sistema de login e registro',
      status: 'done',
      priority: 'high',
      dueDate: '2024-06-20',
      createdAt: '2024-06-15T10:00:00Z',
      updatedAt: '2024-06-18T14:30:00Z',
      userId: '1',
      points: 50
    },
    {
      id: '2',
      title: 'Criar dashboard',
      description: 'Desenvolver interface principal do usuário',
      status: 'in-progress',
      priority: 'high',
      dueDate: '2024-06-25',
      createdAt: '2024-06-16T09:00:00Z',
      updatedAt: '2024-06-19T11:15:00Z',
      userId: '1',
      points: 75
    },
    {
      id: '3',
      title: 'Configurar CI/CD',
      description: 'Automatizar deploy da aplicação',
      status: 'todo',
      priority: 'medium',
      dueDate: '2024-06-30',
      createdAt: '2024-06-17T15:30:00Z',
      updatedAt: '2024-06-17T15:30:00Z',
      userId: '1',
      points: 30
    },
    {
      id: '4',
      title: 'Implementar gamificação',
      description: 'Sistema de pontos e badges',
      status: 'todo',
      priority: 'medium',
      createdAt: '2024-06-18T08:00:00Z',
      updatedAt: '2024-06-18T08:00:00Z',
      userId: '1',
      points: 40
    }
  ];

  // Mock calendar events
  private mockEvents: CalendarEvent[] = [
    {
      id: '1',
      title: 'Reunião de planejamento',
      description: 'Definir roadmap do produto',
      start: '2024-06-20T09:00:00Z',
      end: '2024-06-20T10:30:00Z',
      allDay: false,
      userId: '1'
    },
    {
      id: '2',
      title: 'Deadline - Dashboard',
      start: '2024-06-25T23:59:00Z',
      end: '2024-06-25T23:59:00Z',
      allDay: true,
      userId: '1',
      taskId: '2'
    },
    {
      id: '3',
      title: 'Review de código',
      description: 'Revisar PRs da equipe',
      start: '2024-06-21T14:00:00Z',
      end: '2024-06-21T15:00:00Z',
      allDay: false,
      userId: '1'
    }
  ];

  async getTasks(): Promise<Task[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...this.mockTasks];
  }

  async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.mockTasks.push(newTask);
    return newTask;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const taskIndex = this.mockTasks.findIndex(task => task.id === id);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    this.mockTasks[taskIndex] = {
      ...this.mockTasks[taskIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return this.mockTasks[taskIndex];
  }

  async deleteTask(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const taskIndex = this.mockTasks.findIndex(task => task.id === id);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    this.mockTasks.splice(taskIndex, 1);
  }

  async getCalendarEvents(): Promise<CalendarEvent[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return [...this.mockEvents];
  }

  async createCalendarEvent(event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newEvent: CalendarEvent = {
      ...event,
      id: Date.now().toString()
    };
    
    this.mockEvents.push(newEvent);
    return newEvent;
  }

  async getUserStats(): Promise<UserStats> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const completedTasks = this.mockTasks.filter(task => task.status === 'done');
    const totalPoints = completedTasks.reduce((sum, task) => sum + task.points, 0);
    
    return {
      totalTasks: this.mockTasks.length,
      completedTasks: completedTasks.length,
      totalPoints,
      streak: 7,
      level: Math.floor(totalPoints / 100) + 1,
      badges: ['Early Bird', 'Task Master', 'Streak Keeper']
    };
  }

  async getPerformanceData(): Promise<PerformanceData> {
    await new Promise(resolve => setTimeout(resolve, 700));
    
    return {
      tasksCompletedThisWeek: 5,
      tasksCompletedLastWeek: 3,
      pointsEarnedThisWeek: 180,
      pointsEarnedLastWeek: 120,
      productivityScore: 85,
      weeklyProgress: [
        { day: 'Seg', tasks: 2, points: 40 },
        { day: 'Ter', tasks: 1, points: 25 },
        { day: 'Qua', tasks: 0, points: 0 },
        { day: 'Qui', tasks: 3, points: 75 },
        { day: 'Sex', tasks: 1, points: 30 },
        { day: 'Sáb', tasks: 0, points: 0 },
        { day: 'Dom', tasks: 1, points: 20 }
      ]
    };
  }
}

export const mockDataService = new MockDataService();

