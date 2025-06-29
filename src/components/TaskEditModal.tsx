
import React, { useState, useEffect } from 'react';
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
import { ColorLabelSelector } from '@/components/ColorLabelSelector';
import { format } from 'date-fns';
import { CalendarIcon, Tag, X, Save, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { pt } from '@/utils/localization';

interface TaskEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
  onSaveTask: (task: Omit<Task, 'id' | 'createdAt'> | Task) => void;
  onDeleteTask?: (taskId: string) => void;
  defaultStatus?: 'todo' | 'doing' | 'done';
  mode: 'create' | 'edit';
}

export const TaskEditModal = ({ 
  isOpen, 
  onClose, 
  task,
  onSaveTask,
  onDeleteTask,
  defaultStatus = 'todo',
  mode
}: TaskEditModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: defaultStatus as 'todo' | 'doing' | 'done',
    priority: undefined as 'low' | 'medium' | 'high' | 'critical' | undefined,
    dueDate: new Date(),
    dueTime: '',
    recurrence: 'none' as 'none' | 'daily' | 'weekly' | 'monthly' | 'custom',
    weekdays: [] as number[],
    tags: [] as string[],
    labels: [] as string[] // Now represents color IDs
  });
  
  const [newTag, setNewTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const weekdayNames = [pt.weekdays.sun, pt.weekdays.mon, pt.weekdays.tue, pt.weekdays.wed, pt.weekdays.thu, pt.weekdays.fri, pt.weekdays.sat];

  // Initialize form data when task changes
  useEffect(() => {
    if (task && mode === 'edit') {
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        dueTime: task.dueTime || '',
        recurrence: task.recurrence || 'none',
        weekdays: task.recurrencePattern?.weekdays || [],
        tags: task.tags || [],
        labels: task.labels || []
      });
    } else {
      // Reset for create mode
      setFormData({
        title: '',
        description: '',
        status: defaultStatus,
        priority: undefined,
        dueDate: new Date(),
        dueTime: '',
        recurrence: 'none',
        weekdays: [],
        tags: [],
        labels: []
      });
    }
  }, [task, mode, defaultStatus]);

  const handleClose = () => {
    setNewTag('');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast({
        title: pt.messages.error,
        description: pt.messages.taskTitleRequired,
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const taskData = {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        points: formData.priority === 'critical' ? 20 : formData.priority === 'high' ? 15 : formData.priority === 'medium' ? 10 : 5,
        dueTime: formData.dueTime || undefined,
        tags: formData.tags.length > 0 ? formData.tags : undefined,
        labels: formData.labels.length > 0 ? formData.labels : undefined,
        recurrencePattern: formData.recurrence !== 'none' ? {
          weekdays: formData.recurrence === 'weekly' && formData.weekdays.length > 0 ? formData.weekdays : undefined,
        } : undefined,
        isRecurring: formData.recurrence !== 'none',
      };

      if (mode === 'edit' && task) {
        onSaveTask({ ...task, ...taskData });
        toast({
          title: pt.messages.success,
          description: pt.messages.taskUpdated
        });
      } else {
        onSaveTask(taskData);
        toast({
          title: pt.messages.success, 
          description: pt.messages.taskCreated
        });
      }

      handleClose();
    } catch (error) {
      toast({
        title: pt.messages.error,
        description: pt.messages.failedToSave,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    if (task && onDeleteTask) {
      onDeleteTask(task.id);
      toast({
        title: pt.messages.success,
        description: pt.messages.taskDeleted
      });
      handleClose();
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  const toggleWeekday = (day: number) => {
    setFormData(prev => ({
      ...prev,
      weekdays: prev.weekdays.includes(day) 
        ? prev.weekdays.filter(d => d !== day)
        : [...prev.weekdays, day]
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit' ? pt.modal.editTask : pt.modal.createTask}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">{pt.modal.taskTitle} *</Label>
            <Input
              id="title"
              placeholder={pt.modal.titlePlaceholder}
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              autoFocus
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">{pt.modal.description}</Label>
            <Textarea
              id="description"
              placeholder={pt.modal.descriptionPlaceholder}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status */}
            <div className="space-y-2">
              <Label>{pt.modal.status}</Label>
              <Select value={formData.status} onValueChange={(value: 'todo' | 'doing' | 'done') => 
                setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">{pt.columns.todo}</SelectItem>
                  <SelectItem value="doing">{pt.columns.doing}</SelectItem>
                  <SelectItem value="done">{pt.columns.done}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label>{pt.modal.priority}</Label>
              <Select value={formData.priority || 'none'} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, priority: value === 'none' ? undefined : value as any }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{pt.modal.noPriority}</SelectItem>
                  <SelectItem value="low">{pt.modal.low}</SelectItem>
                  <SelectItem value="medium">{pt.modal.medium}</SelectItem>
                  <SelectItem value="high">{pt.modal.high}</SelectItem>
                  <SelectItem value="critical">{pt.modal.critical}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Due Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{pt.modal.dueDate}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {format(formData.dueDate, 'dd/MM/yyyy')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.dueDate}
                    onSelect={(date) => date && setFormData(prev => ({ ...prev, dueDate: date }))}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueTime">{pt.modal.dueTime}</Label>
              <Input
                id="dueTime"
                type="time"
                value={formData.dueTime}
                onChange={(e) => setFormData(prev => ({ ...prev, dueTime: e.target.value }))}
              />
            </div>
          </div>

          {/* Recurrence */}
          <div className="space-y-2">
            <Label>{pt.modal.recurrence}</Label>
            <Select value={formData.recurrence} onValueChange={(value: any) => 
              setFormData(prev => ({ ...prev, recurrence: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{pt.modal.oneTime}</SelectItem>
                <SelectItem value="daily">{pt.modal.daily}</SelectItem>
                <SelectItem value="weekly">{pt.modal.weekly}</SelectItem>
                <SelectItem value="monthly">{pt.modal.monthly}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Weekly Recurrence Days */}
          {formData.recurrence === 'weekly' && (
            <div className="space-y-2">
              <Label>{pt.modal.repeatOn}</Label>
              <div className="flex gap-2 flex-wrap">
                {weekdayNames.map((day, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox
                      id={`weekday-${index}`}
                      checked={formData.weekdays.includes(index)}
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
            <Label>{pt.modal.tags}</Label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {formData.tags.map((tag) => (
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
                placeholder={pt.modal.addTag}
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
                {pt.modal.add}
              </Button>
            </div>
          </div>

          {/* Color Labels */}
          <ColorLabelSelector
            selectedColors={formData.labels}
            onColorsChange={(colors) => setFormData(prev => ({ ...prev, labels: colors }))}
          />

          {/* Form Actions */}
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1" disabled={isLoading}>
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? pt.modal.saving : (mode === 'edit' ? pt.modal.updateTask : pt.modal.createTask)}
            </Button>
            {mode === 'edit' && onDeleteTask && (
              <Button type="button" variant="destructive" onClick={handleDelete}>
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
            <Button type="button" variant="outline" onClick={handleClose}>
              {pt.modal.cancel}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
