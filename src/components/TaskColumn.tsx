
import React, { useState } from 'react';
import { Task } from '@/types/Task';
import { TaskCard } from './TaskCard';
import { QuickAddTask } from './QuickAddTask';
import { TaskEditModal } from './TaskEditModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit2, Check, X } from 'lucide-react';

interface TaskColumnProps {
  title: string;
  status: 'todo' | 'doing' | 'done';
  tasks: Task[];
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onReorderTasks: (draggedTaskId: string, targetTaskId: string, position: 'before' | 'after') => void;
}

export const TaskColumn = ({ 
  title, 
  status, 
  tasks, 
  onUpdateTask, 
  onDeleteTask, 
  onAddTask,
  onReorderTasks
}: TaskColumnProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [columnTitle, setColumnTitle] = useState(title);
  const [tempTitle, setTempTitle] = useState(title);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [dragOverTaskId, setDragOverTaskId] = useState<string | null>(null);
  const [dragPosition, setDragPosition] = useState<'before' | 'after'>('after');
  
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
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
      setDragOverTaskId(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setDragOverTaskId(null);
    
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      onUpdateTask(taskId, { status });
    }
  };

  const handleTaskDragOver = (e: React.DragEvent, taskId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const rect = e.currentTarget.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const position = e.clientY < midY ? 'before' : 'after';
    
    setDragOverTaskId(taskId);
    setDragPosition(position);
  };

  const handleTaskDrop = (e: React.DragEvent, targetTaskId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const draggedTaskId = e.dataTransfer.getData('text/plain');
    if (draggedTaskId && draggedTaskId !== targetTaskId) {
      // Check if it's a reorder within the same column
      const draggedTask = tasks.find(t => t.id === draggedTaskId);
      if (draggedTask && draggedTask.status === status) {
        onReorderTasks(draggedTaskId, targetTaskId, dragPosition);
      } else {
        // Cross-column move
        onUpdateTask(draggedTaskId, { status });
      }
    }
    
    setDragOverTaskId(null);
  };

  const handleTitleEdit = () => {
    setIsEditingTitle(true);
    setTempTitle(columnTitle);
  };

  const handleTitleSave = () => {
    setColumnTitle(tempTitle);
    setIsEditingTitle(false);
  };

  const handleTitleCancel = () => {
    setTempTitle(columnTitle);
    setIsEditingTitle(false);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleSaveTask = (taskData: Task) => {
    onUpdateTask(taskData.id, taskData);
    setEditingTask(null);
  };

  return (
    <>
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
          {columnTasks.map((task, index) => (
            <div
              key={task.id}
              className={`relative ${
                dragOverTaskId === task.id
                  ? `${dragPosition === 'before' ? 'border-t-2' : 'border-b-2'} border-primary`
                  : ''
              }`}
              onDragOver={(e) => handleTaskDragOver(e, task.id)}
              onDrop={(e) => handleTaskDrop(e, task.id)}
            >
              <TaskCard
                task={task}
                onUpdateTask={onUpdateTask}
                onDeleteTask={onDeleteTask}
                onEditTask={handleEditTask}
              />
            </div>
          ))}
          
          <QuickAddTask onAddTask={onAddTask} defaultStatus={status} />
        </div>
      </div>

      {/* Task Edit Modal */}
      <TaskEditModal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        task={editingTask}
        onSaveTask={handleSaveTask}
        onDeleteTask={onDeleteTask}
        mode="edit"
      />
    </>
  );
};
