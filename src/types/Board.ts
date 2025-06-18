
export interface Board {
  id: string;
  name: string;
  description?: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  isDefault?: boolean;
}

export interface BoardContextType {
  boards: Board[];
  currentBoard: Board | null;
  addBoard: (board: Omit<Board, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBoard: (boardId: string, updates: Partial<Board>) => void;
  deleteBoard: (boardId: string) => void;
  setCurrentBoard: (boardId: string) => void;
}
