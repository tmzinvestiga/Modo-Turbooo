
import React, { useState } from 'react';
import { Task } from '@/types/Task';
import { Calendar, Clock, RotateCcw, AlertCircle, Tag, Edit2, Trash2, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format, isPast, isToday, isTomorrow } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TaskCard = ({ task, onUpdateTask, onDeleteTask }: TaskCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
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
      case 'daily': return 'Diária';
      case 'weekly': return 'Semanal';
      case 'monthly': return 'Mensal';
      case 'custom': return 'Personalizada';
      default: return null;
    }
  };

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high': return 'text-red-500 bg-red-100 dark:bg-red-900/20';
      case 'medium': return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20';
      case 'low': return 'text-green-500 bg-green-100 dark:bg-green-900/20';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getPriorityText = () => {
    switch (task.priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
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
    if (isDueToday) return 'Hoje';
    if (isDueTomorrow) return 'Amanhã';
    if (isTaskOverdue) return 'Atrasada';
    return format(task.dueDate, 'dd/MM');
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleComplete = () => {
    if (task.status !== 'done') {
      onUpdateTask(task.id, { status: 'done' });
      
      // TODO: Handle recurring tasks when backend is ready
      if (task.recurrence && task.recurrence !== 'none') {
        // Logic to create new recurring task instance
        console.log('TODO: Create new recurring task instance');
      }
    }
  };

  return (
    <Card 
      className="bg-card border-border hover:border-accent/50 transition-all duration-200 cursor-grab active:cursor-grabbing group hover:shadow-md"
      draggable
      onDragStart={handleDragStart}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-foreground font-medium text-sm leading-tight flex-1 pr-2">
            {task.title}
          </h3>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
            {isHovered && (
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                  onClick={() => {/* TODO: Open edit modal */}}
                >
                  <Edit2 className="w-3 h-3 text-blue-500" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 hover:bg-red-100 dark:hover:bg-red-900/20"
                  onClick={() => onDeleteTask(task.id)}
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
        
        <div className="flex items-center gap-3 text-xs mb-3">
          <div className={`flex items-center gap-1 ${getDueDateColor()}`}>
            <Calendar className="w-3 h-3" />
            <span className="font-medium">{getDueDateText()}</span>
          </div>
          
          {task.recurrence && task.recurrence !== 'none' && (
            <div className="flex items-center gap-1 text-primary">
              {getRecurrenceIcon()}
              <span>{getRecurrenceText()}</span>
            </div>
          )}
        </div>

        {/* Tags */}
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
              {task.points} pts
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
              onClick={handleComplete}
            >
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Concluir
            </Button>
          )}
        </div>
        
        {isTaskOverdue && task.status !== 'done' && (
          <div className="mt-2 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-red-500" />
            <span className="text-xs text-red-500 font-medium">
              Tarefa atrasada
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
