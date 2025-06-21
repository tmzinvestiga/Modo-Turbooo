
import React, { useState } from 'react';
import { Task } from '@/types/Task';
import { Calendar, Clock, RotateCcw, AlertCircle, Tag, Edit2, Trash2, CheckCircle2, GripVertical } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format, isPast, isToday, isTomorrow } from 'date-fns';
import { pt, colorOptions } from '@/utils/localization';

interface TaskCardProps {
  task: Task;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  isMobile?: boolean;
  isDraggingMobile?: boolean;
}

export const TaskCard = ({ 
  task, 
  onUpdateTask, 
  onDeleteTask, 
  onEditTask, 
  isMobile = false,
  isDraggingMobile = false 
}: TaskCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const isTaskOverdue = isPast(task.dueDate) && task.status !== 'done';
  const isDueToday = isToday(task.dueDate);
  const isDueTomorrow = isTomorrow(task.dueDate);
  
  const getRecurrenceIcon = () => {
    switch (task.recurrence) {
      case 'daily': return <RotateCcw className="w-3 h-3" />;
      case 'weekly': return <Calendar className="w-3 h-3" />;
      case 'monthly': return <Calendar className="w-3 h-3" />;
      default: return null;
    }
  };

  const getRecurrenceText = () => {
    switch (task.recurrence) {
      case 'daily': return pt.modal.daily;
      case 'weekly': return pt.modal.weekly;
      case 'monthly': return pt.modal.monthly;
      default: return null;
    }
  };

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'critical': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'high': return 'text-red-500 bg-red-100 dark:bg-red-900/20';
      case 'medium': return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20';
      case 'low': return 'text-green-500 bg-green-100 dark:bg-green-900/20';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getPriorityText = () => {
    switch (task.priority) {
      case 'critical': return pt.modal.critical;
      case 'high': return pt.modal.high;
      case 'medium': return pt.modal.medium;
      case 'low': return pt.modal.low;
      default: return null;
    }
  };

  const getStatusColor = () => {
    if (task.status === 'done') return 'bg-green-600';
    if (task.status === 'doing') return 'bg-yellow-600';
    return isTaskOverdue ? 'bg-red-600' : 'bg-accent';
  };

  const getDueDateColor = () => {
    if (task.status === 'done') return 'text-green-600';
    if (isTaskOverdue) return 'text-red-500';
    if (isDueToday) return 'text-orange-500';
    if (isDueTomorrow) return 'text-yellow-500';
    return 'text-muted-foreground';
  };

  const getDueDateText = () => {
    if (isDueToday) return pt.task.today;
    if (isDueTomorrow) return pt.task.tomorrow;
    if (isTaskOverdue) return pt.task.overdue;
    return format(task.dueDate, 'dd/MM');
  };

  const getColorLabels = () => {
    if (!task.labels || task.labels.length === 0) return [];
    return task.labels.map(colorId => 
      colorOptions.find(color => color.id === colorId)
    ).filter(Boolean);
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleComplete = () => {
    if (task.status !== 'done') {
      onUpdateTask(task.id, { status: 'done' });
      
      if (task.recurrence && task.recurrence !== 'none') {
        console.log('TODO: Create new recurring task instance');
      }
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent edit modal from opening when clicking action buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    onEditTask(task);
  };

  const colorLabels = getColorLabels();

  return (
    <Card 
      className={`bg-card border-border hover:border-accent/50 transition-all duration-200 cursor-pointer group hover:shadow-md ${
        isDragging || isDraggingMobile ? 'opacity-50 rotate-2 scale-105' : ''
      } ${isHovered ? 'shadow-lg' : 'shadow-sm'} ${isMobile ? 'select-none' : ''}`}
      draggable={!isMobile}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <CardContent className="p-3 md:p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-2 flex-1">
            {!isMobile && (
              <GripVertical className="w-4 h-4 text-muted-foreground/50 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
            )}
            <h3 className="text-foreground font-medium text-sm leading-tight flex-1 pr-2">
              {task.title}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
            {(isHovered || isMobile) && (
              <div className={`flex gap-1 ${isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditTask(task);
                  }}
                >
                  <Edit2 className="w-3 h-3 text-blue-500" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 hover:bg-red-100 dark:hover:bg-red-900/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteTask(task.id);
                  }}
                >
                  <Trash2 className="w-3 h-3 text-red-500" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {task.description && (
          <p className="text-muted-foreground text-xs mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Color Labels */}
        {colorLabels.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {colorLabels.slice(0, 4).map((color) => (
              <div
                key={color!.id}
                className={`w-4 h-4 rounded-full ${color!.bg} border border-white/20 shadow-sm`}
                title={color!.name}
              />
            ))}
            {colorLabels.length > 4 && (
              <div className="w-4 h-4 rounded-full bg-gray-300 border border-white/20 shadow-sm flex items-center justify-center">
                <span className="text-[8px] font-medium text-gray-700">+{colorLabels.length - 4}</span>
              </div>
            )}
          </div>
        )}
        
        <div className="flex items-center gap-3 text-xs mb-3">
          <div className={`flex items-center gap-1 ${getDueDateColor()}`}>
            <Calendar className="w-3 h-3" />
            <span className="font-medium">{getDueDateText()}</span>
            {task.dueTime && (
              <>
                <Clock className="w-3 h-3 ml-1" />
                <span>{task.dueTime}</span>
              </>
            )}
          </div>
          
          {task.recurrence && task.recurrence !== 'none' && (
            <div className="flex items-center gap-1 text-primary">
              {getRecurrenceIcon()}
              <span>{getRecurrenceText()}</span>
            </div>
          )}
        </div>

        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {task.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs flex items-center gap-1">
                <Tag className="w-2 h-2" />
                {tag}
              </Badge>
            ))}
            {task.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{task.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs font-medium">
              {task.points} {pt.task.points}
            </Badge>
            
            {task.priority && (
              <Badge className={`text-xs ${getPriorityColor()}`}>
                <AlertCircle className="w-3 h-3 mr-1" />
                {getPriorityText()}
              </Badge>
            )}
          </div>
          
          {task.status !== 'done' && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2 text-xs text-green-600 hover:text-green-700 hover:bg-green-100 dark:hover:bg-green-900/20 transition-all duration-200"
              onClick={(e) => {
                e.stopPropagation();
                handleComplete();
              }}
            >
              <CheckCircle2 className="w-3 h-3 mr-1" />
              {pt.task.complete}
            </Button>
          )}
        </div>
        
        {isTaskOverdue && task.status !== 'done' && (
          <div className="mt-2 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-red-500" />
            <span className="text-xs text-red-500 font-medium">
              {pt.task.overdue}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
