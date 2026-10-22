"use client";

import React from 'react';
import { Home, Search, ShoppingCart, Heart, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

const MobileNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useCart();

  const navItems = [
    { icon: Home, label: 'Главная', path: '/' },
    { icon: Search, label: 'Каталог', path: '/catalog' },
    { icon: ShoppingCart, label: 'Корзина', path: '/cart', badge: cartCount },
    { icon: Heart, label: 'Избранное', path: '/wishlist' },
    { icon: User, label: 'Профиль', path: '/profile' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors relative",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "fill-current")} />
              <span className="text-[10px] font-medium">{item.label}</span>
              {item.badge ? (
                <span className="absolute top-2 right-1/2 translate-x-4 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-background">
                  {item.badge}
                </span>
              ) : null}
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-b-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;