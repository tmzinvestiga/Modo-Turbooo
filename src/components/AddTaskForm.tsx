
import React, { useState } from 'react';
import { Task } from '@/types/Task';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

interface AddTaskFormProps {
  initialStatus: 'todo' | 'doing' | 'done';
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export const AddTaskForm = ({ initialStatus, onAddTask, onCancel }: AddTaskFormProps) => {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [recurrence, setRecurrence] = useState<'once' | 'daily' | 'weekly'>('once');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      dueDate,
      recurrence,
      status: initialStatus,
      points: 10,
    });

    setTitle('');
    setDueDate(new Date());
    setRecurrence('once');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-700 p-4 rounded-lg border border-gray-600 space-y-3">
      <Input
        placeholder="Task title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
        autoFocus
      />
      
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex-1 justify-start bg-gray-800 border-gray-600 text-white">
              <CalendarIcon className="w-4 h-4 mr-2" />
              {format(dueDate, 'MMM dd, yyyy')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-600">
            <Calendar
              mode="single"
              selected={dueDate}
              onSelect={(date) => date && setDueDate(date)}
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        
        <Select value={recurrence} onValueChange={(value: 'once' | 'daily' | 'weekly') => setRecurrence(value)}>
          <SelectTrigger className="flex-1 bg-gray-800 border-gray-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-600">
            <SelectItem value="once">Once</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex gap-2">
        <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700">
          Add Task
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
