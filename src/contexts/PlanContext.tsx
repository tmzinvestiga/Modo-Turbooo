
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserPlan = 'free' | 'premium';

interface PlanContextType {
  currentPlan: UserPlan;
  upgradeUser: () => void;
  downgradeUser: () => void;
  isPremium: boolean;
  isFree: boolean;
  // Feature limits for free plan
  limits: {
    maxBoards: number;
    maxTasksPerBoard: number;
    whatsappTasksPerWeek: number;
    hasAdvancedFilters: boolean;
    hasGoogleCalendarSync: boolean;
    hasPrioritySupport: boolean;
  };
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export const usePlan = () => {
  const context = useContext(PlanContext);
  if (context === undefined) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
};

interface PlanProviderProps {
  children: ReactNode;
}

export const PlanProvider = ({ children }: PlanProviderProps) => {
  const [currentPlan, setCurrentPlan] = useState<UserPlan>('free'); // Default to free

  const upgradeUser = () => {
    setCurrentPlan('premium');
    // TODO: Integrate with payment system
  };

  const downgradeUser = () => {
    setCurrentPlan('free');
    // TODO: Handle plan downgrade logic
  };

  const isPremium = currentPlan === 'premium';
  const isFree = currentPlan === 'free';

  const limits = {
    maxBoards: isFree ? 3 : Infinity,
    maxTasksPerBoard: isFree ? 30 : Infinity,
    whatsappTasksPerWeek: isFree ? 5 : Infinity,
    hasAdvancedFilters: isPremium,
    hasGoogleCalendarSync: isPremium,
    hasPrioritySupport: isPremium,
  };

  const value: PlanContextType = {
    currentPlan,
    upgradeUser,
    downgradeUser,
    isPremium,
    isFree,
    limits,
  };

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
};
