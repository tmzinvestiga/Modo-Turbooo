
import React from 'react';
import { Board } from '@/types/Board';
import { Task } from '@/types/Task';
import { BarChart3 } from 'lucide-react';
import { pt } from '@/utils/localization';

interface BoardInfoProps {
  board: Board;
  taskCount: number;
}

export const BoardInfo = ({ board, taskCount }: BoardInfoProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-foreground">{board.name}</h1>
        {board.description && (
          <p className="text-muted-foreground mt-1 text-sm md:text-base">{board.description}</p>
        )}
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <BarChart3 className="w-4 h-4" />
        {taskCount} {pt.dashboard.tasks}
      </div>
    </div>
  );
};
