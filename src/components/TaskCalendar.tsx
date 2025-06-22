
import React, { useState, useMemo } from 'react';
import { useTaskStore } from '@/hooks/useTaskStore';
import { useBoard } from '@/contexts/BoardContext';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isToday, addMonths, subMonths, startOfWeek, endOfWeek, addDays, startOfDay, endOfDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/types/Task';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TaskCalendarProps {
  onDayClick: (date: Date, tasks: Task[]) => void;
}

type ViewMode = 'today' | 'day' | 'week' | 'month';

export const TaskCalendar = ({ onDayClick }: TaskCalendarProps) => {
  const { getTasksByBoard } = useTaskStore();
  const { currentBoard } = useBoard();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');

  // Get tasks for the current board
  const boardTasks = useMemo(() => {
    if (!currentBoard) return [];
    return getTasksByBoard(currentBoard.id);
  }, [currentBoard, getTasksByBoard]);

  const getTasksForDate = (date: Date) => {
    return boardTasks.filter(task => isSameDay(task.dueDate, date));
  };

  const navigate = (direction: 'prev' | 'next') => {
    if (viewMode === 'month') {
      setCurrentDate(direction === 'next' ? addMonths(currentDate, 1) : subMonths(currentDate, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(direction === 'next' ? addDays(currentDate, 7) : addDays(currentDate, -7));
    } else {
      setCurrentDate(direction === 'next' ? addDays(currentDate, 1) : addDays(currentDate, -1));
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setViewMode('today');
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    if (mode === 'today') {
      setCurrentDate(new Date());
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'doing': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'done': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityIndicator = (priority?: string) => {
    switch (priority) {
      case 'critical': return 'border-l-4 border-l-red-600';
      case 'high': return 'border-l-4 border-l-red-500';
      case 'medium': return 'border-l-4 border-l-amber-500';
      case 'low': return 'border-l-4 border-l-green-500';
      default: return '';
    }
  };

  const renderTodayView = () => {
    const todayTasks = getTasksForDate(currentDate);
    const todoTasks = todayTasks.filter(t => t.status === 'todo');
    const doingTasks = todayTasks.filter(t => t.status === 'doing');
    const doneTasks = todayTasks.filter(t => t.status === 'done');

    return (
      <div className="p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">
            {format(currentDate, 'EEEE, dd MMMM yyyy')}
          </h2>
          <p className="text-muted-foreground mt-1">
            {todayTasks.length} tarefas agendadas para hoje
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-500"></div>
              <h3 className="font-semibold">A Fazer ({todoTasks.length})</h3>
            </div>
            <div className="space-y-2">
              {todoTasks.map(task => (
                <div key={task.id} className={`p-3 rounded border ${getTaskStatusColor(task.status)} ${getPriorityIndicator(task.priority)}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{task.title}</span>
                    {task.dueTime && (
                      <Badge variant="outline" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {task.dueTime}
                      </Badge>
                    )}
                  </div>
                  {task.description && (
                    <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                  )}
                </div>
              ))}
              {todoTasks.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">Nenhuma tarefa para fazer</p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <h3 className="font-semibold">Fazendo ({doingTasks.length})</h3>
            </div>
            <div className="space-y-2">
              {doingTasks.map(task => (
                <div key={task.id} className={`p-3 rounded border ${getTaskStatusColor(task.status)} ${getPriorityIndicator(task.priority)}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{task.title}</span>
                    {task.dueTime && (
                      <Badge variant="outline" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {task.dueTime}
                      </Badge>
                    )}
                  </div>
                  {task.description && (
                    <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                  )}
                </div>
              ))}
              {doingTasks.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">Nenhuma tarefa em andamento</p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <h3 className="font-semibold">Concluído ({doneTasks.length})</h3>
            </div>
            <div className="space-y-2">
              {doneTasks.map(task => (
                <div key={task.id} className={`p-3 rounded border ${getTaskStatusColor(task.status)} ${getPriorityIndicator(task.priority)}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{task.title}</span>
                    {task.dueTime && (
                      <Badge variant="outline" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {task.dueTime}
                      </Badge>
                    )}
                  </div>
                  {task.description && (
                    <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                  )}
                </div>
              ))}
              {doneTasks.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">Nenhuma tarefa concluída</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate);
    const weekEnd = endOfWeek(currentDate);
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return (
      <div className="p-6">
        <div className="grid grid-cols-7 gap-4">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, index) => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2 border-b">
              {day}
            </div>
          ))}
          
          {weekDays.map((day) => {
            const dayTasks = getTasksForDate(day);
            const isCurrentDay = isToday(day);
            
            return (
              <div
                key={day.toISOString()}
                className={`min-h-[150px] p-3 border rounded-lg cursor-pointer transition-all hover:bg-accent/50 ${
                  isCurrentDay ? 'bg-primary/5 border-primary/20' : 'bg-card'
                }`}
                onClick={() => onDayClick(day, dayTasks)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${
                    isCurrentDay ? 'bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs' : ''
                  }`}>
                    {format(day, 'd')}
                  </span>
                  {dayTasks.length > 0 && (
                    <Badge variant="secondary" className="text-xs h-5 px-1.5">
                      {dayTasks.length}
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-1">
                  {dayTasks.slice(0, 3).map((task) => (
                    <div
                      key={task.id}
                      className={`text-xs px-2 py-1 rounded border ${getTaskStatusColor(task.status)} ${getPriorityIndicator(task.priority)}`}
                      title={`${task.title} - ${task.status}`}
                    >
                      <span className="truncate block">{task.title}</span>
                    </div>
                  ))}
                  {dayTasks.length > 3 && (
                    <div className="text-xs text-muted-foreground text-center py-1">
                      +{dayTasks.length - 3} mais
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="p-6">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-px mb-2">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground py-3">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days Grid */}
        <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
          {calendarDays.map((day) => {
            const dayTasks = getTasksForDate(day);
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            const isCurrentDay = isToday(day);

            return (
              <div
                key={day.toISOString()}
                className={`
                  min-h-[120px] p-3 bg-card cursor-pointer transition-all duration-200 hover:bg-accent/50
                  ${!isCurrentMonth ? 'opacity-40' : ''}
                  ${isCurrentDay ? 'bg-primary/5 border-2 border-primary/20' : ''}
                `}
                onClick={() => onDayClick(day, dayTasks)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`
                    text-sm font-medium
                    ${isCurrentDay ? 'bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs' : ''}
                    ${isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'}
                  `}>
                    {format(day, 'd')}
                  </span>
                  {dayTasks.length > 0 && (
                    <Badge variant="secondary" className="text-xs h-5 px-1.5">
                      {dayTasks.length}
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-1">
                  {dayTasks.slice(0, 3).map((task) => (
                    <div
                      key={task.id}
                      className={`
                        text-xs px-2 py-1 rounded border
                        ${getTaskStatusColor(task.status)}
                        ${getPriorityIndicator(task.priority)}
                      `}
                      title={`${task.title} - ${task.status}`}
                    >
                      <div className="flex items-center gap-1">
                        {task.priority && (
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            task.priority === 'critical' ? 'bg-red-600' :
                            task.priority === 'high' ? 'bg-red-500' :
                            task.priority === 'medium' ? 'bg-amber-500' :
                            'bg-green-500'
                          }`} />
                        )}
                        <span className="truncate">{task.title}</span>
                      </div>
                    </div>
                  ))}
                  {dayTasks.length > 3 && (
                    <div className="text-xs text-muted-foreground text-center py-1">
                      +{dayTasks.length - 3} mais
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const getViewTitle = () => {
    switch (viewMode) {
      case 'today':
        return format(currentDate, 'dd MMMM yyyy');
      case 'day':
        return format(currentDate, 'EEEE, dd MMMM yyyy');
      case 'week':
        return `${format(startOfWeek(currentDate), 'dd MMM')} - ${format(endOfWeek(currentDate), 'dd MMM yyyy')}`;
      case 'month':
        return format(currentDate, 'MMMM yyyy');
      default:
        return format(currentDate, 'MMMM yyyy');
    }
  };

  return (
    <div className="bg-card border rounded-xl shadow-soft overflow-hidden">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-6 border-b bg-slate-50/50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('prev')}
              className="h-8 w-8 p-0 hover:bg-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <h2 className="text-xl font-semibold text-foreground min-w-[200px] text-center">
              {getViewTitle()}
            </h2>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('next')}
              className="h-8 w-8 p-0 hover:bg-white"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Select value={viewMode} onValueChange={handleViewModeChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hoje</SelectItem>
              <SelectItem value="day">Dia</SelectItem>
              <SelectItem value="week">Semana</SelectItem>
              <SelectItem value="month">Mês</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarIcon className="w-4 h-4" />
            {currentBoard?.name || 'Nenhum quadro selecionado'}
          </div>
        </div>
      </div>

      {/* Calendar Content */}
      {viewMode === 'today' && renderTodayView()}
      {viewMode === 'day' && renderTodayView()}
      {viewMode === 'week' && renderWeekView()}
      {viewMode === 'month' && renderMonthView()}

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 p-4 border-t bg-slate-50/30">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 rounded border bg-slate-100 border-slate-200"></div>
          <span className="text-muted-foreground">A Fazer</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 rounded border bg-amber-100 border-amber-200"></div>
          <span className="text-muted-foreground">Fazendo</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 rounded border bg-green-100 border-green-200"></div>
          <span className="text-muted-foreground">Concluído</span>
        </div>
      </div>
    </div>
  );
};
