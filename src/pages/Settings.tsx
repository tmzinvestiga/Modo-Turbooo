
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { toast } from '@/hooks/use-toast';

export const Settings = () => {
  const [userName, setUserName] = useState('');
  const [notificationTime, setNotificationTime] = useState('18:00');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [apiKey, setApiKey] = useState('');

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
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-white" />
          <div>
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <p className="text-gray-400">Configure your productivity platform</p>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-2xl mx-auto space-y-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">User Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-gray-300">Username</Label>
              <Input
                id="username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Enter your username"
              />
            </div>
            <Button onClick={handleSaveProfile} className="bg-blue-600 hover:bg-blue-700">
              Save Profile
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Notification Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="notification-time" className="text-gray-300">Daily Reminder Time</Label>
              <Select value={notificationTime} onValueChange={setNotificationTime}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="08:00">8:00 AM</SelectItem>
                  <SelectItem value="12:00">12:00 PM</SelectItem>
                  <SelectItem value="18:00">6:00 PM</SelectItem>
                  <SelectItem value="20:00">8:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSaveNotifications} className="bg-blue-600 hover:bg-blue-700">
              Save Notification Settings
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">WhatsApp Integration (Future)</CardTitle>
            <p className="text-sm text-gray-400">
              Configure WhatsApp Business API for task creation and notifications. 
              These settings will be used when the integration is activated.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="whatsapp-number" className="text-gray-300">WhatsApp Business Number</Label>
              <Input
                id="whatsapp-number"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="+1234567890"
              />
            </div>
            <div>
              <Label htmlFor="api-key" className="text-gray-300">API Key</Label>
              <Input
                id="api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Enter your WhatsApp Business API key"
              />
            </div>
            <Button onClick={handleSaveWhatsApp} className="bg-blue-600 hover:bg-blue-700">
              Save WhatsApp Settings
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Developer Settings (Future)</CardTitle>
            <p className="text-sm text-gray-400">
              API endpoints and integration settings for external services.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-gray-400 text-sm">
              <p>• Reward System API: Configure external partner integrations</p>
              <p>• Database Sync: Set up Firebase or external database connections</p>
              <p>• Notification Service: Configure external scheduling services</p>
              <p>• Analytics API: Connect with external analytics platforms</p>
            </div>
            <Button disabled className="bg-gray-600">
              Available in Future Updates
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
