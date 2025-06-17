
import { useState, useEffect } from 'react';
import { Task, UserStats } from '@/types/Task';

const STORAGE_KEY = 'productive-tasks';
const STATS_KEY = 'user-stats';

export const useTaskStore = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    totalPoints: 0,
    level: 1,
    completedTasks: 0,
    currentStreak: 0,
  });

  useEffect(() => {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    const savedStats = localStorage.getItem(STATS_KEY);
    
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
        ...task,
        dueDate: new Date(task.dueDate),
        completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
        createdAt: task.createdAt ? new Date(task.createdAt) : new Date(),
      }));
      setTasks(parsedTasks);
    }
    
    if (savedStats) {
      setUserStats(JSON.parse(savedStats));
    }
  }, []);

  const saveTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
  };

  const saveStats = (newStats: UserStats) => {
    setUserStats(newStats);
    localStorage.setItem(STATS_KEY, JSON.stringify(newStats));
  };

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    saveTasks([...tasks, newTask]);
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    const newTasks = tasks.map(task => {
      if (task.id === taskId) {
        const updatedTask = { ...task, ...updates };
        
        // Award points when moving to done
        if (updates.status === 'done' && task.status !== 'done') {
          updatedTask.completedAt = new Date();
          const newStats = {
            ...userStats,
            totalPoints: userStats.totalPoints + task.points,
            completedTasks: userStats.completedTasks + 1,
            level: Math.floor((userStats.totalPoints + task.points) / 50) + 1,
          };
          saveStats(newStats);
        }
        
        return updatedTask;
      }
      return task;
    });
    saveTasks(newTasks);
  };

  const deleteTask = (taskId: string) => {
    const newTasks = tasks.filter(task => task.id !== taskId);
    saveTasks(newTasks);
  };

  return {
    tasks,
    userStats,
    addTask,
    updateTask,
    deleteTask,
  };
};
