
import React, { useState } from 'react';
import { Task } from '@/types/Task';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Check, X } from 'lucide-react';

interface QuickAddTaskProps {
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  defaultStatus: 'todo' | 'doing' | 'done';
}

export const QuickAddTask = ({ onAddTask, defaultStatus }: QuickAddTaskProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: Omit<Task, 'id' | 'createdAt'> = {
      title: title.trim(),
      status: defaultStatus,
      points: 5,
      dueDate: new Date(),
      recurrence: 'none',
      isRecurring: false
    };

    onAddTask(newTask);
    setTitle('');
    setIsAdding(false);
  };

  const handleCancel = () => {
    setTitle('');
    setIsAdding(false);
  };

  if (isAdding) {
    return (
      <form onSubmit={handleSubmit} className="space-y-2 p-3 bg-muted/30 rounded-lg border-2 border-dashed border-primary/30">
        <Input
          placeholder="Task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
          className="text-sm"
        />
        <div className="flex gap-2">
          <Button type="submit" size="sm" className="flex-1">
            <Check className="w-3 h-3 mr-1" />
            Add
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={handleCancel}>
            <X className="w-3 h-3" />
          </Button>
        </div>
      </form>
    );
  }

  return (
    <Button
      variant="ghost"
      className="w-full text-muted-foreground hover:text-foreground hover:bg-muted/50 border-2 border-dashed border-muted hover:border-muted-foreground/50 h-16 transition-all duration-200 group"
      onClick={() => setIsAdding(true)}
    >
      <div className="flex flex-col items-center gap-2">
        <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
        <span className="text-sm">Add Task</span>
      </div>
    </Button>
  );
};
