
import React from 'react';
import { TaskFilter } from '@/components/TaskFilter';
import { Task } from '@/types/Task';

interface DashboardFiltersProps {
  tasks: Task[];
  onFilterChange: (filtered: Task[]) => void;
  isVisible: boolean;
}

export const DashboardFilters = ({ 
  tasks, 
  onFilterChange, 
  isVisible 
}: DashboardFiltersProps) => {
  if (!isVisible) return null;

  return (
    <div className="animate-fade-in">
      <TaskFilter tasks={tasks} onFilterChange={onFilterChange} />
    </div>
  );
};
