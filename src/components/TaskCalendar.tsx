
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { useTaskStore } from '@/hooks/useTaskStore';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Task } from '@/types/Task';

interface TaskCalendarProps {
  onDayClick: (date: Date, tasks: Task[]) => void;
}

export const TaskCalendar = ({ onDayClick }: TaskCalendarProps) => {
  const { tasks } = useTaskStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => isSameDay(task.dueDate, date));
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Add days from previous month to fill the first week
  const startDate = new Date(monthStart);
  startDate.setDate(startDate.getDate() - getDay(monthStart));
  
  // Add days from next month to fill the last week
  const endDate = new Date(monthEnd);
  endDate.setDate(endDate.getDate() + (6 - getDay(monthEnd)));
  
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentMonth(newMonth);
  };

  const getTaskColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-blue-500';
      case 'doing': return 'bg-yellow-500';
      case 'done': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateMonth('prev')}
          className="text-white hover:bg-gray-700"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        <h2 className="text-xl font-semibold text-white">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateMonth('next')}
          className="text-white hover:bg-gray-700"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day) => {
            const dayTasks = getTasksForDate(day);
            const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
            const isToday = isSameDay(day, new Date());

            return (
              <div
                key={day.toISOString()}
                className={`
                  min-h-[120px] p-2 border border-gray-600 rounded cursor-pointer transition-all hover:bg-gray-700
                  ${!isCurrentMonth ? 'opacity-50' : ''}
                  ${isToday ? 'ring-2 ring-blue-500' : ''}
                `}
                onClick={() => onDayClick(day, dayTasks)}
              >
                <div className={`text-sm font-medium mb-1 ${isCurrentMonth ? 'text-white' : 'text-gray-500'}`}>
                  {format(day, 'd')}
                </div>
                
                <div className="space-y-1">
                  {dayTasks.slice(0, 3).map((task, index) => (
                    <div
                      key={task.id}
                      className={`text-xs p-1 rounded text-white truncate ${getTaskColor(task.status)}`}
                      title={task.title}
                    >
                      {task.title}
                    </div>
                  ))}
                  {dayTasks.length > 3 && (
                    <div className="text-xs text-gray-400">
                      +{dayTasks.length - 3} mais
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
