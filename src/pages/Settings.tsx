
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from '@/hooks/use-toast';
import { Palette, Sun, Moon } from 'lucide-react';

export const Settings = () => {
  const [userName, setUserName] = useState('');
  const [notificationTime, setNotificationTime] = useState('18:00');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [apiKey, setApiKey] = useState('');
  const { theme, setTheme } = useTheme();

  const handleSaveProfile = () => {
    localStorage.setItem('user-profile', JSON.stringify({ userName }));
    toast({
      title: "Profile saved!",
      description: "Your profile settings have been updated.",
    });
  };

  const handleSaveNotifications = () => {
    localStorage.setItem('notification-settings', JSON.stringify({ notificationTime }));
    toast({
      title: "Notification settings saved!",
      description: `Daily reminders set for ${notificationTime}.`,
    });
  };

  const handleSaveWhatsApp = () => {
    localStorage.setItem('whatsapp-settings', JSON.stringify({ whatsappNumber, apiKey }));
    toast({
      title: "WhatsApp settings saved!",
      description: "API integration settings have been saved for future use.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border p-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground">Configure your productivity platform</p>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Aparência
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-foreground">Tema</Label>
              <div className="flex items-center gap-4 mt-2">
                <Button
                  variant={theme === 'light' ? 'default' : 'outline'}
                  onClick={() => setTheme('light')}
                  className="flex items-center gap-2"
                >
                  <Sun className="h-4 w-4" />
                  Claro
                </Button>
                <Button
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  onClick={() => setTheme('dark')}
                  className="flex items-center gap-2"
                >
                  <Moon className="h-4 w-4" />
                  Escuro
                </Button>
                <ThemeToggle variant="outline" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your username"
              />
            </div>
            <Button onClick={handleSaveProfile}>
              Save Profile
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="notification-time">Daily Reminder Time</Label>
              <Select value={notificationTime} onValueChange={setNotificationTime}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="08:00">8:00 AM</SelectItem>
                  <SelectItem value="12:00">12:00 PM</SelectItem>
                  <SelectItem value="18:00">6:00 PM</SelectItem>
                  <SelectItem value="20:00">8:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSaveNotifications}>
              Save Notification Settings
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>WhatsApp Integration (Future)</CardTitle>
            <p className="text-sm text-muted-foreground">
              Configure WhatsApp Business API for task creation and notifications. 
              These settings will be used when the integration is activated.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="whatsapp-number">WhatsApp Business Number</Label>
              <Input
                id="whatsapp-number"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="+1234567890"
              />
            </div>
            <div>
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your WhatsApp Business API key"
              />
            </div>
            <Button onClick={handleSaveWhatsApp}>
              Save WhatsApp Settings
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Developer Settings (Future)</CardTitle>
            <p className="text-sm text-muted-foreground">
              API endpoints and integration settings for external services.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-muted-foreground text-sm">
              <p>• Reward System API: Configure external partner integrations</p>
              <p>• Database Sync: Set up Firebase or external database connections</p>
              <p>• Notification Service: Configure external scheduling services</p>
              <p>• Analytics API: Connect with external analytics platforms</p>
            </div>
            <Button disabled>
              Available in Future Updates
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
