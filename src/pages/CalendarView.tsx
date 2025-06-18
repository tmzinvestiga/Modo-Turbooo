
import React, { useState } from 'react';
import { useTaskStore } from '@/hooks/useTaskStore';
import { useBoard } from '@/contexts/BoardContext';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { TaskCalendar } from '@/components/TaskCalendar';
import { DayTasksDialog } from '@/components/DayTasksDialog';
import { GoogleCalendarIntegration } from '@/components/GoogleCalendarIntegration';
import { BoardSelector } from '@/components/BoardSelector';
import { Task } from '@/types/Task';
import { Calendar, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { currentBoard } = useBoard();

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
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b shadow-soft">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-foreground" />
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary" />
              <h1 className="text-xl font-semibold text-foreground">Calendário</h1>
            </div>
            <BoardSelector />
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-7xl mx-auto space-y-6">
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
