
import React from 'react';
import { Home, Calendar, BarChart3, Settings, LogOut, FileText } from 'lucide-react';
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
  { title: 'Templates', icon: FileText, url: '/templates' },
  { title: 'Calendário', icon: Calendar, url: '/calendar' },
  { title: 'Performance', icon: BarChart3, url: '/performance' },
  { title: 'Configurações', icon: Settings, url: '/settings' },
];

interface SidebarProps {
  onClose?: () => void;
}

export const Sidebar = ({ onClose }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Logout realizado com sucesso!');
    navigate('/');
  };

  const handleNavigation = () => {
    // Close sidebar on mobile after navigation
    if (onClose && window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <SidebarUI className="border-r border-sidebar-border bg-sidebar w-64">
      <SidebarHeader className="p-6">
        {user && (
          <div className="p-3 bg-sidebar-accent rounded-lg">
            <p className="text-sm text-sidebar-foreground/70">Bem-vindo,</p>
            <p className="font-medium text-sidebar-foreground">{user.name}</p>
          </div>
        )}
      </SidebarHeader>
      
      <SidebarContent className="px-4">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                className={`w-full text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent transition-all duration-200 ${
                  location.pathname === item.url 
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm' 
                    : ''
                }`}
              >
                <Link 
                  to={item.url} 
                  className="flex items-center gap-3 px-3 py-2"
                  onClick={handleNavigation}
                >
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
              className="w-full text-sidebar-foreground hover:text-white hover:bg-red-600 cursor-pointer transition-all duration-200"
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
