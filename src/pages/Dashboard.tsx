
import React, { useState, useMemo, useEffect } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { DashboardFilters } from '@/components/dashboard/DashboardFilters';
import { BoardInfo } from '@/components/dashboard/BoardInfo';
import { KanbanBoard } from '@/components/dashboard/KanbanBoard';
import { TaskEditModal } from '@/components/TaskEditModal';
import { useTaskStore } from '@/hooks/useTaskStore';
import { useBoard } from '@/contexts/BoardContext';
import { Task } from '@/types/Task';
import { pt } from '@/utils/localization';

interface Column {
  id: string;
  title: string;
  status: 'todo' | 'doing' | 'done';
}

const DEFAULT_COLUMNS: Column[] = [
  { id: 'todo', title: 'A Fazer', status: 'todo' },
  { id: 'doing', title: 'Fazendo', status: 'doing' },
  { id: 'done', title: 'Concluído', status: 'done' },
];

export const Dashboard = () => {
  const { tasks, userStats, addTask, updateTask, deleteTask, getTasksByBoard } = useTaskStore();
  const { currentBoard } = useBoard();
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [columns, setColumns] = useState<Column[]>(DEFAULT_COLUMNS);

  // Filter tasks by current board
  const boardTasks = useMemo(() => {
    if (!currentBoard) return [];
    return getTasksByBoard(currentBoard.id);
  }, [tasks, currentBoard, getTasksByBoard]);

  // Update filtered tasks when board tasks change
  useEffect(() => {
    setFilteredTasks(boardTasks);
  }, [boardTasks]);

  const handleFilterChange = (filtered: Task[]) => {
    setFilteredTasks(filtered);
  };

  // Enhanced addTask to include current board
  const handleAddTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const taskWithBoard = {
      ...task,
      boardId: currentBoard?.id || 'default',
    };
    addTask(taskWithBoard);
  };

  // Fixed task reordering within columns
  const handleReorderTasks = (draggedTaskId: string, targetTaskId: string, position: 'before' | 'after') => {
    const draggedTask = filteredTasks.find(t => t.id === draggedTaskId);
    const targetTask = filteredTasks.find(t => t.id === targetTaskId);
    
    if (!draggedTask || !targetTask || draggedTask.status !== targetTask.status) {
      return;
    }

    // Get all tasks in the same column, sorted by creation date
    const columnTasks = filteredTasks
      .filter(t => t.status === draggedTask.status)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    // Remove the dragged task from the array
    const tasksWithoutDragged = columnTasks.filter(t => t.id !== draggedTaskId);
    
    // Find the target task index in the filtered array
    const targetIndex = tasksWithoutDragged.findIndex(t => t.id === targetTaskId);
    const insertIndex = position === 'before' ? targetIndex : targetIndex + 1;

    // Insert the dragged task at the new position
    tasksWithoutDragged.splice(insertIndex, 0, draggedTask);

    // Update timestamps to reflect new order
    const baseTime = Date.now();
    tasksWithoutDragged.forEach((task, index) => {
      const newCreatedAt = new Date(baseTime + index * 1000);
      updateTask(task.id, { createdAt: newCreatedAt });
    });
  };

  const handleQuickAddColumn = () => {
    const columnTitle = prompt('Digite o título da nova coluna:');
    if (columnTitle && columnTitle.trim()) {
      const newColumn: Column = {
        id: Date.now().toString(),
        title: columnTitle.trim(),
        status: 'todo', // Default status
      };
      setColumns([...columns, newColumn]);
    }
  };

  if (!currentBoard) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-foreground">{pt.dashboard.noBoard}</h2>
          <p className="text-muted-foreground">{pt.dashboard.selectBoard}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <DashboardHeader
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onNewTask={() => setShowNewTaskModal(true)}
        onQuickAddColumn={handleQuickAddColumn}
      />

      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Performance Section */}
        <DashboardStats stats={userStats} />

        {/* Task Filter Section */}
        <DashboardFilters
          tasks={boardTasks}
          onFilterChange={handleFilterChange}
          isVisible={showFilters}
        />

        {/* Board Info */}
        <BoardInfo board={currentBoard} taskCount={filteredTasks.length} />

        {/* Kanban Board */}
        <KanbanBoard
          columns={columns}
          tasks={filteredTasks}
          onUpdateTask={updateTask}
          onDeleteTask={deleteTask}
          onAddTask={handleAddTask}
          onReorderTasks={handleReorderTasks}
          onQuickAddColumn={handleQuickAddColumn}
        />
      </div>

      {/* New Task Modal */}
      <TaskEditModal
        isOpen={showNewTaskModal}
        onClose={() => setShowNewTaskModal(false)}
        onSaveTask={handleAddTask}
        defaultStatus="todo"
        mode="create"
      />
    </div>
  );
};
