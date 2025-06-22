
import React, { useState, useMemo } from 'react';
import { format, isSameDay, addHours } from 'date-fns';
import { Task } from '@/types/Task';
import { Badge } from '@/components/ui/badge';
import { Clock, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DailyPlannerViewProps {
  currentDate: Date;
  tasks: Task[];
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onAddTask?: (task: Omit<Task, 'id' | 'createdAt'>) => void;
}

export const DailyPlannerView = ({ 
  currentDate, 
  tasks, 
  onTaskUpdate,
  onAddTask 
}: DailyPlannerViewProps) => {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [resizingTask, setResizingTask] = useState<{ task: Task; initialY: number } | null>(null);

  // Generate time slots from 6 AM to 11 PM
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 6; hour <= 23; hour++) {
      slots.push(format(addHours(new Date().setHours(0, 0, 0, 0), hour), 'HH:mm'));
    }
    return slots;
  }, []);

  const dayTasks = tasks.filter(task => isSameDay(task.dueDate, currentDate));

  const getTaskPosition = (task: Task) => {
    const taskTime = task.dueTime || '09:00';
    const [hours, minutes] = taskTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    const startMinutes = 6 * 60; // 6 AM start
    const position = ((totalMinutes - startMinutes) / 60) * 80; // 80px per hour
    return Math.max(0, position);
  };

  const getTaskHeight = (task: Task) => {
    const duration = (task as any).duration || 60; // minutes
    return (duration / 60) * 80; // 80px per hour
  };

  const handleTaskDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleTaskDrop = (e: React.DragEvent, timeSlot: string) => {
    e.preventDefault();
    if (!draggedTask) return;

    onTaskUpdate(draggedTask.id, {
      dueDate: currentDate,
      dueTime: timeSlot,
    });

    setDraggedTask(null);
  };

  const handleTimeSlotClick = (timeSlot: string) => {
    if (onAddTask) {
      const newTask: Omit<Task, 'id' | 'createdAt'> = {
        title: 'Nova Tarefa',
        description: '',
        status: 'todo',
        priority: 'medium',
        points: 3,
        dueDate: currentDate,
        dueTime: timeSlot,
        tags: [],
        labels: [],
      };
      onAddTask(newTask);
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-slate-100 text-slate-800 border-slate-300';
      case 'doing': return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'done': return 'bg-green-100 text-green-900 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const isToday = isSameDay(currentDate, new Date());

  return (
    <div className="bg-card rounded-xl border overflow-hidden">
      {/* Day header */}
      <div className={`p-6 border-b ${isToday ? 'bg-primary/5' : 'bg-slate-50'}`}>
        <h2 className={`text-xl font-semibold ${isToday ? 'text-primary' : 'text-foreground'}`}>
          {format(currentDate, 'EEEE, dd MMMM yyyy')}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {dayTasks.length} tarefa(s) agendada(s)
        </p>
      </div>

      <div className="flex h-[600px] overflow-hidden">
        {/* Time column */}
        <div className="w-24 bg-slate-50 border-r overflow-y-auto">
          <div className="space-y-0">
            {timeSlots.map((time) => (
              <div
                key={time}
                className="h-[80px] border-b border-slate-200 flex items-start justify-center pt-2 text-sm text-muted-foreground font-medium"
              >
                {time}
              </div>
            ))}
          </div>
        </div>

        {/* Tasks column */}
        <div className="flex-1 relative overflow-y-auto">
          {/* Time slot grid */}
          <div className="space-y-0">
            {timeSlots.map((time) => (
              <div
                key={time}
                className="h-[80px] border-b border-slate-200 hover:bg-slate-50 transition-colors relative group cursor-pointer"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleTaskDrop(e, time)}
                onClick={() => handleTimeSlotClick(time)}
              >
                <div className="absolute right-4 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Tasks overlay */}
          <div className="absolute inset-0 pointer-events-none p-4">
            {dayTasks.map((task) => (
              <div
                key={task.id}
                className={`absolute left-4 right-4 rounded-lg border-2 pointer-events-auto cursor-move shadow-sm hover:shadow-md transition-shadow ${getTaskStatusColor(task.status)}`}
                style={{
                  top: `${getTaskPosition(task) + 16}px`,
                  height: `${Math.max(getTaskHeight(task), 60)}px`,
                }}
                draggable
                onDragStart={(e) => handleTaskDragStart(e, task)}
              >
                <div className="p-3 h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    {task.dueTime && (
                      <Badge variant="secondary" className="text-xs h-5">
                        <Clock className="w-3 h-3 mr-1" />
                        {task.dueTime}
                      </Badge>
                    )}
                    {task.priority && (
                      <Badge 
                        variant={task.priority === 'high' || task.priority === 'critical' ? 'destructive' : 'secondary'} 
                        className="text-xs h-5"
                      >
                        {task.priority}
                      </Badge>
                    )}
                  </div>
                  
                  <h3 className="font-medium text-sm mb-1 line-clamp-2">{task.title}</h3>
                  
                  {task.description && getTaskHeight(task) > 80 && (
                    <p className="text-xs text-muted-foreground line-clamp-3 flex-1">
                      {task.description}
                    </p>
                  )}

                  {task.tags && task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {task.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs h-4 px-1">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Resize handle */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-3 cursor-ns-resize bg-transparent hover:bg-primary/20 flex items-center justify-center"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setResizingTask({ task, initialY: e.clientY });
                  }}
                >
                  <div className="w-8 h-1 bg-slate-400 rounded opacity-0 hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
