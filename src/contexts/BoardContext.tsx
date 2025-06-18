
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Board, BoardContextType } from '@/types/Board';

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export const useBoard = () => {
  const context = useContext(BoardContext);
  if (context === undefined) {
    throw new Error('useBoard must be used within a BoardProvider');
  }
  return context;
};

interface BoardProviderProps {
  children: ReactNode;
}

const BOARDS_STORAGE_KEY = 'modo-turbo-boards';
const CURRENT_BOARD_KEY = 'modo-turbo-current-board';

const DEFAULT_BOARD: Board = {
  id: 'default',
  name: 'Pessoal',
  description: 'Suas tarefas pessoais',
  color: '#4F46E5',
  createdAt: new Date(),
  updatedAt: new Date(),
  isDefault: true,
};

export const BoardProvider = ({ children }: BoardProviderProps) => {
  const [boards, setBoards] = useState<Board[]>([DEFAULT_BOARD]);
  const [currentBoard, setCurrentBoardState] = useState<Board | null>(DEFAULT_BOARD);

  useEffect(() => {
    const savedBoards = localStorage.getItem(BOARDS_STORAGE_KEY);
    const savedCurrentBoardId = localStorage.getItem(CURRENT_BOARD_KEY);
    
    if (savedBoards) {
      const parsedBoards = JSON.parse(savedBoards).map((board: any) => ({
        ...board,
        createdAt: new Date(board.createdAt),
        updatedAt: new Date(board.updatedAt),
      }));
      setBoards(parsedBoards);
      
      if (savedCurrentBoardId) {
        const currentBoard = parsedBoards.find((board: Board) => board.id === savedCurrentBoardId);
        if (currentBoard) {
          setCurrentBoardState(currentBoard);
        }
      }
    }
  }, []);

  const saveBoards = (newBoards: Board[]) => {
    setBoards(newBoards);
    localStorage.setItem(BOARDS_STORAGE_KEY, JSON.stringify(newBoards));
  };

  const addBoard = (boardData: Omit<Board, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newBoard: Board = {
      ...boardData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    saveBoards([...boards, newBoard]);
  };

  const updateBoard = (boardId: string, updates: Partial<Board>) => {
    const newBoards = boards.map(board => 
      board.id === boardId 
        ? { ...board, ...updates, updatedAt: new Date() }
        : board
    );
    saveBoards(newBoards);
    
    if (currentBoard?.id === boardId) {
      const updatedCurrentBoard = newBoards.find(board => board.id === boardId);
      if (updatedCurrentBoard) {
        setCurrentBoardState(updatedCurrentBoard);
      }
    }
  };

  const deleteBoard = (boardId: string) => {
    if (boards.length <= 1 || boards.find(board => board.id === boardId)?.isDefault) {
      return; // Can't delete the last board or default board
    }
    
    const newBoards = boards.filter(board => board.id !== boardId);
    saveBoards(newBoards);
    
    if (currentBoard?.id === boardId) {
      const newCurrentBoard = newBoards[0];
      setCurrentBoard(newCurrentBoard.id);
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
