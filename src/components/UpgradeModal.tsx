
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Lock, Zap } from 'lucide-react';
import { usePlan } from '@/contexts/PlanContext';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string;
  description?: string;
}

export const UpgradeModal = ({ 
  isOpen, 
  onClose, 
  feature = "recurso premium",
  description = "Para acessar este recurso, você precisa fazer upgrade para o plano Premium."
}: UpgradeModalProps) => {
  const { upgradeUser } = usePlan();

  const handleUpgrade = () => {
    upgradeUser();
    onClose();
    // TODO: Redirect to payment flow
  };

  const premiumFeatures = [
    "Quadros e tarefas ilimitados",
    "Integração completa com WhatsApp",
    "Sincronização com Google Calendar",
    "Filtros e etiquetas avançadas",
    "Suporte prioritário",
    "Acesso antecipado a novos recursos"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Lock className="w-5 h-5 text-primary" />
            </div>
            <Badge variant="secondary" className="premium-gradient text-white">
              Premium
            </Badge>
          </div>
          <DialogTitle className="text-xl">
            Upgrade para acessar {feature}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gradient-to-br from-primary/5 to-purple-500/5 p-4 rounded-lg border">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              Recursos Premium
            </h3>
            <ul className="space-y-2">
              {premiumFeatures.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleUpgrade} className="flex-1 premium-gradient">
              <Zap className="w-4 h-4 mr-2" />
              Fazer Upgrade
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
