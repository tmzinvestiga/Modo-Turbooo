
import React, { useState } from 'react';
import { useTaskStore } from '@/hooks/useTaskStore';
import { useBoard } from '@/contexts/BoardContext';
import { TaskCalendar } from '@/components/TaskCalendar';
import { DayTasksDialog } from '@/components/DayTasksDialog';
import { GoogleCalendarIntegration } from '@/components/GoogleCalendarIntegration';
import { BoardSelector } from '@/components/BoardSelector';
import { Task } from '@/types/Task';
import { Calendar, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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
      {/* Secondary header */}
      <div className="bg-card border-b shadow-sm">
        <div className="flex items-center justify-between p-4 md:p-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary" />
              <h1 className="text-xl font-semibold text-foreground">Calendário</h1>
            </div>
            <BoardSelector />
          </div>
          
          <div className="flex items-center gap-3">
            <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Configurações
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Configurações do Calendário</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <GoogleCalendarIntegration />
                  <div className="text-sm text-muted-foreground">
                    <p>Mais configurações serão adicionadas em breve.</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto space-y-6">
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
