
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Link, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const GoogleCalendarIntegration = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleConnect = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      // Simulate API call - In a real app, this would use Google Calendar API
      // For now, we'll just simulate the connection process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demonstration, we'll just toggle the connected state
      setIsConnected(true);
      console.log('Google Calendar integration initiated');
    } catch (err) {
      setError('Falha ao conectar com o Google Calendar. Tente novamente.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setError(null);
    console.log('Google Calendar disconnected');
  };

  if (isConnected) {
    return (
      <Card className="bg-gray-800 border-gray-700 mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <CardTitle className="text-white">Google Calendar Conectado</CardTitle>
          </div>
          <CardDescription className="text-gray-400">
            Suas tarefas estão sincronizadas com o Google Calendar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleDisconnect}
              className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
            >
              Desconectar
            </Button>
            <Button
              variant="ghost"
              className="text-gray-400 hover:text-white hover:bg-gray-700"
            >
              Configurações de Sincronização
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800 border-gray-700 mb-6">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-blue-500" />
          <CardTitle className="text-white">Integração com Google Calendar</CardTitle>
        </div>
        <CardDescription className="text-gray-400">
          Conecte seu Google Calendar para sincronizar suas tarefas automaticamente
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="flex items-center gap-2 text-red-400 mb-4 p-3 bg-red-900/20 rounded-lg border border-red-800">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}
        
        <div className="space-y-4">
          <div className="text-sm text-gray-300">
            <p className="mb-2">Benefícios da integração:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
              <li>Sincronização automática de tarefas</li>
              <li>Visualização unificada de compromissos</li>
              <li>Notificações em tempo real</li>
              <li>Acesso multiplataforma</li>
            </ul>
          </div>
          
          <Button
            onClick={handleGoogleConnect}
            disabled={isConnecting}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Link className="w-4 h-4 mr-2" />
            {isConnecting ? 'Conectando...' : 'Conectar ao Google'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
