
import React, { useState } from 'react';
import { useTemplate } from '@/contexts/TemplateContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Heart, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Download, 
  Upload, 
  Copy, 
  Trash2,
  Eye,
  Star,
  Folder
} from 'lucide-react';
import { BoardTemplate } from '@/types/Template';
import { toast } from 'sonner';

export const Templates = () => {
  const { 
    templates, 
    favoriteTemplates, 
    toggleFavoriteTemplate, 
    createBoardFromTemplate,
    deleteTemplate,
    exportTemplate,
    importTemplate 
  } = useTemplate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<BoardTemplate | null>(null);

  const categories = Array.from(new Set(templates.map(t => t.category)));

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesFavorite = !showOnlyFavorites || favoriteTemplates.includes(template.id);
    
    return matchesSearch && matchesCategory && matchesFavorite;
  });

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    // Favorites first, then by usage count, then by name
    const aIsFavorite = favoriteTemplates.includes(a.id);
    const bIsFavorite = favoriteTemplates.includes(b.id);
    
    if (aIsFavorite && !bIsFavorite) return -1;
    if (!aIsFavorite && bIsFavorite) return 1;
    
    const aUsage = a.usageCount || 0;
    const bUsage = b.usageCount || 0;
    if (aUsage !== bUsage) return bUsage - aUsage;
    
    return a.name.localeCompare(b.name);
  });

  const handleCreateFromTemplate = (template: BoardTemplate) => {
    createBoardFromTemplate(template.id);
    setIsCreateDialogOpen(false);
  };

  const handleExportTemplate = (template: BoardTemplate) => {
    try {
      const exportData = exportTemplate(template.id);
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `template-${template.name.toLowerCase().replace(/\s+/g, '-')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Template exportado com sucesso!');
    } catch (error) {
      toast.error('Erro ao exportar template');
    }
  };

  const handleImportTemplate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      importTemplate(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Templates</h1>
            <p className="text-muted-foreground mt-1">
              Acelere seu trabalho com templates pré-configurados
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".json"
                onChange={handleImportTemplate}
                className="hidden"
              />
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Importar
              </Button>
            </label>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Novo Template
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Novo Template</DialogTitle>
                </DialogHeader>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Funcionalidade de criação de templates personalizados será implementada em breve.
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Buscar templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
                >
                  <option value="all">Todas as categorias</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                
                <Button
                  variant={showOnlyFavorites ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                  className="flex items-center gap-2"
                >
                  <Heart className="w-4 h-4" />
                  Favoritos
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedTemplates.map((template) => (
            <Card 
              key={template.id} 
              className="group hover:shadow-lg transition-all duration-200 cursor-pointer"
              onClick={() => setSelectedTemplate(template)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: template.color }}
                      />
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      {favoriteTemplates.includes(template.id) && (
                        <Heart className="w-4 h-4 text-red-500 fill-current" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {template.description}
                    </p>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        handleCreateFromTemplate(template);
                      }}>
                        <Folder className="w-4 h-4 mr-2" />
                        Criar Quadro
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        toggleFavoriteTemplate(template.id);
                      }}>
                        <Heart className="w-4 h-4 mr-2" />
                        {favoriteTemplates.includes(template.id) ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        handleExportTemplate(template);
                      }}>
                        <Download className="w-4 h-4 mr-2" />
                        Exportar
                      </DropdownMenuItem>
                      {!template.isDefault && (
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTemplate(template.id);
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{template.category}</Badge>
                    {template.isDefault && (
                      <Badge variant="outline">Padrão</Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="w-3 h-3" />
                    {template.usageCount || 0}
                  </div>
                </div>
                
                <div className="mt-3 text-xs text-muted-foreground">
                  {template.columns.length} colunas • {template.columns.reduce((acc, col) => acc + col.tasks.length, 0)} tarefas exemplo
                </div>
                
                <Button 
                  className="w-full mt-3" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCreateFromTemplate(template);
                  }}
                >
                  <Folder className="w-4 h-4 mr-2" />
                  Usar Template
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {sortedTemplates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Nenhum template encontrado com os filtros aplicados.
            </p>
          </div>
        )}
      </div>

      {/* Template Preview Dialog */}
      <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedTemplate && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div 
                    className="w-5 h-5 rounded-full"
                    style={{ backgroundColor: selectedTemplate.color }}
                  />
                  {selectedTemplate.name}
                  {favoriteTemplates.includes(selectedTemplate.id) && (
                    <Heart className="w-5 h-5 text-red-500 fill-current" />
                  )}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <p className="text-muted-foreground">{selectedTemplate.description}</p>
                
                <div className="flex items-center gap-4">
                  <Badge variant="secondary">{selectedTemplate.category}</Badge>
                  {selectedTemplate.isDefault && <Badge variant="outline">Padrão</Badge>}
                  <span className="text-sm text-muted-foreground">
                    Usado {selectedTemplate.usageCount || 0} vezes
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedTemplate.columns.map((column) => (
                    <div key={column.id} className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">{column.title}</h4>
                      <div className="space-y-2">
                        {column.tasks.map((task) => (
                          <div key={task.id} className="text-sm p-2 bg-muted rounded">
                            <div className="font-medium">{task.title}</div>
                            {task.description && (
                              <div className="text-muted-foreground mt-1 text-xs">
                                {task.description}
                              </div>
                            )}
                            <div className="flex items-center gap-2 mt-1">
                              {task.priority && (
                                <Badge variant="outline" className="text-xs">
                                  {task.priority}
                                </Badge>
                              )}
                              <span className="text-xs">{task.points} pts</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => toggleFavoriteTemplate(selectedTemplate.id)}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    {favoriteTemplates.includes(selectedTemplate.id) ? 'Remover dos Favoritos' : 'Favoritar'}
                  </Button>
                  <Button onClick={() => handleCreateFromTemplate(selectedTemplate)}>
                    <Folder className="w-4 h-4 mr-2" />
                    Usar Template
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
