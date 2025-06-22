
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2, Save, GripVertical } from 'lucide-react';
import { useTemplate } from '@/contexts/TemplateContext';
import { BoardTemplate, ColumnTemplate, TaskTemplate } from '@/types/Template';
import { toast } from 'sonner';

interface DraggedItem {
  type: 'column' | 'task';
  id: string;
  columnId?: string;
}

export const TemplateCreator = () => {
  const { addTemplate } = useTemplate();
  const [isOpen, setIsOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [templateCategory, setTemplateCategory] = useState('');
  const [templateColor, setTemplateColor] = useState('#4F46E5');
  const [draggedItem, setDraggedItem] = useState<DraggedItem | null>(null);
  const [columns, setColumns] = useState<ColumnTemplate[]>([
    {
      id: 'col-1',
      title: 'A Fazer',
      status: 'todo',
      tasks: []
    },
    {
      id: 'col-2',
      title: 'Fazendo',
      status: 'doing',
      tasks: []
    },
    {
      id: 'col-3',
      title: 'Concluído',
      status: 'done',
      tasks: []
    }
  ]);

  const colors = [
    { name: 'Indigo', value: '#4F46E5' },
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Green', value: '#16A34A' },
    { name: 'Purple', value: '#9333EA' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Orange', value: '#F59E0B' },
    { name: 'Pink', value: '#EC4899' },
    { name: 'Teal', value: '#14B8A6' },
  ];

  const categories = [
    'Trabalho',
    'Desenvolvimento',
    'Marketing',
    'Educação',
    'Pessoal',
    'Projetos',
    'Saúde',
    'Finanças',
    'Outros'
  ];

  const addColumn = () => {
    const newColumn: ColumnTemplate = {
      id: `col-${Date.now()}`,
      title: 'Nova Coluna',
      status: 'todo',
      tasks: []
    };
    setColumns([...columns, newColumn]);
  };

  const updateColumn = (columnId: string, updates: Partial<ColumnTemplate>) => {
    setColumns(columns.map(col => 
      col.id === columnId ? { ...col, ...updates } : col
    ));
  };

  const deleteColumn = (columnId: string) => {
    if (columns.length <= 1) {
      toast.error('Deve haver pelo menos uma coluna');
      return;
    }
    setColumns(columns.filter(col => col.id !== columnId));
  };

  const addTaskToColumn = (columnId: string) => {
    const column = columns.find(c => c.id === columnId);
    const newTask: TaskTemplate = {
      id: `task-${Date.now()}`,
      title: 'Nova Tarefa',
      status: column?.status || 'todo',
      priority: 'medium',
      points: 3,
      description: 'Descrição da tarefa de exemplo',
      tags: [],
      labels: []
    };

    setColumns(columns.map(col => 
      col.id === columnId 
        ? { ...col, tasks: [...col.tasks, newTask] }
        : col
    ));
  };

  const updateTask = (columnId: string, taskId: string, updates: Partial<TaskTemplate>) => {
    setColumns(columns.map(col => 
      col.id === columnId 
        ? {
            ...col,
            tasks: col.tasks.map(task => 
              task.id === taskId ? { ...task, ...updates } : task
            )
          }
        : col
    ));
  };

  const deleteTask = (columnId: string, taskId: string) => {
    setColumns(columns.map(col => 
      col.id === columnId 
        ? { ...col, tasks: col.tasks.filter(task => task.id !== taskId) }
        : col
    ));
  };

  // Column drag and drop handlers
  const handleColumnDragStart = (e: React.DragEvent, columnId: string) => {
    setDraggedItem({ type: 'column', id: columnId });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleColumnDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.type !== 'column' || draggedItem.id === targetColumnId) {
      return;
    }

    const draggedIndex = columns.findIndex(col => col.id === draggedItem.id);
    const targetIndex = columns.findIndex(col => col.id === targetColumnId);

    if (draggedIndex !== -1 && targetIndex !== -1) {
      const newColumns = [...columns];
      const [draggedColumn] = newColumns.splice(draggedIndex, 1);
      newColumns.splice(targetIndex, 0, draggedColumn);
      setColumns(newColumns);
    }

    setDraggedItem(null);
  };

  // Task drag and drop handlers
  const handleTaskDragStart = (e: React.DragEvent, taskId: string, columnId: string) => {
    setDraggedItem({ type: 'task', id: taskId, columnId });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleTaskDrop = (e: React.DragEvent, targetColumnId: string, targetTaskId?: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.type !== 'task') {
      return;
    }

    const sourceColumnId = draggedItem.columnId!;
    const taskId = draggedItem.id;

    // Find the task to move
    const sourceColumn = columns.find(col => col.id === sourceColumnId);
    const taskToMove = sourceColumn?.tasks.find(task => task.id === taskId);
    
    if (!taskToMove) return;

    // Update task status to match target column
    const targetColumn = columns.find(col => col.id === targetColumnId);
    const updatedTask = { ...taskToMove, status: targetColumn?.status || 'todo' };

    // Remove task from source column
    const updatedColumns = columns.map(col => {
      if (col.id === sourceColumnId) {
        return { ...col, tasks: col.tasks.filter(task => task.id !== taskId) };
      }
      return col;
    });

    // Add task to target column
    const finalColumns = updatedColumns.map(col => {
      if (col.id === targetColumnId) {
        const newTasks = [...col.tasks];
        if (targetTaskId) {
          const targetIndex = newTasks.findIndex(task => task.id === targetTaskId);
          newTasks.splice(targetIndex, 0, updatedTask);
        } else {
          newTasks.push(updatedTask);
        }
        return { ...col, tasks: newTasks };
      }
      return col;
    });

    setColumns(finalColumns);
    setDraggedItem(null);
  };

  const handleSaveTemplate = () => {
    if (!templateName.trim()) {
      toast.error('Nome do template é obrigatório');
      return;
    }

    if (!templateDescription.trim()) {
      toast.error('Descrição do template é obrigatória');
      return;
    }

    if (!templateCategory.trim()) {
      toast.error('Categoria do template é obrigatória');
      return;
    }

    const template: Omit<BoardTemplate, 'id' | 'createdAt' | 'updatedAt'> = {
      name: templateName.trim(),
      description: templateDescription.trim(),
      category: templateCategory,
      isDefault: false,
      isFavorite: false,
      color: templateColor,
      columns: columns,
    };

    addTemplate(template);
    
    // Reset form
    resetForm();
    setIsOpen(false);
  };

  const resetForm = () => {
    setTemplateName('');
    setTemplateDescription('');
    setTemplateCategory('');
    setTemplateColor('#4F46E5');
    setColumns([
      { id: 'col-1', title: 'A Fazer', status: 'todo', tasks: [] },
      { id: 'col-2', title: 'Fazendo', status: 'doing', tasks: [] },
      { id: 'col-3', title: 'Concluído', status: 'done', tasks: [] }
    ]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Novo Template
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Criar Novo Template</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-8">
          {/* Template Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="templateName" className="font-medium">Nome do Template</Label>
              <Input
                id="templateName"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Ex: Processo de Vendas, Sprint de Desenvolvimento..."
                className="h-10"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="templateCategory" className="font-medium">Categoria</Label>
              <Select value={templateCategory} onValueChange={setTemplateCategory}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="templateDescription" className="font-medium">Descrição</Label>
            <Textarea
              id="templateDescription"
              value={templateDescription}
              onChange={(e) => setTemplateDescription(e.target.value)}
              placeholder="Descreva o propósito e como usar este template..."
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="space-y-3">
            <Label className="font-medium">Cor do Template</Label>
            <div className="flex flex-wrap gap-3">
              {colors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setTemplateColor(color.value)}
                  className={`w-10 h-10 rounded-lg border-2 transition-all hover:scale-110 ${
                    templateColor === color.value 
                      ? 'border-foreground scale-110 shadow-lg' 
                      : 'border-transparent hover:border-muted-foreground'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Template Builder - Kanban Style */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Estrutura do Template</h3>
              <Button onClick={addColumn} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Coluna
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 min-h-[400px]">
              {columns.map((column) => (
                <div 
                  key={column.id} 
                  className="bg-slate-50 rounded-lg border-2 border-dashed border-slate-200 p-4 space-y-4 transition-all hover:border-slate-300"
                  draggable
                  onDragStart={(e) => handleColumnDragStart(e, column.id)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleColumnDrop(e, column.id)}
                >
                  {/* Column Header */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 cursor-grab">
                        <GripVertical className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">Coluna</span>
                      </div>
                      {columns.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteColumn(column.id)}
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>

                    <Input
                      value={column.title}
                      onChange={(e) => updateColumn(column.id, { title: e.target.value })}
                      className="font-medium text-sm h-8"
                      placeholder="Nome da coluna"
                    />

                    <Select 
                      value={column.status} 
                      onValueChange={(value) => updateColumn(column.id, { status: value as 'todo' | 'doing' | 'done' })}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">A Fazer</SelectItem>
                        <SelectItem value="doing">Fazendo</SelectItem>
                        <SelectItem value="done">Concluído</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Tasks in Column */}
                  <div 
                    className="space-y-2 min-h-[200px] p-2 rounded border border-dashed border-slate-300"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleTaskDrop(e, column.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-muted-foreground">
                        Tarefas de Exemplo ({column.tasks.length})
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => addTaskToColumn(column.id)}
                        className="h-5 w-5 p-0"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>

                    {column.tasks.map((task) => (
                      <div 
                        key={task.id} 
                        className="bg-white border rounded-lg p-3 space-y-2 cursor-move hover:shadow-sm transition-shadow"
                        draggable
                        onDragStart={(e) => handleTaskDragStart(e, task.id, column.id)}
                      >
                        <div className="flex items-center justify-between">
                          <Input
                            value={task.title}
                            onChange={(e) => updateTask(column.id, task.id, { title: e.target.value })}
                            className="text-xs h-6 font-medium border-none p-0 focus:ring-0"
                            placeholder="Título da tarefa"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteTask(column.id, task.id)}
                            className="h-4 w-4 p-0 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                        
                        <Textarea
                          value={task.description || ''}
                          onChange={(e) => updateTask(column.id, task.id, { description: e.target.value })}
                          placeholder="Descrição da tarefa..."
                          rows={2}
                          className="text-xs resize-none h-12"
                        />

                        <div className="grid grid-cols-2 gap-2">
                          <Select 
                            value={task.priority} 
                            onValueChange={(value) => updateTask(column.id, task.id, { priority: value as any })}
                          >
                            <SelectTrigger className="text-xs h-6">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Baixa</SelectItem>
                              <SelectItem value="medium">Média</SelectItem>
                              <SelectItem value="high">Alta</SelectItem>
                              <SelectItem value="critical">Crítica</SelectItem>
                            </SelectContent>
                          </Select>

                          <Input
                            type="number"
                            value={task.points}
                            onChange={(e) => updateTask(column.id, task.id, { points: parseInt(e.target.value) || 1 })}
                            min="1"
                            max="10"
                            className="text-xs h-6"
                            placeholder="Pontos"
                          />
                        </div>
                      </div>
                    ))}

                    {column.tasks.length === 0 && (
                      <div className="text-center text-xs text-muted-foreground py-8 border-2 border-dashed border-slate-200 rounded">
                        Arraste tarefas aqui ou clique no + para adicionar
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="flex items-center gap-3 pt-6 border-t">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSaveTemplate} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Salvar Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
