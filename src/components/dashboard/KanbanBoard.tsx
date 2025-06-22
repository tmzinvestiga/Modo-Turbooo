
import React, { useState } from 'react';
import { TaskColumn } from '@/components/TaskColumn';
import { Button } from '@/components/ui/button';
import { Plus, GripVertical } from 'lucide-react';
import { Task } from '@/types/Task';
import { useIsMobile } from '@/hooks/use-mobile';
import { useColumnDragDrop } from '@/hooks/useColumnDragDrop';

interface Column {
  id: string;
  title: string;
  status: 'todo' | 'doing' | 'done';
}

interface KanbanBoardProps {
  columns: Column[];
  tasks: Task[];
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onReorderTasks: (draggedTaskId: string, targetTaskId: string, position: 'before' | 'after') => void;
  onReorderColumns: (reorderedColumns: Column[]) => void;
  onQuickAddColumn: () => void;
}

export const KanbanBoard = ({
  columns,
  tasks,
  onUpdateTask,
  onDeleteTask,
  onAddTask,
  onReorderTasks,
  onReorderColumns,
  onQuickAddColumn,
}: KanbanBoardProps) => {
  const isMobile = useIsMobile();
  const [showAddColumnHover, setShowAddColumnHover] = useState(false);

  const {
    draggedColumnId,
    dragOverColumnId,
    handleColumnDragStart,
    handleColumnDragOver,
    handleColumnDragLeave,
    handleColumnDrop,
    resetDragState,
  } = useColumnDragDrop(columns, onReorderColumns);

  return (
    <div 
      className={`animate-fade-in relative ${
        isMobile 
          ? 'flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory' 
          : `grid gap-6 ${columns.length <= 3 ? 'grid-cols-1 lg:grid-cols-3' : `grid-cols-1 lg:grid-cols-${Math.min(columns.length, 4)}`}`
      }`}
      onMouseEnter={() => setShowAddColumnHover(true)}
      onMouseLeave={() => setShowAddColumnHover(false)}
    >
      {columns.map((column, index) => (
        <div 
          key={column.id} 
          className={`
            ${isMobile ? 'flex-shrink-0 w-80 snap-start' : ''} 
            transition-all duration-200
            ${draggedColumnId === column.id ? 'opacity-50 scale-95' : ''}
            ${dragOverColumnId === column.id ? 'scale-105 ring-2 ring-primary/30' : ''}
          `}
          draggable={!isMobile}
          onDragStart={(e) => handleColumnDragStart(e, column.id)}
          onDragOver={(e) => handleColumnDragOver(e, column.id)}
          onDragLeave={handleColumnDragLeave}
          onDrop={(e) => handleColumnDrop(e, column.id)}
          onDragEnd={resetDragState}
        >
          {!isMobile && (
            <div className="flex items-center justify-center mb-2 opacity-0 hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded px-2 py-1 cursor-grab active:cursor-grabbing">
                <GripVertical className="w-3 h-3" />
                Arrastar coluna
              </div>
            </div>
          )}
          
          <TaskColumn
            title={column.title}
            status={column.status}
            tasks={tasks}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
            onAddTask={onAddTask}
            onReorderTasks={onReorderTasks}
          />
        </div>
      ))}
      
      {/* Quick Add Column Button */}
      {!isMobile && showAddColumnHover && (
        <div className="flex items-center justify-center">
          <Button
            variant="ghost"
            size="lg"
            onClick={onQuickAddColumn}
            className="h-16 w-16 rounded-full bg-muted/50 hover:bg-muted border-2 border-dashed border-muted-foreground/30 hover:border-muted-foreground/50 transition-all"
          >
            <Plus className="w-6 h-6 text-muted-foreground" />
          </Button>
        </div>
      )}
    </div>
  );
};
