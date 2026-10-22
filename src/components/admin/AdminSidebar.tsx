"use client";

import React from 'react';
import { LayoutDashboard, Package, Image as ImageIcon, ShoppingCart, Settings, LogOut, Home, MessageSquare } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Обзор', path: '/admin' },
    { icon: Package, label: 'Товары', path: '/admin/products' },
    { icon: ImageIcon, label: 'Баннеры', path: '/admin/banners' },
    { icon: ShoppingCart, label: 'Заказы', path: '/admin/orders' },
    { icon: MessageSquare, label: 'Отзывы', path: '/admin/reviews' },
  ];

  return (
    <aside className="w-64 bg-white border-r h-screen sticky top-0 flex flex-col">
      <div className="p-6 border-b">
        <div className="flex items-center gap-2 font-black text-primary text-xl">
          <Settings className="h-6 w-6" />
          ADMIN PANEL
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all",
                isActive 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t space-y-2">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 rounded-xl"
          onClick={() => navigate('/')}
        >
          <Home className="h-5 w-5" /> На сайт
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => signOut()}
        >
          <LogOut className="h-5 w-5" /> Выйти
        </Button>
      </div>
    </aside>
  );
};

export default AdminSidebar;