
import React, { useState } from 'react';
import { useBoard } from '@/contexts/BoardContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
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
import { ChevronDown, Plus, Edit2, Trash2, Folder, Heart, Settings } from 'lucide-react';
import { toast } from 'sonner';

export const BoardSelector = () => {
  const { boards, currentBoard, addBoard, updateBoard, deleteBoard, setCurrentBoard } = useBoard();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isMultiSelectOpen, setIsMultiSelectOpen] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [newBoardDescription, setNewBoardDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState('#4F46E5');
  const [selectedBoards, setSelectedBoards] = useState<string[]>([]);
  const [favoriteBoards, setFavoriteBoards] = useState<string[]>([]);

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

  // Sort boards: favorites first, then alphabetically
  const sortedBoards = [...boards].sort((a, b) => {
    const aIsFavorite = favoriteBoards.includes(a.id);
    const bIsFavorite = favoriteBoards.includes(b.id);
    
    if (aIsFavorite && !bIsFavorite) return -1;
    if (!aIsFavorite && bIsFavorite) return 1;
    
    return a.name.localeCompare(b.name);
  });

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

  const toggleFavoriteBoard = (boardId: string) => {
    const newFavorites = favoriteBoards.includes(boardId)
      ? favoriteBoards.filter(id => id !== boardId)
      : [...favoriteBoards, boardId];
    
    setFavoriteBoards(newFavorites);
    localStorage.setItem('favorite-boards', JSON.stringify(newFavorites));
  };

  const handleMultiSelect = () => {
    if (selectedBoards.length === 0) {
      toast.error('Selecione pelo menos um quadro');
      return;
    }
    
    // For now, we'll just switch to the first selected board
    // In a full implementation, this would show a combined view
    setCurrentBoard(selectedBoards[0]);
    setIsMultiSelectOpen(false);
    toast.success(`Visualizando ${selectedBoards.length} quadro(s)`);
  };

  React.useEffect(() => {
    const saved = localStorage.getItem('favorite-boards');
    if (saved) {
      setFavoriteBoards(JSON.parse(saved));
    }
  }, []);

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
          {sortedBoards.map((board) => (
            <DropdownMenuItem
              key={board.id}
              onClick={() => setCurrentBoard(board.id)}
              className="flex items-center justify-between group"
            >
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: board.color }}
                />
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{board.name}</span>
                    {favoriteBoards.includes(board.id) && (
                      <Heart className="w-3 h-3 text-red-500 fill-current" />
                    )}
                  </div>
                  {board.description && (
                    <div className="text-xs text-muted-foreground">{board.description}</div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                {currentBoard?.id === board.id && (
                  <Badge variant="secondary" className="text-xs">Atual</Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavoriteBoard(board.id);
                  }}
                >
                  <Heart className={`w-3 h-3 ${favoriteBoards.includes(board.id) ? 'text-red-500 fill-current' : 'text-muted-foreground'}`} />
                </Button>
              </div>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          
          <Dialog open={isMultiSelectOpen} onOpenChange={setIsMultiSelectOpen}>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Settings className="w-4 h-4 mr-2" />
                Seleção Múltipla
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Selecionar Múltiplos Quadros</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Selecione os quadros que deseja visualizar juntos:
                </p>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {boards.map((board) => (
                    <div key={board.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={board.id}
                        checked={selectedBoards.includes(board.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedBoards([...selectedBoards, board.id]);
                          } else {
                            setSelectedBoards(selectedBoards.filter(id => id !== board.id));
                          }
                        }}
                      />
                      <label htmlFor={board.id} className="flex items-center gap-2 flex-1">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: board.color }}
                        />
                        <span className="text-sm">{board.name}</span>
                        {favoriteBoards.includes(board.id) && (
                          <Heart className="w-3 h-3 text-red-500 fill-current" />
                        )}
                      </label>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsMultiSelectOpen(false)} className="flex-1">
                    Cancelar
                  </Button>
                  <Button onClick={handleMultiSelect} className="flex-1">
                    Aplicar Seleção
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
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
