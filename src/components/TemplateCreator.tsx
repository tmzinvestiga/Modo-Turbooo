
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
import { Plus, Trash2, Edit2, Save } from 'lucide-react';
import { useTemplate } from '@/contexts/TemplateContext';
import { BoardTemplate, ColumnTemplate, TaskTemplate } from '@/types/Template';
import { toast } from 'sonner';

export const TemplateCreator = () => {
  const { addTemplate } = useTemplate();
  const [isOpen, setIsOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [templateCategory, setTemplateCategory] = useState('');
  const [templateColor, setTemplateColor] = useState('#4F46E5');
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
    const newTask: TaskTemplate = {
      id: `task-${Date.now()}`,
      title: 'Exemplo de Tarefa',
      status: columns.find(c => c.id === columnId)?.status || 'todo',
      priority: 'medium',
      points: 3,
      description: 'Esta é uma tarefa de exemplo',
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
    setTemplateName('');
    setTemplateDescription('');
    setTemplateCategory('');
    setTemplateColor('#4F46E5');
    setColumns([
      { id: 'col-1', title: 'A Fazer', status: 'todo', tasks: [] },
      { id: 'col-2', title: 'Fazendo', status: 'doing', tasks: [] },
      { id: 'col-3', title: 'Concluído', status: 'done', tasks: [] }
    ]);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Novo Template
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Template</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Template Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="templateName">Nome do Template</Label>
              <Input
                id="templateName"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Ex: Processo de Vendas, Sprint de Desenvolvimento..."
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="templateCategory">Categoria</Label>
              <Select value={templateCategory} onValueChange={setTemplateCategory}>
                <SelectTrigger className="mt-1">
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

          <div>
            <Label htmlFor="templateDescription">Descrição</Label>
            <Textarea
              id="templateDescription"
              value={templateDescription}
              onChange={(e) => setTemplateDescription(e.target.value)}
              placeholder="Descreva o propósito e como usar este template..."
              rows={3}
              className="mt-1"
            />
          </div>

          <div>
            <Label>Cor do Template</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {colors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setTemplateColor(color.value)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    templateColor === color.value 
                      ? 'border-foreground scale-110' 
                      : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Columns Configuration */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Colunas do Template</h3>
              <Button onClick={addColumn} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Coluna
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {columns.map((column, index) => (
                <div key={column.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Input
                      value={column.title}
                      onChange={(e) => updateColumn(column.id, { title: e.target.value })}
                      className="font-medium"
                    />
                    {columns.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteColumn(column.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    )}
                  </div>

                  <Select 
                    value={column.status} 
                    onValueChange={(value) => updateColumn(column.id, { status: value as 'todo' | 'doing' | 'done' })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">A Fazer</SelectItem>
                      <SelectItem value="doing">Fazendo</SelectItem>
                      <SelectItem value="done">Concluído</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Tarefas de Exemplo</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => addTaskToColumn(column.id)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>

                    {column.tasks.map((task) => (
                      <div key={task.id} className="border rounded p-2 space-y-2">
                        <div className="flex items-center justify-between">
                          <Input
                            value={task.title}
                            onChange={(e) => updateTask(column.id, task.id, { title: e.target.value })}
                            className="text-sm"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteTask(column.id, task.id)}
                          >
                            <Trash2 className="w-3 h-3 text-red-500" />
                          </Button>
                        </div>
                        
                        <Textarea
                          value={task.description || ''}
                          onChange={(e) => updateTask(column.id, task.id, { description: e.target.value })}
                          placeholder="Descrição da tarefa..."
                          rows={2}
                          className="text-xs"
                        />

                        <div className="grid grid-cols-2 gap-2">
                          <Select 
                            value={task.priority} 
                            onValueChange={(value) => updateTask(column.id, task.id, { priority: value as any })}
                          >
                            <SelectTrigger className="text-xs">
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
                            className="text-xs"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSaveTemplate}>
            <Save className="w-4 h-4 mr-2" />
            Salvar Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
