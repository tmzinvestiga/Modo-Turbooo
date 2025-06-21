
import React, { useState, useMemo, useEffect } from 'react';
import { TaskColumn } from '@/components/TaskColumn';
import { UserStatsCard } from '@/components/UserStatsCard';
import { TaskFilter } from '@/components/TaskFilter';
import { BoardSelector } from '@/components/BoardSelector';
import { NewTaskModal } from '@/components/NewTaskModal';
import { useTaskStore } from '@/hooks/useTaskStore';
import { useBoard } from '@/contexts/BoardContext';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Task } from '@/types/Task';
import { BarChart3, Filter, Plus } from 'lucide-react';

export const Dashboard = () => {
  const { tasks, userStats, addTask, updateTask, deleteTask, getTasksByBoard } = useTaskStore();
  const { currentBoard } = useBoard();
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);

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

  if (!currentBoard) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Nenhum quadro selecionado</h2>
          <p className="text-muted-foreground">Selecione um quadro para visualizar suas tarefas.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Modern header */}
      <header className="bg-card border-b shadow-soft">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-foreground" />
            <BoardSelector />
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filtros
            </Button>
            <Button 
              size="sm" 
              className="flex items-center gap-2"
              onClick={() => setShowNewTaskModal(true)}
            >
              <Plus className="w-4 h-4" />
              Nova Tarefa
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Performance Section */}
        <div className="animate-fade-in">
          <UserStatsCard stats={userStats} />
        </div>

        {/* Task Filter Section */}
        {showFilters && (
          <div className="animate-slide-up">
            <TaskFilter tasks={boardTasks} onFilterChange={handleFilterChange} />
          </div>
        )}

        {/* Board Info */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{currentBoard.name}</h1>
            {currentBoard.description && (
              <p className="text-muted-foreground mt-1">{currentBoard.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BarChart3 className="w-4 h-4" />
            {filteredTasks.length} tarefas
          </div>
        </div>

        {/* Modern Kanban Board */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          <TaskColumn
            title="A Fazer"
            status="todo"
            tasks={filteredTasks}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            onAddTask={handleAddTask}
          />
          <TaskColumn
            title="Fazendo"
            status="doing"
            tasks={filteredTasks}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            onAddTask={handleAddTask}
          />
          <TaskColumn
            title="Concluído"
            status="done"
            tasks={filteredTasks}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            onAddTask={handleAddTask}
          />
        </div>
      </div>

      {/* New Task Modal */}
      <NewTaskModal
        isOpen={showNewTaskModal}
        onClose={() => setShowNewTaskModal(false)}
        onAddTask={handleAddTask}
        defaultStatus="todo"
      />
    </div>
  );
};
