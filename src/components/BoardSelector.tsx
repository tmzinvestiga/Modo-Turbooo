
import React, { useState } from 'react';
import { useBoard } from '@/contexts/BoardContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronDown, Plus, Edit2, Trash2, Folder } from 'lucide-react';
import { toast } from 'sonner';

export const BoardSelector = () => {
  const { boards, currentBoard, addBoard, updateBoard, deleteBoard, setCurrentBoard } = useBoard();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [newBoardDescription, setNewBoardDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState('#4F46E5');

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

  const handleAddBoard = () => {
    if (!newBoardName.trim()) {
      toast.error('Nome do quadro é obrigatório');
      return;
    }

    addBoard({
      name: newBoardName.trim(),
      description: newBoardDescription.trim(),
      color: selectedColor,
    });

    setNewBoardName('');
    setNewBoardDescription('');
    setSelectedColor('#4F46E5');
    setIsAddDialogOpen(false);
    toast.success('Quadro criado com sucesso!');
  };

  const handleDeleteBoard = (boardId: string) => {
    const board = boards.find(b => b.id === boardId);
    if (board?.isDefault) {
      toast.error('Não é possível excluir o quadro padrão');
      return;
    }
    
    deleteBoard(boardId);
    toast.success('Quadro excluído com sucesso!');
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 text-left font-normal">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: currentBoard?.color || '#4F46E5' }}
            />
            <span className="font-medium">{currentBoard?.name || 'Selecionar Quadro'}</span>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          {boards.map((board) => (
            <DropdownMenuItem
              key={board.id}
              onClick={() => setCurrentBoard(board.id)}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: board.color }}
                />
                <div>
                  <div className="font-medium">{board.name}</div>
                  {board.description && (
                    <div className="text-xs text-muted-foreground">{board.description}</div>
                  )}
                </div>
              </div>
              {currentBoard?.id === board.id && (
                <Badge variant="secondary" className="text-xs">Atual</Badge>
              )}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Quadro
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Criar Novo Quadro</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="boardName">Nome do Quadro</Label>
                  <Input
                    id="boardName"
                    value={newBoardName}
                    onChange={(e) => setNewBoardName(e.target.value)}
                    placeholder="Ex: Trabalho, Estudos, Projetos..."
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="boardDescription">Descrição (opcional)</Label>
                  <Input
                    id="boardDescription"
                    value={newBoardDescription}
                    onChange={(e) => setNewBoardDescription(e.target.value)}
                    placeholder="Uma breve descrição do quadro"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Cor do Quadro</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {colors.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setSelectedColor(color.value)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          selectedColor === color.value 
                            ? 'border-foreground scale-110' 
                            : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="flex-1">
                    Cancelar
                  </Button>
                  <Button onClick={handleAddBoard} className="flex-1">
                    <Folder className="w-4 h-4 mr-2" />
                    Criar Quadro
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
