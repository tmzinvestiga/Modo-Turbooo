
import React from 'react';
import { UserStats } from '@/types/Task';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, Target, Zap } from 'lucide-react';

interface UserStatsCardProps {
  stats: UserStats;
}

export const UserStatsCard = ({ stats }: UserStatsCardProps) => {
  const progressToNextLevel = ((stats.totalPoints % 50) / 50) * 100;
  const pointsToNextLevel = 50 - (stats.totalPoints % 50);

  return (
    <Card className="bg-gradient-to-br from-blue-600 to-purple-600 border-0 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Trophy className="w-5 h-5" />
          Level {stats.level}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            <span className="text-sm">Total Points</span>
          </div>
          <span className="font-bold">{stats.totalPoints}</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress to Level {stats.level + 1}</span>
            <span>{pointsToNextLevel} points to go</span>
          </div>
          <Progress value={progressToNextLevel} className="h-2" />
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span className="text-sm">Completed Tasks</span>
          </div>
          <span className="font-bold">{stats.completedTasks}</span>
        </div>
      </CardContent>
    </Card>
  );
};
