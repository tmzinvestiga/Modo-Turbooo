
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Crown, Zap } from 'lucide-react';
import { usePlan } from '@/contexts/PlanContext';

export const PlanBadge = () => {
  const { currentPlan, isPremium } = usePlan();

  if (isPremium) {
    return (
      <Badge className="premium-gradient text-white">
        <Crown className="w-3 h-3 mr-1" />
        Premium
      </Badge>
    );
  }

  return (
    <Badge variant="secondary">
      <Zap className="w-3 h-3 mr-1" />
      Grátis
    </Badge>
  );
};
