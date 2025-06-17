
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTaskStore } from '@/hooks/useTaskStore';
import { format, isSameDay } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';

export const CalendarView = () => {
  const { tasks } = useTaskStore();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => isSameDay(task.dueDate, date));
  };

  const selectedDateTasks = getTasksForDate(selectedDate);

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-white" />
          <div>
            <h1 className="text-2xl font-bold text-white">Calendar</h1>
            <p className="text-gray-400">View your tasks by date</p>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="w-full bg-gray-800 text-white pointer-events-auto"
                modifiers={{
                  hasTasks: (date) => getTasksForDate(date).length > 0,
                }}
                modifiersStyles={{
                  hasTasks: { 
                    backgroundColor: 'rgb(37 99 235)', 
                    color: 'white',
                    fontWeight: 'bold'
                  },
                }}
              />
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">
                Tasks for {format(selectedDate, 'MMMM dd, yyyy')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedDateTasks.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No tasks for this date</p>
              ) : (
                selectedDateTasks.map(task => (
                  <div key={task.id} className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-medium">{task.title}</h3>
                      <Badge 
                        variant={task.status === 'done' ? 'default' : 'secondary'}
                        className={
                          task.status === 'done' 
                            ? 'bg-green-600' 
                            : task.status === 'doing' 
                            ? 'bg-yellow-600' 
                            : 'bg-blue-600'
                        }
                      >
                        {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>Recurrence: {task.recurrence}</span>
                      <span>Points: {task.points}</span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
