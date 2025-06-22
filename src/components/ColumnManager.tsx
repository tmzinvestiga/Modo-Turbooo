
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Plus, Settings, Trash2, Edit2 } from 'lucide-react';
import { toast } from 'sonner';

interface Column {
  id: string;
  title: string;
  status: 'todo' | 'doing' | 'done';
}

interface ColumnManagerProps {
  columns: Column[];
  onAddColumn: (column: Omit<Column, 'id'>) => void;
  onUpdateColumn: (columnId: string, updates: Partial<Column>) => void;
  onDeleteColumn: (columnId: string) => void;
}

export const ColumnManager = ({
  columns,
  onAddColumn,
  onUpdateColumn,
  onDeleteColumn,
}: ColumnManagerProps) => {
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingColumn, setEditingColumn] = useState<Column | null>(null);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [newColumnStatus, setNewColumnStatus] = useState<'todo' | 'doing' | 'done'>('todo');

  const handleAddColumn = () => {
    if (!newColumnTitle.trim()) {
      toast.error('Título da coluna é obrigatório');
      return;
    }

    onAddColumn({
      title: newColumnTitle.trim(),
      status: newColumnStatus,
    });

    setNewColumnTitle('');
    setNewColumnStatus('todo');
    setIsAddOpen(false);
    toast.success('Coluna adicionada com sucesso!');
  };

  const handleUpdateColumn = () => {
    if (!editingColumn || !newColumnTitle.trim()) {
      toast.error('Título da coluna é obrigatório');
      return;
    }

    onUpdateColumn(editingColumn.id, {
      title: newColumnTitle.trim(),
      status: newColumnStatus,
    });

    setEditingColumn(null);
    setNewColumnTitle('');
    setNewColumnStatus('todo');
    toast.success('Coluna atualizada com sucesso!');
  };

  const handleEditColumn = (column: Column) => {
    setEditingColumn(column);
    setNewColumnTitle(column.title);
    setNewColumnStatus(column.status);
  };

  const handleDeleteColumn = (columnId: string) => {
    onDeleteColumn(columnId);
    toast.success('Coluna removida com sucesso!');
  };

  return (
    <div className="flex items-center gap-2">
      <Dialog open={isManageOpen} onOpenChange={setIsManageOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Gerenciar Colunas
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Gerenciar Colunas do Quadro</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Organize suas colunas para melhor fluxo de trabalho
              </p>
              <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Coluna
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Adicionar Nova Coluna</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="columnTitle">Título da Coluna</Label>
                      <Input
                        id="columnTitle"
                        value={newColumnTitle}
                        onChange={(e) => setNewColumnTitle(e.target.value)}
                        placeholder="Ex: Em Revisão, Aprovado..."
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="columnStatus">Status</Label>
                      <select
                        id="columnStatus"
                        value={newColumnStatus}
                        onChange={(e) => setNewColumnStatus(e.target.value as 'todo' | 'doing' | 'done')}
                        className="w-full mt-1 p-2 border border-input rounded-md bg-background"
                      >
                        <option value="todo">A Fazer</option>
                        <option value="doing">Fazendo</option>
                        <option value="done">Concluído</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setIsAddOpen(false)} className="flex-1">
                        Cancelar
                      </Button>
                      <Button onClick={handleAddColumn} className="flex-1">
                        Adicionar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {columns.map((column) => (
                <div key={column.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{column.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      Status: {column.status === 'todo' ? 'A Fazer' : column.status === 'doing' ? 'Fazendo' : 'Concluído'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditColumn(column)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    {columns.length > 1 && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir Coluna</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir a coluna "{column.title}"? 
                              Todas as tarefas desta coluna serão movidas para "A Fazer".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteColumn(column.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Column Dialog */}
      <Dialog open={!!editingColumn} onOpenChange={(open) => !open && setEditingColumn(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Coluna</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editColumnTitle">Título da Coluna</Label>
              <Input
                id="editColumnTitle"
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                placeholder="Título da coluna"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="editColumnStatus">Status</Label>
              <select
                id="editColumnStatus"
                value={newColumnStatus}
                onChange={(e) => setNewColumnStatus(e.target.value as 'todo' | 'doing' | 'done')}
                className="w-full mt-1 p-2 border border-input rounded-md bg-background"
              >
                <option value="todo">A Fazer</option>
                <option value="doing">Fazendo</option>
                <option value="done">Concluído</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEditingColumn(null)} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleUpdateColumn} className="flex-1">
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
