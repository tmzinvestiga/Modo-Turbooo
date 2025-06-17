
import React from 'react';
import { TaskColumn } from '@/components/TaskColumn';
import { UserStatsCard } from '@/components/UserStatsCard';
import { useTaskStore } from '@/hooks/useTaskStore';
import { SidebarTrigger } from '@/components/ui/sidebar';

export const Dashboard = () => {
  const { tasks, userStats, addTask, updateTask, deleteTask } = useTaskStore();

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-white" />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">Task Board</h1>
            <p className="text-gray-400">Manage your daily tasks and boost productivity</p>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="mb-6">
          <UserStatsCard stats={userStats} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TaskColumn
            title="To Do"
            status="todo"
            tasks={tasks}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            onAddTask={addTask}
          />
          <TaskColumn
            title="Doing"
            status="doing"
            tasks={tasks}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            onAddTask={addTask}
          />
          <TaskColumn
            title="Done"
            status="done"
            tasks={tasks}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            onAddTask={addTask}
          />
        </div>
      </div>
    </div>
  );
};
