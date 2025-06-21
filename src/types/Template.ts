
import { Board } from './Board';

export interface TaskTemplate {
  id: string;
  title: string;
  status: 'todo' | 'doing' | 'done';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  points: number;
  description?: string;
  tags?: string[];
  labels?: string[];
}

export interface ColumnTemplate {
  id: string;
  title: string;
  status: 'todo' | 'doing' | 'done';
  tasks: TaskTemplate[];
}

export interface BoardTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  isDefault: boolean;
  isFavorite: boolean;
  coverImage?: string;
  color: string;
  columns: ColumnTemplate[];
  createdAt: Date;
  updatedAt: Date;
  authorId?: string;
  isPublic?: boolean;
  usageCount?: number;
}

export interface TemplateContextType {
  templates: BoardTemplate[];
  favoriteTemplates: string[];
  addTemplate: (template: Omit<BoardTemplate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTemplate: (templateId: string, updates: Partial<BoardTemplate>) => void;
  deleteTemplate: (templateId: string) => void;
  toggleFavoriteTemplate: (templateId: string) => void;
  createBoardFromTemplate: (templateId: string, boardName?: string) => Board;
  exportTemplate: (templateId: string) => string;
  importTemplate: (templateData: string) => void;
}
