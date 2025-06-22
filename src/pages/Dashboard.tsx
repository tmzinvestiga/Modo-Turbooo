
import React, { useState, useMemo, useEffect } from 'react';
import { TaskColumn } from '@/components/TaskColumn';
import { UserStatsCard } from '@/components/UserStatsCard';
import { TaskFilter } from '@/components/TaskFilter';
import { BoardSelector } from '@/components/BoardSelector';
import { ColumnManager } from '@/components/ColumnManager';
import { TaskEditModal } from '@/components/TaskEditModal';
import { useTaskStore } from '@/hooks/useTaskStore';
import { useBoard } from '@/contexts/BoardContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Task } from '@/types/Task';
import { BarChart3, Filter, Plus } from 'lucide-react';
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
  const isMobile = useIsMobile();
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

  // Column management functions
  const handleAddColumn = (column: Omit<Column, 'id'>) => {
    const newColumn: Column = {
      ...column,
      id: Date.now().toString(),
    };
    setColumns([...columns, newColumn]);
  };

  const handleUpdateColumn = (columnId: string, updates: Partial<Column>) => {
    setColumns(columns.map(col => 
      col.id === columnId ? { ...col, ...updates } : col
    ));
  };

  const handleDeleteColumn = (columnId: string) => {
    if (columns.length <= 1) return;
    
    // Move all tasks from deleted column to 'todo'
    const columnTasks = filteredTasks.filter(task => task.status === columns.find(c => c.id === columnId)?.status);
    columnTasks.forEach(task => {
      updateTask(task.id, { status: 'todo' });
    });
    
    setColumns(columns.filter(col => col.id !== columnId));
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
      {/* Secondary header */}
      <div className="bg-card border-b shadow-sm">
        <div className="flex items-center justify-between p-4 md:p-6">
          <div className="flex items-center gap-4">
            <BoardSelector />
          </div>
          
          <div className="flex items-center gap-2 md:gap-3">
            <ColumnManager
              columns={columns}
              onAddColumn={handleAddColumn}
              onUpdateColumn={handleUpdateColumn}
              onDeleteColumn={handleDeleteColumn}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">{pt.dashboard.filters}</span>
            </Button>
            <Button 
              size="sm" 
              className="flex items-center gap-2"
              onClick={() => setShowNewTaskModal(true)}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">{pt.dashboard.newTask}</span>
            </Button>
          </div>
        </div>
      </div>

      <div className={`p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6 ${isMobile ? '' : ''}`}>
        {/* Performance Section */}
        <div className="animate-fade-in">
          <UserStatsCard stats={userStats} />
        </div>

        {/* Task Filter Section */}
        {showFilters && (
          <div className="animate-fade-in">
            <TaskFilter tasks={boardTasks} onFilterChange={handleFilterChange} />
          </div>
        )}

        {/* Board Info */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">{currentBoard.name}</h1>
            {currentBoard.description && (
              <p className="text-muted-foreground mt-1 text-sm md:text-base">{currentBoard.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BarChart3 className="w-4 h-4" />
            {filteredTasks.length} {pt.dashboard.tasks}
          </div>
        </div>

        {/* Dynamic Kanban Board */}
        <div className={`animate-fade-in ${
          isMobile 
            ? 'flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory' 
            : `grid gap-6 ${columns.length <= 3 ? 'grid-cols-1 lg:grid-cols-3' : `grid-cols-1 lg:grid-cols-${Math.min(columns.length, 4)}`}`
        }`}>
          {columns.map((column) => (
            <div key={column.id} className={isMobile ? 'flex-shrink-0 w-80 snap-start' : ''}>
              <TaskColumn
                title={column.title}
                status={column.status}
                tasks={filteredTasks}
                onUpdateTask={updateTask}
                onDeleteTask={deleteTask}
                onAddTask={handleAddTask}
                onReorderTasks={handleReorderTasks}
              />
            </div>
          ))}
        </div>
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
