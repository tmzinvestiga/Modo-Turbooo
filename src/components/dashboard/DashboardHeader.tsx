
import React from 'react';
import { BoardSelector } from '@/components/BoardSelector';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Filter, Plus, ChevronDown } from 'lucide-react';
import { pt } from '@/utils/localization';

interface DashboardHeaderProps {
  showFilters: boolean;
  onToggleFilters: () => void;
  onNewTask: () => void;
  onQuickAddColumn: () => void;
}

export const DashboardHeader = ({
  showFilters,
  onToggleFilters,
  onNewTask,
  onQuickAddColumn,
}: DashboardHeaderProps) => {
  return (
    <div className="bg-card border-b shadow-sm">
      <div className="flex items-center justify-between p-4 md:p-6">
        <div className="flex items-center gap-4">
          <BoardSelector />
        </div>
        
        <div className="flex items-center gap-2 md:gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleFilters}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">{pt.dashboard.filters}</span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Nova</span>
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onNewTask}>
                <Plus className="w-4 h-4 mr-2" />
                Nova Tarefa
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onQuickAddColumn}>
                <Plus className="w-4 h-4 mr-2" />
                Nova Coluna
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
