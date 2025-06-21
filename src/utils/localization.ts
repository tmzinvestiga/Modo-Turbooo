
export const pt = {
  // Dashboard
  dashboard: {
    noBoard: 'Nenhum quadro selecionado',
    selectBoard: 'Selecione um quadro para visualizar suas tarefas',
    filters: 'Filtros',
    newTask: 'Nova Tarefa',
    tasks: 'tarefas'
  },
  
  // Task Columns
  columns: {
    todo: 'A Fazer',
    doing: 'Fazendo',
    done: 'Concluído'
  },
  
  // Task Actions
  task: {
    addTask: 'Adicionar Tarefa',
    editTask: 'Editar Tarefa',
    deleteTask: 'Excluir Tarefa',
    complete: 'Concluir',
    overdue: 'Atrasado',
    today: 'Hoje',
    tomorrow: 'Amanhã',
    points: 'pts'
  },
  
  // Task Modal
  modal: {
    createTask: 'Criar Nova Tarefa',
    editTask: 'Editar Tarefa',
    updateTask: 'Atualizar Tarefa',
    taskTitle: 'Título da Tarefa',
    titlePlaceholder: 'O que precisa ser feito?',
    description: 'Descrição',
    descriptionPlaceholder: 'Adicione mais detalhes...',
    status: 'Status',
    addToColumn: 'Adicionar à Coluna',
    priority: 'Prioridade',
    noPriority: 'Sem Prioridade',
    low: 'P3 - Baixa',
    medium: 'P2 - Média',
    high: 'P1 - Alta',
    critical: 'Crítica',
    dueDate: 'Data de Vencimento',
    dueTime: 'Horário (Opcional)',
    recurrence: 'Recorrência',
    oneTime: 'Uma vez',
    daily: 'Diária',
    weekly: 'Semanal',
    monthly: 'Mensal',
    repeatOn: 'Repetir em',
    tags: 'Tags',
    addTag: 'Adicionar tag...',
    add: 'Adicionar',
    labels: 'Etiquetas',
    addLabel: 'Adicionar etiqueta...',
    cancel: 'Cancelar',
    save: 'Salvar',
    saving: 'Salvando...',
    delete: 'Excluir'
  },
  
  // Quick Add
  quickAdd: {
    quickAdd: 'Adição Rápida',
    customize: 'Personalizar'
  },
  
  // Colors for labels
  colors: {
    green: 'Verde',
    yellow: 'Amarelo',
    red: 'Vermelho',
    blue: 'Azul',
    purple: 'Roxo',
    orange: 'Laranja',
    gray: 'Cinza',
    pink: 'Rosa'
  },
  
  // Messages
  messages: {
    taskTitleRequired: 'Título da tarefa é obrigatório',
    taskCreated: 'Tarefa criada com sucesso',
    taskUpdated: 'Tarefa atualizada com sucesso',
    taskDeleted: 'Tarefa excluída com sucesso',
    failedToSave: 'Falha ao salvar tarefa',
    error: 'Erro',
    success: 'Sucesso'
  },
  
  // Weekdays
  weekdays: {
    sun: 'Dom',
    mon: 'Seg',
    tue: 'Ter',
    wed: 'Qua',
    thu: 'Qui',
    fri: 'Sex',
    sat: 'Sáb'
  }
};

export const colorOptions = [
  { id: 'green', name: pt.colors.green, value: '#22c55e', bg: 'bg-green-500', text: 'text-white' },
  { id: 'yellow', name: pt.colors.yellow, value: '#eab308', bg: 'bg-yellow-500', text: 'text-black' },
  { id: 'red', name: pt.colors.red, value: '#ef4444', bg: 'bg-red-500', text: 'text-white' },
  { id: 'blue', name: pt.colors.blue, value: '#3b82f6', bg: 'bg-blue-500', text: 'text-white' },
  { id: 'purple', name: pt.colors.purple, value: '#a855f7', bg: 'bg-purple-500', text: 'text-white' },
  { id: 'orange', name: pt.colors.orange, value: '#f97316', bg: 'bg-orange-500', text: 'text-white' },
  { id: 'gray', name: pt.colors.gray, value: '#6b7280', bg: 'bg-gray-500', text: 'text-white' },
  { id: 'pink', name: pt.colors.pink, value: '#ec4899', bg: 'bg-pink-500', text: 'text-white' }
];
