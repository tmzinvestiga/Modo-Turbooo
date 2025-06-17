
import React from 'react';
import { Home, Calendar, Settings, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar as SidebarUI,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from '@/components/ui/sidebar';

const menuItems = [
  { title: 'Home', icon: Home, url: '/' },
  { title: 'Calendar', icon: Calendar, url: '/calendar' },
  { title: 'Performance', icon: Settings, url: '/performance' },
  { title: 'Settings', icon: Settings, url: '/settings' },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <SidebarUI className="border-r border-gray-700 bg-gray-800">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">PT</span>
          </div>
          <h1 className="text-xl font-bold text-white">ProductiveTask</h1>
        </div>
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
            <SidebarMenuButton className="w-full text-gray-300 hover:text-white hover:bg-gray-700">
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </SidebarUI>
  );
};
