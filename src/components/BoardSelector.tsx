
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
  DialogFooter,
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronDown, Plus, Edit2, Trash2, Folder, Heart } from 'lucide-react';
import { toast } from 'sonner';

export const BoardSelector = () => {
  const { boards, currentBoard, addBoard, updateBoard, deleteBoard, setCurrentBoard } = useBoard();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingBoard, setEditingBoard] = useState<any>(null);
  const [newBoardName, setNewBoardName] = useState('');
  const [newBoardDescription, setNewBoardDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState('#4F46E5');
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

  const handleEditBoard = (board: any) => {
    setEditingBoard(board);
    setNewBoardName(board.name);
    setNewBoardDescription(board.description || '');
    setSelectedColor(board.color);
    setIsEditDialogOpen(true);
  };

  const handleUpdateBoard = () => {
    if (!newBoardName.trim()) {
      toast.error('Nome do quadro é obrigatório');
      return;
    }

    updateBoard(editingBoard.id, {
      name: newBoardName.trim(),
      description: newBoardDescription.trim(),
      color: selectedColor,
    });

    setIsEditDialogOpen(false);
    setEditingBoard(null);
    setNewBoardName('');
    setNewBoardDescription('');
    setSelectedColor('#4F46E5');
    toast.success('Quadro atualizado com sucesso!');
  };

  const handleDeleteBoard = (boardId: string) => {
    const board = boards.find(b => b.id === boardId);
    if (board?.isDefault) {
      toast.error('Não é possível excluir o quadro padrão');
      return;
    }
    
    deleteBoard(boardId);
    
    // If we deleted the current board, switch to the first available board
    if (currentBoard?.id === boardId) {
      const remainingBoards = boards.filter(b => b.id !== boardId);
      if (remainingBoards.length > 0) {
        setCurrentBoard(remainingBoards[0].id);
      }
    }
    
    toast.success('Quadro excluído com sucesso!');
  };

  const toggleFavoriteBoard = (boardId: string) => {
    const newFavorites = favoriteBoards.includes(boardId)
      ? favoriteBoards.filter(id => id !== boardId)
      : [...favoriteBoards, boardId];
    
    setFavoriteBoards(newFavorites);
    localStorage.setItem('favorite-boards', JSON.stringify(newFavorites));
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
        <DropdownMenuContent align="start" className="w-80">
          {sortedBoards.map((board) => (
            <DropdownMenuItem
              key={board.id}
              onClick={() => setCurrentBoard(board.id)}
              className="flex items-center justify-between group p-3"
            >
              <div className="flex items-center gap-3 flex-1">
                <div 
                  className="w-4 h-4 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: board.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium truncate">{board.name}</span>
                    {favoriteBoards.includes(board.id) && (
                      <Heart className="w-3 h-3 text-red-500 fill-current flex-shrink-0" />
                    )}
                    {currentBoard?.id === board.id && (
                      <Badge variant="secondary" className="text-xs">Atual</Badge>
                    )}
                  </div>
                  {board.description && (
                    <div className="text-xs text-muted-foreground truncate">{board.description}</div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavoriteBoard(board.id);
                  }}
                >
                  <Heart className={`w-3 h-3 ${favoriteBoards.includes(board.id) ? 'text-red-500 fill-current' : 'text-muted-foreground'}`} />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditBoard(board);
                  }}
                >
                  <Edit2 className="w-3 h-3 text-muted-foreground" />
                </Button>
                
                {!board.isDefault && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Trash2 className="w-3 h-3 text-red-500" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir Quadro</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir o quadro "{board.name}"? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteBoard(board.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
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
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddBoard}>
                    <Folder className="w-4 h-4 mr-2" />
                    Criar Quadro
                  </Button>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Board Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Quadro</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editBoardName">Nome do Quadro</Label>
              <Input
                id="editBoardName"
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                placeholder="Nome do quadro"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="editBoardDescription">Descrição (opcional)</Label>
              <Input
                id="editBoardDescription"
                value={newBoardDescription}
                onChange={(e) => setNewBoardDescription(e.target.value)}
                placeholder="Descrição do quadro"
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
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdateBoard}>
                Salvar Alterações
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
