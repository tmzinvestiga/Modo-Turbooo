
import React, { useState } from 'react';
import { useTaskStore } from '@/hooks/useTaskStore';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { TaskCalendar } from '@/components/TaskCalendar';
import { DayTasksDialog } from '@/components/DayTasksDialog';
import { GoogleCalendarIntegration } from '@/components/GoogleCalendarIntegration';
import { Task } from '@/types/Task';

export const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDayClick = (date: Date, tasks: Task[]) => {
    setSelectedDate(date);
    setSelectedTasks(tasks);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedDate(null);
    setSelectedTasks([]);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-white" />
          <div>
            <h1 className="text-2xl font-bold text-white">Calendário</h1>
            <p className="text-gray-400">Visualize suas tarefas por data</p>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-7xl mx-auto">
        <GoogleCalendarIntegration />
        
        <TaskCalendar onDayClick={handleDayClick} />

        <DayTasksDialog
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
          date={selectedDate}
          tasks={selectedTasks}
        />
      </div>
    </div>
  );
};
