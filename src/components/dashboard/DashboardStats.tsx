
import React from 'react';
import { UserStatsCard } from '@/components/UserStatsCard';
import { UserStats } from '@/types/Task';

interface DashboardStatsProps {
  stats: UserStats;
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
  return (
    <div className="animate-fade-in">
      <UserStatsCard stats={stats} />
    </div>
  );
};
