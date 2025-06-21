
import React, { useState } from 'react';
import { Task } from '@/types/Task';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { CalendarIcon, Plus, Settings, X, Tag } from 'lucide-react';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  defaultStatus?: 'todo' | 'doing' | 'done';
}

export const NewTaskModal = ({ 
  isOpen, 
  onClose, 
  onAddTask, 
  defaultStatus = 'todo' 
}: NewTaskModalProps) => {
  const [mode, setMode] = useState<'quick' | 'customize'>('quick');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'todo' | 'doing' | 'done'>(defaultStatus);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical' | undefined>(undefined);
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [dueTime, setDueTime] = useState('');
  const [recurrence, setRecurrence] = useState<'none' | 'daily' | 'weekly' | 'monthly' | 'custom'>('none');
  const [weekdays, setWeekdays] = useState<number[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [labels, setLabels] = useState<string[]>([]);
  const [newLabel, setNewLabel] = useState('');

  const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleClose = () => {
    // Reset form
    setMode('quick');
    setTitle('');
    setDescription('');
    setStatus(defaultStatus);
    setPriority(undefined);
    setDueDate(new Date());
    setDueTime('');
    setRecurrence('none');
    setWeekdays([]);
    setTags([]);
    setNewTag('');
    setLabels([]);
    setNewLabel('');
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const taskData: Omit<Task, 'id' | 'createdAt'> = {
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      priority,
      points: priority === 'critical' ? 20 : priority === 'high' ? 15 : priority === 'medium' ? 10 : 5,
      dueDate,
      dueTime: dueTime || undefined,
      tags: tags.length > 0 ? tags : undefined,
      labels: labels.length > 0 ? labels : undefined,
      recurrence,
      recurrencePattern: recurrence !== 'none' ? {
        weekdays: recurrence === 'weekly' && weekdays.length > 0 ? weekdays : undefined,
      } : undefined,
      isRecurring: recurrence !== 'none',
    };

    onAddTask(taskData);
    handleClose();
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const addLabel = () => {
    if (newLabel.trim() && !labels.includes(newLabel.trim())) {
      setLabels([...labels, newLabel.trim()]);
      setNewLabel('');
    }
  };

  const removeLabel = (labelToRemove: string) => {
    setLabels(labels.filter(label => label !== labelToRemove));
  };

  const toggleWeekday = (day: number) => {
    if (weekdays.includes(day)) {
      setWeekdays(weekdays.filter(d => d !== day));
    } else {
      setWeekdays([...weekdays, day]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>

        {/* Mode Toggle */}
        <div className="flex gap-2 mb-4">
          <Button
            type="button"
            variant={mode === 'quick' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('quick')}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Quick Add
          </Button>
          <Button
            type="button"
            variant={mode === 'customize' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('customize')}
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Customize
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title - Always visible */}
          <div className="space-y-2">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              required
            />
          </div>

          {/* Status Selection - Always visible */}
          <div className="space-y-2">
            <Label>Add to Column</Label>
            <Select value={status} onValueChange={(value: 'todo' | 'doing' | 'done') => setStatus(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="doing">Doing</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Customize Mode Additional Fields */}
          {mode === 'customize' && (
            <>
              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Add more details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={priority || 'none'} onValueChange={(value) => setPriority(value === 'none' ? undefined : value as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Priority</SelectItem>
                    <SelectItem value="low">P3 - Low</SelectItem>
                    <SelectItem value="medium">P2 - Medium</SelectItem>
                    <SelectItem value="high">P1 - High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Due Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        {format(dueDate, 'MMM dd, yyyy')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dueDate}
                        onSelect={(date) => date && setDueDate(date)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueTime">Due Time (Optional)</Label>
                  <Input
                    id="dueTime"
                    type="time"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                  />
                </div>
              </div>

              {/* Recurrence */}
              <div className="space-y-2">
                <Label>Recurrence</Label>
                <Select value={recurrence} onValueChange={(value: any) => setRecurrence(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">One-time</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Weekly Recurrence Days */}
              {recurrence === 'weekly' && (
                <div className="space-y-2">
                  <Label>Repeat on</Label>
                  <div className="flex gap-2 flex-wrap">
                    {weekdayNames.map((day, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox
                          id={`weekday-${index}`}
                          checked={weekdays.includes(index)}
                          onCheckedChange={() => toggleWeekday(index)}
                        />
                        <Label htmlFor={`weekday-${index}`} className="text-sm">
                          {day}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2 mb-2 flex-wrap">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={addTag}>
                    Add
                  </Button>
                </div>
              </div>

              {/* Labels */}
              <div className="space-y-2">
                <Label>Labels</Label>
                <div className="flex gap-2 mb-2 flex-wrap">
                  {labels.map((label) => (
                    <Badge key={label} variant="outline" className="flex items-center gap-1">
                      {label}
                      <button
                        type="button"
                        onClick={() => removeLabel(label)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add label..."
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addLabel();
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={addLabel}>
                    Add
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Form Actions */}
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              Create Task
            </Button>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
