
import React, { useState, useMemo } from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addHours, isSameDay, parseISO } from 'date-fns';
import { Task } from '@/types/Task';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

interface WeeklyPlannerViewProps {
  currentDate: Date;
  tasks: Task[];
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onDayClick: (date: Date, tasks: Task[]) => void;
}

export const WeeklyPlannerView = ({ 
  currentDate, 
  tasks, 
  onTaskUpdate, 
  onDayClick 
}: WeeklyPlannerViewProps) => {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [resizingTask, setResizingTask] = useState<{ task: Task; initialY: number } | null>(null);

  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Generate time slots from 6 AM to 11 PM
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 6; hour <= 23; hour++) {
      slots.push(format(addHours(new Date().setHours(0, 0, 0, 0), hour), 'HH:mm'));
    }
    return slots;
  }, []);

  const getTasksForDay = (date: Date) => {
    return tasks.filter(task => isSameDay(task.dueDate, date));
  };

  const getTaskPosition = (task: Task) => {
    const taskTime = task.dueTime || '09:00';
    const [hours, minutes] = taskTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    const startMinutes = 6 * 60; // 6 AM start
    const position = ((totalMinutes - startMinutes) / 60) * 60; // 60px per hour
    return Math.max(0, position);
  };

  const getTaskHeight = (task: Task) => {
    // Default 1 hour duration, can be extended based on task properties
    const duration = (task as any).duration || 60; // minutes
    return (duration / 60) * 60; // 60px per hour
  };

  const handleTaskDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleTaskDrop = (e: React.DragEvent, date: Date, timeSlot: string) => {
    e.preventDefault();
    if (!draggedTask) return;

    const newDueDate = new Date(date);
    onTaskUpdate(draggedTask.id, {
      dueDate: newDueDate,
      dueTime: timeSlot,
    });

    setDraggedTask(null);
  };

  const handleMouseDown = (e: React.MouseEvent, task: Task) => {
    if (e.target === e.currentTarget) return; // Only on resize handle
    setResizingTask({ task, initialY: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!resizingTask) return;
    
    const deltaY = e.clientY - resizingTask.initialY;
    const newDuration = Math.max(30, ((getTaskHeight(resizingTask.task) + deltaY) / 60) * 60);
    
    // Update task duration in real-time
    onTaskUpdate(resizingTask.task.id, {
      ...(resizingTask.task as any),
      duration: newDuration,
    });
  };

  const handleMouseUp = () => {
    setResizingTask(null);
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-slate-200 text-slate-800 border-slate-300';
      case 'doing': return 'bg-amber-200 text-amber-900 border-amber-300';
      case 'done': return 'bg-green-200 text-green-900 border-green-300';
      default: return 'bg-gray-200 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="flex h-full bg-card rounded-xl border overflow-hidden">
      {/* Time column */}
      <div className="w-20 bg-slate-50 border-r">
        <div className="h-12 border-b flex items-center justify-center text-xs font-medium text-muted-foreground">
          Hora
        </div>
        <div className="space-y-0">
          {timeSlots.map((time) => (
            <div
              key={time}
              className="h-[60px] border-b border-slate-200 flex items-start justify-center pt-1 text-xs text-muted-foreground"
            >
              {time}
            </div>
          ))}
        </div>
      </div>

      {/* Days columns */}
      <div className="flex-1 overflow-x-auto">
        <div className="grid grid-cols-7 min-w-full">
          {weekDays.map((day, dayIndex) => {
            const dayTasks = getTasksForDay(day);
            const isToday = isSameDay(day, new Date());

            return (
              <div key={day.toISOString()} className="relative border-r border-slate-200 last:border-r-0">
                {/* Day header */}
                <div className={`h-12 border-b flex flex-col items-center justify-center text-sm font-medium cursor-pointer hover:bg-slate-50 ${
                  isToday ? 'bg-primary/5 text-primary' : 'text-foreground'
                }`}
                onClick={() => onDayClick(day, dayTasks)}
                >
                  <div className="text-xs text-muted-foreground">
                    {format(day, 'EEE')}
                  </div>
                  <div className={isToday ? 'bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs' : ''}>
                    {format(day, 'd')}
                  </div>
                </div>

                {/* Time slots */}
                <div className="relative">
                  {timeSlots.map((time, timeIndex) => (
                    <div
                      key={time}
                      className="h-[60px] border-b border-slate-200 hover:bg-slate-50 transition-colors"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleTaskDrop(e, day, time)}
                    />
                  ))}

                  {/* Tasks overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                    {dayTasks.map((task) => (
                      <div
                        key={task.id}
                        className={`absolute left-1 right-1 rounded border pointer-events-auto cursor-move ${getTaskStatusColor(task.status)}`}
                        style={{
                          top: `${getTaskPosition(task)}px`,
                          height: `${getTaskHeight(task)}px`,
                          minHeight: '30px',
                        }}
                        draggable
                        onDragStart={(e) => handleTaskDragStart(e, task)}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                      >
                        <div className="p-2 h-full flex flex-col">
                          <div className="flex items-center gap-1 text-xs font-medium truncate">
                            {task.dueTime && (
                              <Clock className="w-3 h-3 flex-shrink-0" />
                            )}
                            <span className="truncate">{task.title}</span>
                          </div>
                          {getTaskHeight(task) > 40 && task.description && (
                            <div className="text-xs text-muted-foreground mt-1 truncate">
                              {task.description}
                            </div>
                          )}
                          {task.priority && (
                            <Badge variant="secondary" className="text-xs h-4 px-1 mt-auto w-fit">
                              {task.priority}
                            </Badge>
                          )}
                        </div>
                        
                        {/* Resize handle */}
                        <div
                          className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize bg-transparent hover:bg-primary/20"
                          onMouseDown={(e) => handleMouseDown(e, task)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
