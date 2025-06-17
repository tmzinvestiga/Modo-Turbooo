import React from 'react';
import { Task } from '@/types/Task';
import { Calendar, Clock, RotateCcw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format, isPast } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TaskCard = ({ task, onUpdateTask, onDeleteTask }: TaskCardProps) => {
  const isTaskOverdue = isPast(task.dueDate) && task.status !== 'done';
  
  const getRecurrenceIcon = () => {
    switch (task.recurrence) {
      case 'daily': return <RotateCcw className="w-3 h-3" />;
      case 'weekly': return <Calendar className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const getStatusColor = () => {
    if (task.status === 'done') return 'bg-green-600';
    if (task.status === 'doing') return 'bg-yellow-600';
    return isTaskOverdue ? 'bg-red-600' : 'bg-gray-600';
  };

  return (
    <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors cursor-grab active:cursor-grabbing">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-white font-medium text-sm leading-tight">{task.title}</h3>
          <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
        </div>
        
        <div className="flex items-center gap-2 text-gray-400 text-xs mb-3">
          <Calendar className="w-3 h-3" />
          <span>{format(task.dueDate, 'MMM dd')}</span>
          <div className="flex items-center gap-1">
            {getRecurrenceIcon()}
            <span className="capitalize">{task.recurrence}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            {task.points} points
          </Badge>
          
          <div className="flex gap-1">
            {task.status !== 'done' && (
              <Button
                size="sm"
                variant="ghost"
                className="h-6 px-2 text-xs text-green-400 hover:text-green-300"
                onClick={() => onUpdateTask(task.id, { status: 'done' })}
              >
                Done
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-xs text-red-400 hover:text-red-300"
              onClick={() => onDeleteTask(task.id)}
            >
              Del
            </Button>
          </div>
        </div>
        
        {isTaskOverdue && (
          <div className="mt-2 text-xs text-red-400 font-medium">
            Overdue
          </div>
        )}
      </CardContent>
    </Card>
  );
};
