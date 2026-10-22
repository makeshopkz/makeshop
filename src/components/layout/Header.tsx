"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, ShoppingCart, User, Heart, Menu, Globe, Moon, Sun, 
  Laptop, Shirt, Home, HeartPulse, Trophy, LogOut,
  Car, Watch, Pill, Baby, Book, PenTool, Armchair, 
  Footprints, Gift, Utensils, Hammer, Tv, Smartphone, 
  Dog, Gem, ShoppingBag
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from "next-themes";
import { supabase } from '@/integrations/supabase/client';
import logo from '@/img/Makeshop.png';

const Header = () => {
  const isMobile = useIsMobile();
  const { theme, setTheme } = useTheme();
  const { cartCount, wishlist } = useCart();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategories, setActiveCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchActiveCategories = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('category');
      
      if (!error && data) {
        const uniqueCategories = Array.from(new Set(data.map(p => p.category).filter(Boolean)));
        setActiveCategories(uniqueCategories as string[]);
      }
    };

    fetchActiveCategories();
    
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        fetchActiveCategories();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const knownCategories = [
    { name: 'Телефоны и гаджеты', icon: <Smartphone className="h-4 w-4 mr-2" /> },
    { name: 'Компьютеры', icon: <Laptop className="h-4 w-4 mr-2" /> },
    { name: 'Бытовая техника', icon: <Tv className="h-4 w-4 mr-2" /> },
    { name: 'Одежда', icon: <Shirt className="h-4 w-4 mr-2" /> },
    { name: 'Обувь', icon: <Footprints className="h-4 w-4 mr-2" /> },
    { name: 'Аксессуары', icon: <Watch className="h-4 w-4 mr-2" /> },
    { name: 'Красота и здоровье', icon: <HeartPulse className="h-4 w-4 mr-2" /> },
    { name: 'Детские товары', icon: <Baby className="h-4 w-4 mr-2" /> },
    { name: 'Дом и сад', icon: <Home className="h-4 w-4 mr-2" /> },
    { name: 'Мебель', icon: <Armchair className="h-4 w-4 mr-2" /> },
    { name: 'Строительство и ремонт', icon: <Hammer className="h-4 w-4 mr-2" /> },
    { name: 'Автотовары', icon: <Car className="h-4 w-4 mr-2" /> },
    { name: 'Спорт и туризм', icon: <Trophy className="h-4 w-4 mr-2" /> },
    { name: 'Аптека', icon: <Pill className="h-4 w-4 mr-2" /> },
    { name: 'Продукты питания', icon: <Utensils className="h-4 w-4 mr-2" /> },
    { name: 'Товары для животных', icon: <Dog className="h-4 w-4 mr-2" /> },
    { name: 'Канцелярские товары', icon: <PenTool className="h-4 w-4 mr-2" /> },
    { name: 'Досуг и книги', icon: <Book className="h-4 w-4 mr-2" /> },
    { name: 'Подарки и праздники', icon: <Gift className="h-4 w-4 mr-2" /> },
    { name: 'Украшения', icon: <Gem className="h-4 w-4 mr-2" /> },
  ];

  const displayCategories = activeCategories.map(catName => {
    const known = knownCategories.find(k => 
      k.name.toLowerCase() === catName.toLowerCase() || 
      catName.toLowerCase().includes(k.name.toLowerCase()) ||
      k.name.toLowerCase().includes(catName.toLowerCase())
    );
    
    return {
      name: catName,
      icon: known ? known.icon : <ShoppingBag className="h-4 w-4 mr-2" />
    };
  });

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-white">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="text-primary hover:bg-primary/5 w-12 h-12"
              >
                <Menu className="h-8 w-8" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64 max-h-[80vh] overflow-y-auto rounded-2xl p-2">
              <div className="px-2 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground opacity-70">Каталог товаров</div>
              <DropdownMenuSeparator />
              {displayCategories.length > 0 ? (
                displayCategories.map((cat) => (
                  <DropdownMenuItem 
                    key={cat.name} 
                    className="cursor-pointer py-3 rounded-xl focus:bg-primary/5 focus:text-primary transition-colors"
                    onClick={() => navigate(`/search?q=${encodeURIComponent(cat.name)}`)}
                  >
                    <span className="text-primary/70">{cat.icon}</span>
                    <span className="font-medium">{cat.name}</span>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                  Категории появятся после добавления товаров
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <a href="/" className="flex items-center shrink-0">
            <img 
              src={logo} 
              alt="Makeshop" 
              className="h-20 sm:h-20 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  parent.innerHTML = '<span class="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-red-900 bg-clip-text text-transparent">MAKESHOP</span>';
                }
              }}
            />
          </a>
        </div>

        {!isMobile && (
          <form onSubmit={handleSearch} className="flex-1 max-w-xl relative">
            <Input 
              placeholder="Поиск товаров, брендов и категорий..." 
              className="w-full pl-10 h-12 rounded-full bg-muted/50 border-none focus-visible:ring-2 focus-visible:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </form>
        )}

        <div className="flex items-center gap-1 sm:gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Русский</DropdownMenuItem>
              <DropdownMenuItem>Қазақша</DropdownMenuItem>
              <DropdownMenuItem>English</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full relative hidden sm:flex"
            onClick={() => navigate('/wishlist')}
          >
            <Heart className={`h-5 w-5 ${wishlist.length > 0 ? 'fill-primary text-primary' : ''}`} />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 bg-primary text-[10px] text-white w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full relative hidden sm:flex"
            onClick={() => navigate('/cart')}
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 bg-primary text-[10px] text-white w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full border border-primary/20">
                  <User className="h-5 w-5 text-primary" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate('/profile')}>Профиль</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/wishlist')}>Избранное</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={() => signOut()}>
                  <LogOut className="h-4 w-4 mr-2" /> Выйти
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            !isMobile ? (
              <Button 
                variant="outline"
                className="rounded-full gap-2 h-10 sm:h-12 px-6 border-primary text-primary hover:bg-primary/5 bg-white font-bold" 
                onClick={() => navigate('/auth')}
              >
                <User className="h-5 w-5" />
                Войти
              </Button>
            ) : (
              <Button variant="ghost" size="icon" className="rounded-full" onClick={() => navigate('/auth')}>
                <User className="h-5 w-5" />
              </Button>
            )
          )}
        </div>
      </div>
      {isMobile && (
        <div className="px-4 pb-3">
          <form onSubmit={handleSearch} className="relative">
            <Input 
              placeholder="Поиск..." 
              className="w-full pl-10 h-10 rounded-full bg-muted/50 border-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </form>
        </div>
      )}
    </header>
  );
};

export default Header;