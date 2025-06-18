
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Filter, Search, X, Tag, AlertCircle, Calendar } from 'lucide-react';
import { Task } from '@/types/Task';

interface TaskFilterProps {
  tasks: Task[];
  onFilterChange: (filteredTasks: Task[]) => void;
}

interface FilterState {
  search: string;
  status: string;
  priority: string;
  tag: string;
  dueDate: string;
}

export const TaskFilter = ({ tasks, onFilterChange }: TaskFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: 'all',
    priority: 'all',
    tag: 'all',
    dueDate: 'all'
  });

  // Extract unique values for filter options
  const priorities = ['low', 'medium', 'high'];
  const statuses = ['todo', 'doing', 'done'];
  const tags = Array.from(new Set(tasks.flatMap(task => task.tags || [])));

  const applyFilters = (newFilters: FilterState) => {
    let filtered = [...tasks];

    // Search filter
    if (newFilters.search) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(newFilters.search.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(newFilters.search.toLowerCase()))
      );
    }

    // Status filter
    if (newFilters.status !== 'all') {
      filtered = filtered.filter(task => task.status === newFilters.status);
    }

    // Priority filter
    if (newFilters.priority !== 'all') {
      filtered = filtered.filter(task => task.priority === newFilters.priority);
    }

    // Tag filter
    if (newFilters.tag !== 'all') {
      filtered = filtered.filter(task => 
        task.tags && task.tags.includes(newFilters.tag)
      );
    }

    // Due date filter
    if (newFilters.dueDate !== 'all') {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);

      filtered = filtered.filter(task => {
        const taskDate = new Date(task.dueDate);
        switch (newFilters.dueDate) {
          case 'today':
            return taskDate.toDateString() === today.toDateString();
          case 'tomorrow':
            return taskDate.toDateString() === tomorrow.toDateString();
          case 'week':
            return taskDate <= nextWeek && taskDate >= today;
          case 'overdue':
            return taskDate < today && task.status !== 'done';
          default:
            return true;
        }
      });
    }

    onFilterChange(filtered);
  };

  const updateFilter = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      status: 'all',
      priority: 'all',
      tag: 'all',
      dueDate: 'all'
    };
    setFilters(clearedFilters);
    applyFilters(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== 'all' && value !== '');
  const activeFilterCount = Object.values(filters).filter(value => value !== 'all' && value !== '').length;

  return (
    <Card className="mb-6 bg-card border-border">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filtros
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground"
              >
                <X className="w-4 h-4 mr-1" />
                Limpar
              </Button>
            )}
          </div>
        </div>

        {/* Search Bar - Always Visible */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar tarefas..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Expandable Filters */}
        {isOpen && (
          <div className="space-y-4 animate-slide-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Status</label>
                <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="todo">A Fazer</SelectItem>
                    <SelectItem value="doing">Fazendo</SelectItem>
                    <SelectItem value="done">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Priority Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Prioridade</label>
                <Select value={filters.priority} onValueChange={(value) => updateFilter('priority', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as prioridades" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {priorities.map(priority => (
                      <SelectItem key={priority} value={priority}>
                        <div className="flex items-center gap-2">
                          <AlertCircle className={`w-3 h-3 ${
                            priority === 'high' ? 'text-red-500' :
                            priority === 'medium' ? 'text-yellow-500' : 'text-green-500'
                          }`} />
                          {priority === 'high' ? 'Alta' : priority === 'medium' ? 'Média' : 'Baixa'}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tag Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Tag</label>
                <Select value={filters.tag} onValueChange={(value) => updateFilter('tag', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as tags" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {tags.map(tag => (
                      <SelectItem key={tag} value={tag}>
                        <div className="flex items-center gap-2">
                          <Tag className="w-3 h-3" />
                          {tag}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Due Date Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Data de Vencimento</label>
                <Select value={filters.dueDate} onValueChange={(value) => updateFilter('dueDate', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as datas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="today">Hoje</SelectItem>
                    <SelectItem value="tomorrow">Amanhã</SelectItem>
                    <SelectItem value="week">Esta Semana</SelectItem>
                    <SelectItem value="overdue">Atrasadas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                <span className="text-sm font-medium text-foreground">Filtros ativos:</span>
                {filters.search && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Search className="w-3 h-3" />
                    {filters.search}
                    <button onClick={() => updateFilter('search', '')}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {filters.status !== 'all' && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Status: {filters.status === 'todo' ? 'A Fazer' : filters.status === 'doing' ? 'Fazendo' : 'Concluído'}
                    <button onClick={() => updateFilter('status', 'all')}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {filters.priority !== 'all' && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Prioridade: {filters.priority === 'high' ? 'Alta' : filters.priority === 'medium' ? 'Média' : 'Baixa'}
                    <button onClick={() => updateFilter('priority', 'all')}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {filters.tag !== 'all' && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Tag: {filters.tag}
                    <button onClick={() => updateFilter('tag', 'all')}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {filters.dueDate !== 'all' && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {filters.dueDate === 'today' ? 'Hoje' : 
                     filters.dueDate === 'tomorrow' ? 'Amanhã' : 
                     filters.dueDate === 'week' ? 'Esta Semana' : 'Atrasadas'}
                    <button onClick={() => updateFilter('dueDate', 'all')}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
