"use client";

import React from 'react';
import Header from '@/components/layout/Header';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Target, ShieldCheck, Globe, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  const stats = [
    { label: "Лет на рынке", value: "5+" },
    { label: "Довольных клиентов", value: "100к+" },
    { label: "Товаров в каталоге", value: "50к+" },
    { label: "Городов доставки", value: "20+" },
  ];

  const values = [
    {
      icon: Target,
      title: "Наша миссия",
      description: "Сделать качественные товары доступными для каждого жителя Казахстана, обеспечивая лучший сервис и быструю доставку."
    },
    {
      icon: ShieldCheck,
      title: "Надежность",
      description: "Мы работаем только с проверенными поставщиками и гарантируем оригинальность каждого товара в нашем магазине."
    },
    {
      icon: Users,
      title: "Клиентоориентированность",
      description: "Ваше удобство — наш приоритет. Мы постоянно улучшаем наш сервис, основываясь на ваших отзывах."
    },
    {
      icon: Globe,
      title: "Масштаб",
      description: "Мы стремимся стать лидером e-commerce в регионе, внедряя самые современные технологии и логистические решения."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden bg-slate-900 text-white">
          <div className="absolute inset-0 opacity-20">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=2071" 
              alt="Team" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-black mb-6"
            >
              Мы создаем будущее <br /> <span className="text-primary">онлайн-шопинга</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-slate-300 max-w-2xl mx-auto mb-10"
            >
              Makeshop — это не просто маркетплейс. Это команда профессионалов, влюбленных в свое дело и стремящихся сделать вашу жизнь проще.
            </motion.p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-muted/30 border-b">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-3xl md:text-4xl font-black text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black mb-4">Наши ценности</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Фундамент, на котором строится каждый аспект нашей работы</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => (
              <Card key={idx} className="border-none shadow-xl shadow-primary/5 rounded-[2rem] overflow-hidden hover:-translate-y-2 transition-transform duration-300">
                <CardContent className="pt-8">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                    <value.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{value.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="rounded-[3rem] overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2069" 
                  alt="Office" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-6">
                <h2 className="text-3xl font-black">История успеха</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Все началось в 2021 году с небольшой идеи: сделать процесс покупки электроники прозрачным и быстрым. Мы начинали как узкоспециализированный магазин, но благодаря доверию наших клиентов быстро выросли в полноценный маркетплейс.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Сегодня Makeshop — это тысячи заказов ежедневно, собственная логистическая сеть и команда из более чем 200 специалистов, работающих над тем, чтобы вы получали свои покупки вовремя.
                </p>
                <Button size="lg" className="rounded-full px-8 gap-2" onClick={() => navigate('/catalog')}>
                  Начать покупки <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">© 2024 Makeshop. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default About;