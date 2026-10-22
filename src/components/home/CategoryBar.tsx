"use client";

import React, { useState, useEffect } from 'react';
import { 
  Smartphone, Laptop, Shirt, Home, Watch, Car, Gift, Zap, Tv, 
  Footprints, HeartPulse, Baby, Armchair, Hammer, Trophy, Pill, 
  Utensils, Dog, PenTool, Book, Gem, ChevronRight, Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { supabase } from '@/integrations/supabase/client';

const mainCategories = [
  { 
    name: 'Телефоны и гаджеты', 
    icon: Smartphone, 
    color: 'bg-blue-100 text-blue-600',
    subs: ['Смартфоны', 'Планшеты', 'Смарт-часы', 'Наушники', 'Power Bank', 'Чехлы']
  },
  { 
    name: 'Компьютеры', 
    icon: Laptop, 
    color: 'bg-purple-100 text-purple-600',
    subs: ['Ноутбуки', 'Мониторы', 'Игровые ПК', 'Клавиатуры', 'Мыши', 'Принтеры']
  },
  { 
    name: 'Бытовая техника', 
    icon: Tv, 
    color: 'bg-indigo-100 text-indigo-600',
    subs: ['Холодильники', 'Стиральные машины', 'Пылесосы', 'Кондиционеры', 'Плиты', 'Микроволновые печи', 'Электрочайники']
  },
  { 
    name: 'Одежда', 
    icon: Shirt, 
    color: 'bg-pink-100 text-pink-600',
    subs: ['Мужская одежда', 'Женская одежда', 'Детская одежда', 'Верхняя одежда', 'Спортивная одежда']
  },
  { 
    name: 'Обувь', 
    icon: Footprints, 
    color: 'bg-amber-100 text-amber-600',
    subs: ['Мужская обувь', 'Женская обувь', 'Детская обувь', 'Кроссовки', 'Ботинки']
  },
  { 
    name: 'Аксессуары', 
    icon: Watch, 
    color: 'bg-orange-100 text-orange-600',
    subs: ['Сумки и рюкзаки', 'Кошельки', 'Ремни', 'Очки', 'Зонты']
  },
  { 
    name: 'Красота и здоровье', 
    icon: HeartPulse, 
    color: 'bg-rose-100 text-rose-600',
    subs: ['Парфюмерия', 'Уход за кожей', 'Декоративная косметика', 'Фены и стайлеры', 'Электробритвы']
  },
  { 
    name: 'Детские товары', 
    icon: Baby, 
    color: 'bg-cyan-100 text-cyan-600',
    subs: ['Игрушки', 'Коляски', 'Детское питание', 'Подгузники', 'Товары для школы']
  },
  { 
    name: 'Дом и сад', 
    icon: Home, 
    color: 'bg-green-100 text-green-600',
    subs: ['Посуда', 'Текстиль', 'Освещение', 'Садовая техника', 'Декор']
  },
  { 
    name: 'Мебель', 
    icon: Armchair, 
    color: 'bg-amber-100 text-amber-900',
    subs: ['Диваны', 'Шкафы', 'Столы и стулья', 'Кровати', 'Офисная мебель']
  },
  { 
    name: 'Строительство и ремонт', 
    icon: Hammer, 
    color: 'bg-zinc-100 text-zinc-600',
    subs: ['Инструменты', 'Сантехника', 'Электрика', 'Отделочные материалы', 'Межкомнатные двери', 'Междукомнатные двери']
  },
  { 
    name: 'Автотовары', 
    icon: Car, 
    color: 'bg-slate-100 text-slate-600',
    subs: ['Шины', 'Видеорегистраторы', 'Автохимия', 'Аккумуляторы', 'Запчасти']
  },
  { 
    name: 'Спорт и туризм', 
    icon: Trophy, 
    color: 'bg-emerald-100 text-emerald-600',
    subs: ['Тренажеры', 'Велосипеды', 'Палатки', 'Спортивное питание', 'Самокаты']
  },
  { 
    name: 'Аптека', 
    icon: Pill, 
    color: 'bg-red-100 text-red-600',
    subs: ['Витамины', 'Медицинские приборы', 'Гигиена', 'Оптика']
  },
  { 
    name: 'Продукты питания', 
    icon: Utensils, 
    color: 'bg-lime-100 text-lime-600',
    subs: ['Напитки', 'Сладости', 'Бакалея', 'Чай и кофе']
  },
  { 
    name: 'Товары для животных', 
    icon: Dog, 
    color: 'bg-yellow-100 text-yellow-700',
    subs: ['Корм', 'Аксессуары для животных', 'Игрушки для животных']
  },
  { 
    name: 'Канцелярские товары', 
    icon: PenTool, 
    color: 'bg-violet-100 text-violet-600',
    subs: ['Бумага', 'Письменные принадлежности', 'Офисные мелочи']
  },
  { 
    name: 'Досуг и книги', 
    icon: Book, 
    color: 'bg-sky-100 text-sky-600',
    subs: ['Художественная литература', 'Настольные игры', 'Музыкальные инструменты', 'Творчество']
  },
  { 
    name: 'Подарки и праздники', 
    icon: Gift, 
    color: 'bg-red-100 text-red-600',
    subs: ['Сувениры', 'Упаковка', 'Воздушные шары', 'Открытки']
  },
  { 
    name: 'Украшения', 
    icon: Gem, 
    color: 'bg-teal-100 text-teal-600',
    subs: ['Ювелирные изделия', 'Бижутерия', 'Часы']
  },
  { 
    name: 'Акции', 
    icon: Zap, 
    color: 'bg-yellow-100 text-yellow-600',
    subs: ['Распродажа', 'Хиты недели', 'Ликвидация', 'Бонусы']
  },
];

const CategoryBar = () => {
  const navigate = useNavigate();
  const [activeCategoryNames, setActiveCategoryNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveCategories = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('category');
      
      if (!error && data) {
        const uniqueCategories = Array.from(new Set(data.map(p => p.category).filter(Boolean)));
        setActiveCategoryNames(uniqueCategories as string[]);
      }
      setLoading(false);
    };

    fetchActiveCategories();

    const channel = supabase
      .channel('category-bar-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        fetchActiveCategories();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleNavigate = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const filteredCategories = mainCategories.filter(cat => {
    if (cat.name === 'Акции') return true;

    const hasMainCategory = activeCategoryNames.some(active => 
      active.toLowerCase() === cat.name.toLowerCase()
    );
    
    const hasSubCategory = cat.subs.some(sub => 
      activeCategoryNames.some(active => active.toLowerCase() === sub.toLowerCase())
    );

    return hasMainCategory || hasSubCategory;
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary/20" />
      </div>
    );
  }

  if (filteredCategories.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-8 overflow-x-auto no-scrollbar">
      <div className="flex justify-start sm:justify-center gap-6 min-w-max pb-2">
        {filteredCategories.map((cat, idx) => (
          <Popover key={cat.name}>
            <PopoverTrigger asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.03 }}
                className="flex flex-col items-center gap-3 cursor-pointer group"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1 ${cat.color}`}>
                  <cat.icon className="h-8 w-8" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors text-center max-w-[80px] leading-tight">
                  {cat.name}
                </span>
              </motion.div>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2 rounded-2xl shadow-2xl border-primary/10" align="center">
              <div className="flex flex-col gap-1">
                {cat.subs
                  .filter(sub => activeCategoryNames.some(active => active.toLowerCase() === sub.toLowerCase()))
                  .map((sub) => (
                    <button
                      key={sub}
                      onClick={() => handleNavigate(sub)}
                      className="text-left px-3 py-2 text-sm hover:bg-muted rounded-xl transition-colors flex items-center justify-between group/item"
                    >
                      {sub}
                      <ChevronRight className="h-3 w-3 opacity-0 group-hover/item:opacity-100 transition-opacity text-muted-foreground" />
                    </button>
                  ))}
              </div>
            </PopoverContent>
          </Popover>
        ))}
      </div>
    </section>
  );
};

export default CategoryBar;