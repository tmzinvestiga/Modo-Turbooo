
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTaskStore } from '@/hooks/useTaskStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { format, subDays, isSameDay, startOfWeek, endOfWeek } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { toast } from '@/hooks/use-toast';

export const Performance = () => {
  const { tasks, userStats } = useTaskStore();

  const getLast7DaysData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const completedTasks = tasks.filter(task => 
        task.status === 'done' && 
        task.completedAt && 
        isSameDay(task.completedAt, date)
      ).length;
      
      const totalTasks = tasks.filter(task => 
        task.createdAt && 
        isSameDay(task.createdAt, date)
      ).length;
      
      data.push({
        date: format(date, 'EEE'),
        completed: completedTasks,
        total: totalTasks,
        efficiency: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      });
    }
    return data;
  };

  const getWeeklyStats = () => {
    const weekStart = startOfWeek(new Date());
    const weekEnd = endOfWeek(new Date());
    
    const weekTasks = tasks.filter(task => 
      task.createdAt && 
      task.createdAt >= weekStart && 
      task.createdAt <= weekEnd
    );
    
    const completedThisWeek = weekTasks.filter(task => task.status === 'done').length;
    
    return {
      completed: completedThisWeek,
      total: weekTasks.length,
      efficiency: weekTasks.length > 0 ? Math.round((completedThisWeek / weekTasks.length) * 100) : 0
    };
  };

  const getCurrentStreak = () => {
    let streak = 0;
    let currentDate = new Date();
    
    while (true) {
      const dayTasks = tasks.filter(task => 
        task.status === 'done' && 
        task.completedAt && 
        isSameDay(task.completedAt, currentDate)
      );
      
      if (dayTasks.length > 0) {
        streak++;
        currentDate = subDays(currentDate, 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  const chartData = getLast7DaysData();
  const weeklyStats = getWeeklyStats();
  const currentStreak = getCurrentStreak();

  const handleShare = () => {
    const shareText = `🎯 My productivity stats:\n📊 Level ${userStats.level}\n⭐ ${userStats.totalPoints} total points\n✅ ${userStats.completedTasks} completed tasks\n🔥 ${currentStreak} day streak\n\nStay productive with Modo Turbo!`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Productivity Stats',
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        title: "Stats copied!",
        description: "Your productivity stats have been copied to clipboard.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-white" />
            <div>
              <h1 className="text-2xl font-bold text-white">Performance Dashboard</h1>
              <p className="text-gray-400">Track your productivity journey</p>
            </div>
          </div>
          <Button onClick={handleShare} className="bg-blue-600 hover:bg-blue-700">
            <Share2 className="w-4 h-4 mr-2" />
            Share Performance
          </Button>
        </div>
      </header>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400">Weekly Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">{weeklyStats.completed}</div>
              <p className="text-sm text-gray-400">out of {weeklyStats.total} tasks</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400">Current Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-400">🔥 {currentStreak}</div>
              <p className="text-sm text-gray-400">days in a row</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400">Efficiency Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-400">{weeklyStats.efficiency}%</div>
              <p className="text-sm text-gray-400">completion rate</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Tasks Completed (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#374151', 
                        border: '1px solid #6B7280',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }} 
                    />
                    <Bar dataKey="completed" fill="#10B981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="total" fill="#6B7280" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Efficiency Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#374151', 
                        border: '1px solid #6B7280',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                      formatter={(value) => [`${value}%`, 'Efficiency']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="efficiency" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8, stroke: '#3B82F6', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400">Current Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{userStats.level}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400">Total Points</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{userStats.totalPoints}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400">Total Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{userStats.completedTasks}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400">This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {chartData.reduce((sum, day) => sum + day.completed, 0)}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
