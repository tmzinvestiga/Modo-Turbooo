
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Task } from '@/types/Task';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTaskStore } from '@/hooks/useTaskStore';
import { Plus, Clock, CheckCircle, Circle, PlayCircle } from 'lucide-react';

interface DayTasksDialogProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date | null;
  tasks: Task[];
}

export const DayTasksDialog = ({ isOpen, onClose, date, tasks }: DayTasksDialogProps) => {
  const { updateTask } = useTaskStore();

  if (!date) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'todo': return <Circle className="w-4 h-4 text-blue-500" />;
      case 'doing': return <PlayCircle className="w-4 h-4 text-yellow-500" />;
      case 'done': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Circle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-blue-600';
      case 'doing': return 'bg-yellow-600';
      case 'done': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  const handleStatusChange = (taskId: string, newStatus: 'todo' | 'doing' | 'done') => {
    updateTask(taskId, { status: newStatus });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Tarefas para {format(date, "dd 'de' MMMM 'de' yyyy")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma tarefa para este dia</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 flex-1">
                    {getStatusIcon(task.status)}
                    <h3 className="font-medium text-white">{task.title}</h3>
                  </div>
                  <Badge 
                    className={`${getStatusColor(task.status)} text-white`}
                  >
                    {task.status === 'todo' ? 'A Fazer' : 
                     task.status === 'doing' ? 'Fazendo' : 'Concluído'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                  <div className="flex items-center gap-4">
                    <span>Recorrência: {
                      task.recurrence === 'none' ? 'Uma vez' :
                      task.recurrence === 'daily' ? 'Diário' : 
                      task.recurrence === 'weekly' ? 'Semanal' :
                      task.recurrence === 'monthly' ? 'Mensal' : 'Personalizada'
                    }</span>
                    <span>Pontos: {task.points}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={task.status === 'todo' ? 'default' : 'outline'}
                    onClick={() => handleStatusChange(task.id, 'todo')}
                    className={task.status === 'todo' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                  >
                    A Fazer
                  </Button>
                  <Button
                    size="sm"
                    variant={task.status === 'doing' ? 'default' : 'outline'}
                    onClick={() => handleStatusChange(task.id, 'doing')}
                    className={task.status === 'doing' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
                  >
                    Fazendo
                  </Button>
                  <Button
                    size="sm"
                    variant={task.status === 'done' ? 'default' : 'outline'}
                    onClick={() => handleStatusChange(task.id, 'done')}
                    className={task.status === 'done' ? 'bg-green-600 hover:bg-green-700' : ''}
                  >
                    Concluído
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
