import React from 'react';
import { Home, Calendar, BarChart3, Settings, LogOut, Zap } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Sidebar as SidebarUI,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { toast } from 'sonner';

const menuItems = [
  { title: 'Dashboard', icon: Home, url: '/dashboard' },
  { title: 'Calendário', icon: Calendar, url: '/calendar' },
  { title: 'Performance', icon: BarChart3, url: '/performance' },
  { title: 'Configurações', icon: Settings, url: '/settings' },
];

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Logout realizado com sucesso!');
    navigate('/');
  };

  return (
    <SidebarUI className="border-r border-gray-700 bg-gray-900">
      <SidebarHeader className="p-6">
        <div className="flex items-center space-x-2">
          <Zap className="h-6 w-6 text-blue-400" />
          <h1 className="text-xl font-bold text-white">MODO TURBO</h1>
        </div>
        {user && (
          <div className="mt-4 p-3 bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-300">Bem-vindo,</p>
            <p className="font-medium text-white">{user.name}</p>
          </div>
        )}
      </SidebarHeader>
      
      <SidebarContent className="px-4">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                className={`w-full text-gray-300 hover:text-white hover:bg-gray-700 ${
                  location.pathname === item.url ? 'bg-blue-600 text-white' : ''
                }`}
              >
                <Link to={item.url} className="flex items-center gap-3 px-3 py-2">
                  <item.icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleLogout}
              className="w-full text-gray-300 hover:text-white hover:bg-red-600 cursor-pointer"
            >
              <LogOut className="w-5 h-5" />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </SidebarUI>
  );
};

