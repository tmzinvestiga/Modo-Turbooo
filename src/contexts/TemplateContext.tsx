
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { BoardTemplate, TemplateContextType } from '@/types/Template';
import { Board } from '@/types/Board';
import { useBoard } from './BoardContext';
import { toast } from 'sonner';

const TemplateContext = createContext<TemplateContextType | undefined>(undefined);

export const useTemplate = () => {
  const context = useContext(TemplateContext);
  if (context === undefined) {
    throw new Error('useTemplate must be used within a TemplateProvider');
  }
  return context;
};

interface TemplateProviderProps {
  children: ReactNode;
}

const TEMPLATES_STORAGE_KEY = 'modo-turbo-templates';
const FAVORITE_TEMPLATES_KEY = 'modo-turbo-favorite-templates';

const DEFAULT_TEMPLATES: BoardTemplate[] = [
  {
    id: 'meeting-agenda',
    name: 'Reunião de Trabalho',
    description: 'Template para organizar reuniões de trabalho com tópicos, discussões e ações',
    category: 'Trabalho',
    isDefault: true,
    isFavorite: false,
    color: '#3B82F6',
    createdAt: new Date(),
    updatedAt: new Date(),
    columns: [
      {
        id: 'to-discuss',
        title: 'A Discutir',
        status: 'todo',
        tasks: [
          {
            id: 'sample-1',
            title: 'Revisar orçamento Q4',
            status: 'todo',
            priority: 'high',
            points: 5,
            description: 'Analisar os números do último trimestre',
            tags: ['financeiro', 'urgente']
          }
        ]
      },
      {
        id: 'discussing',
        title: 'Em Discussão',
        status: 'doing',
        tasks: []
      },
      {
        id: 'actions',
        title: 'Ações Definidas',
        status: 'done',
        tasks: []
      }
    ]
  },
  {
    id: 'sprint-roadmap',
    name: 'Roadmap de Sprint',
    description: 'Template para gerenciar sprints de desenvolvimento com backlog, desenvolvimento e entrega',
    category: 'Desenvolvimento',
    isDefault: true,
    isFavorite: false,
    color: '#16A34A',
    createdAt: new Date(),
    updatedAt: new Date(),
    columns: [
      {
        id: 'backlog',
        title: 'Backlog',
        status: 'todo',
        tasks: [
          {
            id: 'feature-1',
            title: 'Implementar autenticação',
            status: 'todo',
            priority: 'high',
            points: 8,
            description: 'Sistema de login com email e senha',
            tags: ['frontend', 'backend']
          }
        ]
      },
      {
        id: 'in-progress',
        title: 'Em Desenvolvimento',
        status: 'doing',
        tasks: []
      },
      {
        id: 'completed',
        title: 'Entregue',
        status: 'done',
        tasks: []
      }
    ]
  },
  {
    id: 'content-calendar',
    name: 'Calendário de Conteúdo',
    description: 'Template para planejamento de conteúdo para redes sociais e marketing',
    category: 'Marketing',
    isDefault: true,
    isFavorite: false,
    color: '#EC4899',
    createdAt: new Date(),
    updatedAt: new Date(),
    columns: [
      {
        id: 'ideas',
        title: 'Ideias',
        status: 'todo',
        tasks: [
          {
            id: 'post-1',
            title: 'Post sobre produtividade',
            status: 'todo',
            priority: 'medium',
            points: 3,
            description: 'Criar conteúdo sobre técnicas de produtividade',
            tags: ['instagram', 'linkedin'],
            labels: ['blue']
          }
        ]
      },
      {
        id: 'production',
        title: 'Em Produção',
        status: 'doing',
        tasks: []
      },
      {
        id: 'published',
        title: 'Publicado',
        status: 'done',
        tasks: []
      }
    ]
  }
];

export const TemplateProvider = ({ children }: TemplateProviderProps) => {
  const [templates, setTemplates] = useState<BoardTemplate[]>(DEFAULT_TEMPLATES);
  const [favoriteTemplates, setFavoriteTemplates] = useState<string[]>([]);
  const { addBoard } = useBoard();

  useEffect(() => {
    const savedTemplates = localStorage.getItem(TEMPLATES_STORAGE_KEY);
    const savedFavorites = localStorage.getItem(FAVORITE_TEMPLATES_KEY);
    
    if (savedTemplates) {
      const parsedTemplates = JSON.parse(savedTemplates).map((template: any) => ({
        ...template,
        createdAt: new Date(template.createdAt),
        updatedAt: new Date(template.updatedAt),
      }));
      
      // Merge with default templates
      const allTemplates = [...DEFAULT_TEMPLATES];
      parsedTemplates.forEach((saved: BoardTemplate) => {
        if (!allTemplates.find(t => t.id === saved.id)) {
          allTemplates.push(saved);
        }
      });
      
      setTemplates(allTemplates);
    }
    
    if (savedFavorites) {
      setFavoriteTemplates(JSON.parse(savedFavorites));
    }
  }, []);

  const saveTemplates = (newTemplates: BoardTemplate[]) => {
    const customTemplates = newTemplates.filter(t => !t.isDefault);
    setTemplates(newTemplates);
    localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(customTemplates));
  };

  const saveFavorites = (newFavorites: string[]) => {
    setFavoriteTemplates(newFavorites);
    localStorage.setItem(FAVORITE_TEMPLATES_KEY, JSON.stringify(newFavorites));
  };

  const addTemplate = (templateData: Omit<BoardTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTemplate: BoardTemplate = {
      ...templateData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const newTemplates = [...templates, newTemplate];
    saveTemplates(newTemplates);
    toast.success('Template criado com sucesso!');
  };

  const updateTemplate = (templateId: string, updates: Partial<BoardTemplate>) => {
    const newTemplates = templates.map(template => 
      template.id === templateId 
        ? { ...template, ...updates, updatedAt: new Date() }
        : template
    );
    saveTemplates(newTemplates);
    toast.success('Template atualizado com sucesso!');
  };

  const deleteTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template?.isDefault) {
      toast.error('Não é possível excluir templates padrão');
      return;
    }
    
    const newTemplates = templates.filter(template => template.id !== templateId);
    const newFavorites = favoriteTemplates.filter(id => id !== templateId);
    
    saveTemplates(newTemplates);
    saveFavorites(newFavorites);
    toast.success('Template excluído com sucesso!');
  };

  const toggleFavoriteTemplate = (templateId: string) => {
    const newFavorites = favoriteTemplates.includes(templateId)
      ? favoriteTemplates.filter(id => id !== templateId)
      : [...favoriteTemplates, templateId];
    
    saveFavorites(newFavorites);
  };

  const createBoardFromTemplate = (templateId: string, boardName?: string): Board => {
    const template = templates.find(t => t.id === templateId);
    if (!template) {
      throw new Error('Template não encontrado');
    }

    const boardData = {
      name: boardName || template.name,
      description: template.description,
      color: template.color,
    };

    addBoard(boardData);
    
    // Update usage count
    updateTemplate(templateId, { 
      usageCount: (template.usageCount || 0) + 1 
    });

    toast.success(`Quadro criado a partir do template "${template.name}"!`);
    
    return {
      id: Date.now().toString(),
      ...boardData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  };

  const exportTemplate = (templateId: string): string => {
    const template = templates.find(t => t.id === templateId);
    if (!template) {
      throw new Error('Template não encontrado');
    }

    const exportData = {
      ...template,
      id: undefined, // Remove ID for import
      isDefault: false,
      isFavorite: false,
      usageCount: 0,
      authorId: undefined,
    };

    return JSON.stringify(exportData, null, 2);
  };

  const importTemplate = (templateData: string) => {
    try {
      const parsed = JSON.parse(templateData);
      addTemplate({
        ...parsed,
        isDefault: false,
        isFavorite: false,
        usageCount: 0,
      });
    } catch (error) {
      toast.error('Erro ao importar template. Verifique o formato do arquivo.');
    }
  };

  const value: TemplateContextType = {
    templates,
    favoriteTemplates,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    toggleFavoriteTemplate,
    createBoardFromTemplate,
    exportTemplate,
    importTemplate,
  };

  return <TemplateContext.Provider value={value}>{children}</TemplateContext.Provider>;
};
