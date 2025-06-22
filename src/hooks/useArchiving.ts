
import { useState, useEffect } from 'react';
import { Task } from '@/types/Task';
import { toast } from 'sonner';

interface ArchiveSettings {
  doneColumnId: string | null;
  archiveTime: string; // HH:MM format
  isAutoArchiveEnabled: boolean;
}

export const useArchiving = (
  tasks: Task[],
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void
) => {
  const [archiveSettings, setArchiveSettings] = useState<ArchiveSettings>({
    doneColumnId: null,
    archiveTime: '03:00', // Default to 3 AM
    isAutoArchiveEnabled: false,
  });

  const [archivedTasks, setArchivedTasks] = useState<Task[]>([]);

  // Load settings and archived tasks from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('archive-settings');
    const savedArchivedTasks = localStorage.getItem('archived-tasks');
    
    if (savedSettings) {
      setArchiveSettings(JSON.parse(savedSettings));
    }
    
    if (savedArchivedTasks) {
      const parsed = JSON.parse(savedArchivedTasks).map((task: any) => ({
        ...task,
        dueDate: new Date(task.dueDate),
        completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
        createdAt: new Date(task.createdAt),
        archivedAt: task.archivedAt ? new Date(task.archivedAt) : undefined,
      }));
      setArchivedTasks(parsed);
    }
  }, []);

  // Save settings to localStorage
  const updateArchiveSettings = (newSettings: Partial<ArchiveSettings>) => {
    const updated = { ...archiveSettings, ...newSettings };
    setArchiveSettings(updated);
    localStorage.setItem('archive-settings', JSON.stringify(updated));
  };

  // Archive tasks manually or automatically
  const archiveTasks = (tasksToArchive: Task[]) => {
    const archivedTasksWithTimestamp = tasksToArchive.map(task => ({
      ...task,
      archivedAt: new Date(),
    }));
    
    const updatedArchivedTasks = [...archivedTasks, ...archivedTasksWithTimestamp];
    setArchivedTasks(updatedArchivedTasks);
    localStorage.setItem('archived-tasks', JSON.stringify(updatedArchivedTasks));
    
    // Remove archived tasks from active tasks by updating their status to 'archived'
    tasksToArchive.forEach(task => {
      onUpdateTask(task.id, { status: 'archived' as any });
    });
    
    toast.success(`${tasksToArchive.length} tarefa(s) arquivada(s) com sucesso!`);
  };

  // Auto-archive based on done column and time
  const performAutoArchive = () => {
    if (!archiveSettings.isAutoArchiveEnabled || !archiveSettings.doneColumnId) {
      return;
    }

    const doneColumnTasks = tasks.filter(task => 
      task.status === 'done' && 
      task.boardId // Only archive tasks from active boards
    );

    if (doneColumnTasks.length > 0) {
      archiveTasks(doneColumnTasks);
    }
  };

  // Check if it's time to auto-archive (this would be called by a scheduler)
  const checkAutoArchiveTime = () => {
    const now = new Date();
    const [hours, minutes] = archiveSettings.archiveTime.split(':').map(Number);
    const archiveTime = new Date(now);
    archiveTime.setHours(hours, minutes, 0, 0);

    // Check if current time matches archive time (within 1-minute window)
    const timeDiff = Math.abs(now.getTime() - archiveTime.getTime());
    const oneMinute = 60 * 1000;

    if (timeDiff < oneMinute) {
      performAutoArchive();
    }
  };

  // Restore archived task
  const restoreArchivedTask = (taskId: string) => {
    const taskToRestore = archivedTasks.find(task => task.id === taskId);
    if (!taskToRestore) return;

    // Remove from archived tasks
    const updatedArchivedTasks = archivedTasks.filter(task => task.id !== taskId);
    setArchivedTasks(updatedArchivedTasks);
    localStorage.setItem('archived-tasks', JSON.stringify(updatedArchivedTasks));

    // Restore to active tasks
    const restoredTask = { ...taskToRestore };
    delete (restoredTask as any).archivedAt;
    onUpdateTask(taskId, { status: 'done' });
    
    toast.success('Tarefa restaurada com sucesso!');
  };

  return {
    archiveSettings,
    archivedTasks,
    updateArchiveSettings,
    archiveTasks,
    performAutoArchive,
    checkAutoArchiveTime,
    restoreArchivedTask,
  };
};
