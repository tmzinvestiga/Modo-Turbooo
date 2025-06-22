
import { useState } from 'react';

interface Column {
  id: string;
  title: string;
  status: 'todo' | 'doing' | 'done';
}

export const useColumnDragDrop = (
  columns: Column[],
  onReorderColumns: (reorderedColumns: Column[]) => void
) => {
  const [draggedColumnId, setDraggedColumnId] = useState<string | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);

  const handleColumnDragStart = (e: React.DragEvent, columnId: string) => {
    e.dataTransfer.setData('text/plain', columnId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedColumnId(columnId);
  };

  const handleColumnDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedColumnId && draggedColumnId !== columnId) {
      setDragOverColumnId(columnId);
    }
  };

  const handleColumnDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverColumnId(null);
    }
  };

  const handleColumnDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain');
    
    if (draggedId && draggedId !== targetColumnId) {
      const draggedIndex = columns.findIndex(col => col.id === draggedId);
      const targetIndex = columns.findIndex(col => col.id === targetColumnId);
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        const newColumns = [...columns];
        const [draggedColumn] = newColumns.splice(draggedIndex, 1);
        newColumns.splice(targetIndex, 0, draggedColumn);
        onReorderColumns(newColumns);
      }
    }
    
    setDraggedColumnId(null);
    setDragOverColumnId(null);
  };

  const resetDragState = () => {
    setDraggedColumnId(null);
    setDragOverColumnId(null);
  };

  return {
    draggedColumnId,
    dragOverColumnId,
    handleColumnDragStart,
    handleColumnDragOver,
    handleColumnDragLeave,
    handleColumnDrop,
    resetDragState,
  };
};
