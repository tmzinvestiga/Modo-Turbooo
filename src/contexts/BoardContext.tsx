
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Board } from '@/types/Board';
import { Task } from '@/types/Task';
import { useTaskStore } from '@/hooks/useTaskStore';

interface BoardContextType {
  boards: Board[];
  currentBoard: Board | null;
  addBoard: (board: Omit<Board, 'id' | 'createdAt' | 'updatedAt'>, templateColumns?: any[], templateTasks?: any[]) => void;
  updateBoard: (boardId: string, updates: Partial<Board>) => void;
  deleteBoard: (boardId: string) => void;
  setCurrentBoard: (boardId: string) => void;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export const useBoard = () => {
  const context = useContext(BoardContext);
  if (context === undefined) {
    throw new Error('useBoard must be used within a BoardProvider');
  }
  return context;
};

const BOARDS_STORAGE_KEY = 'modo-turbo-boards';
const CURRENT_BOARD_KEY = 'current-board-id';

const DEFAULT_BOARD: Board = {
  id: 'default',
  name: 'Quadro Principal',
  description: 'Seu quadro principal para organizar tarefas',
  color: '#4F46E5',
  isDefault: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const BoardProvider = ({ children }: { children: ReactNode }) => {
  const [boards, setBoards] = useState<Board[]>([DEFAULT_BOARD]);
  const [currentBoard, setCurrentBoardState] = useState<Board | null>(DEFAULT_BOARD);
  const { addTask } = useTaskStore();

  useEffect(() => {
    const savedBoards = localStorage.getItem(BOARDS_STORAGE_KEY);
    const savedCurrentBoardId = localStorage.getItem(CURRENT_BOARD_KEY);
    
    if (savedBoards) {
      const parsedBoards = JSON.parse(savedBoards).map((board: any) => ({
        ...board,
        createdAt: new Date(board.createdAt),
        updatedAt: new Date(board.updatedAt),
      }));
      
      const allBoards = [DEFAULT_BOARD, ...parsedBoards.filter((b: Board) => b.id !== 'default')];
      setBoards(allBoards);
      
      if (savedCurrentBoardId) {
        const currentBoard = allBoards.find((b: Board) => b.id === savedCurrentBoardId);
        if (currentBoard) {
          setCurrentBoardState(currentBoard);
        }
      }
    }
  }, []);

  const saveBoards = (newBoards: Board[]) => {
    const customBoards = newBoards.filter(board => !board.isDefault);
    setBoards(newBoards);
    localStorage.setItem(BOARDS_STORAGE_KEY, JSON.stringify(customBoards));
  };

  const addBoard = (boardData: Omit<Board, 'id' | 'createdAt' | 'updatedAt'>, templateColumns?: any[], templateTasks?: any[]) => {
    const newBoard: Board = {
      ...boardData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const newBoards = [...boards, newBoard];
    saveBoards(newBoards);
    setCurrentBoard(newBoard.id);

    // If template data is provided, create the template tasks
    if (templateColumns && templateTasks) {
      templateTasks.forEach((templateTask: any) => {
        const newTask: Omit<Task, 'id' | 'createdAt'> = {
          title: templateTask.title,
          description: templateTask.description || '',
          status: templateTask.status,
          priority: templateTask.priority,
          points: templateTask.points || 3,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to 1 week from now
          tags: templateTask.tags || [],
          labels: templateTask.labels || [],
          boardId: newBoard.id,
        };
        addTask(newTask);
      });
    }
  };

  const updateBoard = (boardId: string, updates: Partial<Board>) => {
    const newBoards = boards.map(board => 
      board.id === boardId 
        ? { ...board, ...updates, updatedAt: new Date() }
        : board
    );
    saveBoards(newBoards);
    
    if (currentBoard?.id === boardId) {
      setCurrentBoardState(newBoards.find(b => b.id === boardId) || null);
    }
  };

  const deleteBoard = (boardId: string) => {
    const board = boards.find(b => b.id === boardId);
    if (board?.isDefault) return;
    
    const newBoards = boards.filter(board => board.id !== boardId);
    saveBoards(newBoards);
    
    if (currentBoard?.id === boardId) {
      setCurrentBoard(newBoards[0]?.id || 'default');
    }
  };

  const setCurrentBoard = (boardId: string) => {
    const board = boards.find(b => b.id === boardId);
    if (board) {
      setCurrentBoardState(board);
      localStorage.setItem(CURRENT_BOARD_KEY, boardId);
    }
  };

  const value: BoardContextType = {
    boards,
    currentBoard,
    addBoard,
    updateBoard,
    deleteBoard,
    setCurrentBoard,
  };

  return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>;
};
