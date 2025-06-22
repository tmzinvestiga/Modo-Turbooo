
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Filter, Search, X, Tag, AlertCircle, Calendar, ArrowUpDown, SortAsc, SortDesc } from 'lucide-react';
import { Task } from '@/types/Task';
import { colorOptions } from '@/utils/localization';

interface TaskFilterProps {
  tasks: Task[];
  onFilterChange: (filteredTasks: Task[]) => void;
}

interface FilterState {
  search: string;
  status: string;
  priority: string;
  tag: string;
  label: string;
  dueDate: string;
}

interface SortState {
  field: string;
  direction: 'asc' | 'desc';
}

export const TaskFilter = ({ tasks, onFilterChange }: TaskFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: 'all',
    priority: 'all',
    tag: 'all',
    label: 'all',
    dueDate: 'all'
  });
  const [sort, setSort] = useState<SortState>({
    field: 'createdAt',
    direction: 'desc'
  });

  // Extract unique values for filter options
  const priorities = ['low', 'medium', 'high', 'critical'];
  const statuses = ['todo', 'doing', 'done'];
  const tags = Array.from(new Set(tasks.flatMap(task => task.tags || [])));
  const labels = Array.from(new Set(tasks.flatMap(task => task.labels || [])));

  const sortTasks = (tasksToSort: Task[], sortState: SortState) => {
    return [...tasksToSort].sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortState.field) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'priority':
          const priorityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
          aValue = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
          bValue = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
          break;
        case 'dueDate':
          aValue = new Date(a.dueDate).getTime();
          bValue = new Date(b.dueDate).getTime();
          break;
        case 'points':
          aValue = a.points;
          bValue = b.points;
          break;
        case 'status':
          const statusOrder = { 'todo': 1, 'doing': 2, 'done': 3 };
          aValue = statusOrder[a.status];
          bValue = statusOrder[b.status];
          break;
        case 'createdAt':
        default:
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
      }

      if (sortState.direction === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });
  };

  const applyFiltersAndSort = (newFilters: FilterState, newSort?: SortState) => {
    const currentSort = newSort || sort;
    let filtered = [...tasks];

    // Apply filters
    if (newFilters.search) {
      const searchLower = newFilters.search.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchLower) ||
        (task.description && task.description.toLowerCase().includes(searchLower)) ||
        (task.tags && task.tags.some(tag => tag.toLowerCase().includes(searchLower)))
      );
    }

    if (newFilters.status !== 'all') {
      filtered = filtered.filter(task => task.status === newFilters.status);
    }

    if (newFilters.priority !== 'all') {
      filtered = filtered.filter(task => task.priority === newFilters.priority);
    }

    if (newFilters.tag !== 'all') {
      filtered = filtered.filter(task => 
        task.tags && task.tags.includes(newFilters.tag)
      );
    }

    if (newFilters.label !== 'all') {
      filtered = filtered.filter(task => 
        task.labels && task.labels.includes(newFilters.label)
      );
    }

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

    // Apply sorting
    const sortedAndFiltered = sortTasks(filtered, currentSort);
    onFilterChange(sortedAndFiltered);
  };

  const updateFilter = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    applyFiltersAndSort(newFilters);
  };

  const updateSort = (field: string) => {
    const newDirection: 'asc' | 'desc' = sort.field === field && sort.direction === 'asc' ? 'desc' : 'asc';
    const newSort: SortState = { field, direction: newDirection };
    setSort(newSort);
    applyFiltersAndSort(filters, newSort);
  };

  const clearAll = () => {
    const clearedFilters = {
      search: '',
      status: 'all',
      priority: 'all',
      tag: 'all',
      label: 'all',
      dueDate: 'all'
    };
    const defaultSort = { field: 'createdAt', direction: 'desc' as const };
    setFilters(clearedFilters);
    setSort(defaultSort);
    applyFiltersAndSort(clearedFilters, defaultSort);
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== 'all' && value !== '');
  const activeFilterCount = Object.values(filters).filter(value => value !== 'all' && value !== '').length;

  // Apply initial filters when tasks change
  useEffect(() => {
    applyFiltersAndSort(filters);
  }, [tasks]);

  return (
    <Card className="mb-6 bg-card border-border">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filtros
                  {activeFilterCount > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Filtros Avançados</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Search */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Buscar</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Buscar tarefas, descrições ou tags..."
                        value={filters.search}
                        onChange={(e) => updateFilter('search', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Filters */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Status</label>
                      <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="todo">A Fazer</SelectItem>
                          <SelectItem value="doing">Fazendo</SelectItem>
                          <SelectItem value="done">Concluído</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Prioridade</label>
                      <Select value={filters.priority} onValueChange={(value) => updateFilter('priority', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas</SelectItem>
                          {priorities.map(priority => (
                            <SelectItem key={priority} value={priority}>
                              <div className="flex items-center gap-2">
                                <AlertCircle className={`w-3 h-3 ${
                                  priority === 'critical' ? 'text-red-600' :
                                  priority === 'high' ? 'text-red-500' :
                                  priority === 'medium' ? 'text-yellow-500' : 'text-green-500'
                                }`} />
                                {priority === 'critical' ? 'Crítica' :
                                 priority === 'high' ? 'Alta' : 
                                 priority === 'medium' ? 'Média' : 'Baixa'}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {labels.length > 0 && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Etiquetas</label>
                        <Select value={filters.label} onValueChange={(value) => updateFilter('label', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todas</SelectItem>
                            {labels.map(label => {
                              const color = colorOptions.find(c => c.id === label);
                              return (
                                <SelectItem key={label} value={label}>
                                  <div className="flex items-center gap-2">
                                    <div 
                                      className="w-3 h-3 rounded-full"
                                      style={{ backgroundColor: color?.value || '#6b7280' }}
                                    />
                                    {color?.name || label}
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {tags.length > 0 && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Tags</label>
                        <Select value={filters.tag} onValueChange={(value) => updateFilter('tag', value)}>
                          <SelectTrigger>
                            <SelectValue />
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
                    )}

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Data de Vencimento</label>
                      <Select value={filters.dueDate} onValueChange={(value) => updateFilter('dueDate', value)}>
                        <SelectTrigger>
                          <SelectValue />
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

                  {hasActiveFilters && (
                    <div className="pt-4 border-t">
                      <Button variant="outline" onClick={clearAll} className="w-full">
                        <X className="w-4 h-4 mr-2" />
                        Limpar Todos os Filtros
                      </Button>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearAll}>
                <X className="w-4 h-4 mr-1" />
                Limpar
              </Button>
            )}
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Ordenar por:</span>
            <Select value={sort.field} onValueChange={updateSort}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Data de Criação</SelectItem>
                <SelectItem value="title">Título</SelectItem>
                <SelectItem value="priority">Prioridade</SelectItem>
                <SelectItem value="dueDate">Data de Venc.</SelectItem>
                <SelectItem value="points">Pontos</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => updateSort(sort.field)}
              className="flex items-center gap-1"
            >
              {sort.direction === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Quick Search - Always Visible */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Busca rápida..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mt-3">
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
                Prioridade: {filters.priority === 'critical' ? 'Crítica' : filters.priority === 'high' ? 'Alta' : filters.priority === 'medium' ? 'Média' : 'Baixa'}
                <button onClick={() => updateFilter('priority', 'all')}>
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {filters.label !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {colorOptions.find(c => c.id === filters.label)?.name || filters.label}
                <button onClick={() => updateFilter('label', 'all')}>
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
      </CardContent>
    </Card>
  );
};
