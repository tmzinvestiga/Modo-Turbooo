
import React, { useState } from 'react';
import { Task } from '@/types/Task';
import { TaskCard } from './TaskCard';
import { AddTaskForm } from './AddTaskForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Edit2, Check, X } from 'lucide-react';

interface TaskColumnProps {
  title: string;
  status: 'todo' | 'doing' | 'done';
  tasks: Task[];
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
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
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [columnTitle, setColumnTitle] = useState(title);
  const [tempTitle, setTempTitle] = useState(title);
  
  const columnTasks = tasks.filter(task => task.status === status);
  
  const getColumnColor = () => {
    switch (status) {
      case 'todo': return 'border-accent';
      case 'doing': return 'border-yellow-500';
      case 'done': return 'border-green-500';
    }
  };

  const getColumnBgColor = () => {
    switch (status) {
      case 'todo': return 'bg-accent/5';
      case 'doing': return 'bg-yellow-500/5';
      case 'done': return 'bg-green-500/5';
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

  const handleTitleEdit = () => {
    setIsEditingTitle(true);
    setTempTitle(columnTitle);
  };

  const handleTitleSave = () => {
    setColumnTitle(tempTitle);
    setIsEditingTitle(false);
    // TODO: Save column title to backend when available
  };

  const handleTitleCancel = () => {
    setTempTitle(columnTitle);
    setIsEditingTitle(false);
  };

  return (
    <div 
      className={`bg-card rounded-xl border-t-4 ${getColumnColor()} ${getColumnBgColor()} min-h-[600px] flex flex-col transition-all duration-200 shadow-sm hover:shadow-md ${
        isDragOver ? 'ring-2 ring-primary/50 scale-[1.02]' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {isEditingTitle ? (
            <div className="flex items-center gap-2 flex-1">
              <Input
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                className="text-sm font-semibold"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleTitleSave();
                  if (e.key === 'Escape') handleTitleCancel();
                }}
                autoFocus
              />
              <Button size="sm" variant="ghost" onClick={handleTitleSave}>
                <Check className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="ghost" onClick={handleTitleCancel}>
                <X className="w-3 h-3" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-1 group">
              <h2 className="text-foreground font-semibold">{columnTitle}</h2>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={handleTitleEdit}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit2 className="w-3 h-3" />
              </Button>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="bg-muted text-muted-foreground px-2 py-1 rounded-full text-sm font-medium">
              {columnTasks.length}
            </span>
          </div>
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
            className="w-full text-muted-foreground hover:text-foreground hover:bg-muted/50 border-2 border-dashed border-muted hover:border-muted-foreground/50 h-20 transition-all duration-200 group"
            onClick={() => setShowAddForm(true)}
          >
            <div className="flex flex-col items-center gap-2">
              <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-sm">Adicionar Tarefa</span>
            </div>
          </Button>
        )}
      </div>
    </div>
  );
};
