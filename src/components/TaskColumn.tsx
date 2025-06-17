
import React, { useState } from 'react';
import { Task } from '@/types/Task';
import { TaskCard } from './TaskCard';
import { AddTaskForm } from './AddTaskForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface TaskColumnProps {
  title: string;
  status: 'todo' | 'doing' | 'done';
  tasks: Task[];
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask: (task: Omit<Task, 'id'>) => void;
}

export const TaskColumn = ({ 
  title, 
  status, 
  tasks, 
  onUpdateTask, 
  onDeleteTask, 
  onAddTask 
}: TaskColumnProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  
  const columnTasks = tasks.filter(task => task.status === status);
  
  const getColumnColor = () => {
    switch (status) {
      case 'todo': return 'border-blue-500';
      case 'doing': return 'border-yellow-500';
      case 'done': return 'border-green-500';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      onUpdateTask(taskId, { status });
    }
  };

  return (
    <div 
      className={`bg-gray-800 rounded-lg border-t-4 ${getColumnColor()} min-h-[600px] flex flex-col transition-all ${
        isDragOver ? 'bg-gray-700 ring-2 ring-blue-500' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-semibold">{title}</h2>
          <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-sm">
            {columnTasks.length}
          </span>
        </div>
      </div>
      
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {columnTasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
          />
        ))}
        
        {showAddForm ? (
          <AddTaskForm
            initialStatus={status}
            onAddTask={(task) => {
              onAddTask(task);
              setShowAddForm(false);
            }}
            onCancel={() => setShowAddForm(false)}
          />
        ) : (
          <Button
            variant="ghost"
            className="w-full text-gray-400 hover:text-white hover:bg-gray-700 border-2 border-dashed border-gray-600 hover:border-gray-500 h-20"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Task
          </Button>
        )}
      </div>
    </div>
  );
};
