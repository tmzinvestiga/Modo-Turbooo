
import React, { useState, useMemo } from 'react';
import { TaskColumn } from '@/components/TaskColumn';
import { UserStatsCard } from '@/components/UserStatsCard';
import { TaskFilter } from '@/components/TaskFilter';
import { useTaskStore } from '@/hooks/useTaskStore';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Task } from '@/types/Task';

export const Dashboard = () => {
  const { tasks, userStats, addTask, updateTask, deleteTask } = useTaskStore();
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);

  // Update filtered tasks when original tasks change
  useMemo(() => {
    setFilteredTasks(tasks);
  }, [tasks]);

  const handleFilterChange = (filtered: Task[]) => {
    setFilteredTasks(filtered);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Minimal header with just the sidebar trigger */}
      <header className="bg-card border-b border-border p-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-foreground" />
        </div>
      </header>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Performance Section - Prominently displayed at top */}
        <div className="mb-8">
          <UserStatsCard stats={userStats} />
        </div>

        {/* Task Filter Section */}
        <TaskFilter tasks={tasks} onFilterChange={handleFilterChange} />

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TaskColumn
            title="A Fazer"
            status="todo"
            tasks={filteredTasks}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            onAddTask={addTask}
          />
          <TaskColumn
            title="Fazendo"
            status="doing"
            tasks={filteredTasks}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            onAddTask={addTask}
          />
          <TaskColumn
            title="Concluído"
            status="done"
            tasks={filteredTasks}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            onAddTask={addTask}
          />
        </div>
      </div>
    </div>
  );
};
