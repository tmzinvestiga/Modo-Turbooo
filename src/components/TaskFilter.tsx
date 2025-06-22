
import React, { useState, useEffect } from 'react';
import { Task } from '@/types/Task';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, X, Filter, SortAsc, SortDesc } from 'lucide-react';
import { colorOptions } from '@/utils/localization';

interface TaskFilterProps {
  tasks: Task[];
  onFilterChange: (filteredTasks: Task[]) => void;
}

type SortOption = 'created' | 'dueDate' | 'priority' | 'points' | 'title';
type SortDirection = 'asc' | 'desc';

const priorityOrder = {
  'critical': 4,
  'high': 3,
  'medium': 2,
  'low': 1,
  undefined: 0
};

export const TaskFilter = ({ tasks, onFilterChange }: TaskFilterProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('created');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Get all unique tags and labels from tasks
  const allTags = Array.from(new Set(tasks.flatMap(task => task.tags || [])));
  const allLabels = Array.from(new Set(tasks.flatMap(task => task.labels || [])));

  const applyFiltersAndSort = () => {
    let filtered = [...tasks];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower)
      );
    }

    // Apply priority filter
    if (selectedPriority !== 'all') {
      filtered = filtered.filter(task => 
        selectedPriority === 'none' 
          ? !task.priority 
          : task.priority === selectedPriority
      );
    }

    // Apply labels filter
    if (selectedLabels.length > 0) {
      filtered = filtered.filter(task => 
        task.labels && task.labels.some(label => selectedLabels.includes(label))
      );
    }

    // Apply tags filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(task => 
        task.tags && task.tags.some(tag => selectedTags.includes(tag))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'dueDate':
          comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          break;
        case 'priority':
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case 'points':
          comparison = a.points - b.points;
          break;
        case 'created':
        default:
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    onFilterChange(filtered);
  };

  useEffect(() => {
    applyFiltersAndSort();
  }, [searchTerm, selectedPriority, selectedLabels, selectedTags, sortBy, sortDirection, tasks]);

  const handleLabelToggle = (labelId: string) => {
    setSelectedLabels(prev => 
      prev.includes(labelId) 
        ? prev.filter(id => id !== labelId)
        : [...prev, labelId]
    );
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedPriority('all');
    setSelectedLabels([]);
    setSelectedTags([]);
    setSortBy('created');
    setSortDirection('desc');
  };

  const hasActiveFilters = searchTerm || selectedPriority !== 'all' || selectedLabels.length > 0 || selectedTags.length > 0;

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros e Ordenação
          </CardTitle>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={clearAllFilters}>
              <X className="w-4 h-4 mr-2" />
              Limpar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Buscar</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="search"
              type="text"
              placeholder="Buscar por título ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Priority Filter */}
        <div className="space-y-2">
          <Label>Prioridade</Label>
          <Select value={selectedPriority} onValueChange={setSelectedPriority}>
            <SelectTrigger>
              <SelectValue placeholder="Selecionar prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="critical">Crítica</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="low">Baixa</SelectItem>
              <SelectItem value="none">Sem prioridade</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Labels Filter */}
        {allLabels.length > 0 && (
          <div className="space-y-2">
            <Label>Etiquetas</Label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => {
                if (!allLabels.includes(color.id)) return null;
                const isSelected = selectedLabels.includes(color.id);
                return (
                  <button
                    key={color.id}
                    onClick={() => handleLabelToggle(color.id)}
                    className={`flex items-center gap-2 px-3 py-1 rounded-full border-2 transition-all ${
                      isSelected 
                        ? 'border-primary bg-primary/10' 
                        : 'border-transparent hover:border-border'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full ${color.bg}`} />
                    <span className="text-sm">{color.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tags Filter */}
        {allTags.length > 0 && (
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <Badge
                    key={tag}
                    variant={isSelected ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/10"
                    onClick={() => handleTagToggle(tag)}
                  >
                    {tag}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        {/* Sorting */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Ordenar por</Label>
            <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created">Data de criação</SelectItem>
                <SelectItem value="dueDate">Data de vencimento</SelectItem>
                <SelectItem value="priority">Prioridade</SelectItem>
                <SelectItem value="points">Pontos</SelectItem>
                <SelectItem value="title">Título</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Direção</Label>
            <Button
              variant="outline"
              onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="w-full justify-start"
            >
              {sortDirection === 'asc' ? (
                <>
                  <SortAsc className="w-4 h-4 mr-2" />
                  Crescente
                </>
              ) : (
                <>
                  <SortDesc className="w-4 h-4 mr-2" />
                  Decrescente
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Results count */}
        <div className="text-sm text-muted-foreground pt-2 border-t">
          Mostrando {tasks.length} de {tasks.length} tarefas
        </div>
      </CardContent>
    </Card>
  );
};
