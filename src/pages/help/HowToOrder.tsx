"use client";

import React from 'react';
import Header from '@/components/layout/Header';
import { Button } from "@/components/ui/button";
import { ShoppingBag, Search, CreditCard, Truck, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HowToOrder = () => {
  const navigate = useNavigate();

  const steps = [
    {
      icon: Search,
      title: "Найдите нужный товар",
      description: "Воспользуйтесь поиском или каталогом, чтобы найти интересующий вас товар. Используйте фильтры для быстрого подбора."
    },
    {
      icon: ShoppingBag,
      title: "Добавьте в корзину",
      description: "Выберите нужные параметры (размер, цвет) и нажмите кнопку «В корзину». Вы можете продолжить покупки или перейти к оформлению."
    },
    {
      icon: CreditCard,
      title: "Оформите заказ",
      description: "Перейдите в корзину, проверьте список товаров и нажмите «Оформить заказ». Укажите контактные данные и адрес доставки."
    },
    {
      icon: Truck,
      title: "Выберите способ доставки",
      description: "Выберите удобный способ получения: курьером до двери или самовывоз из пункта выдачи."
    },
    {
      icon: CheckCircle2,
      title: "Подтвердите и оплатите",
      description: "Выберите способ оплаты и завершите оформление. После этого вы получите подтверждение на email или по SMS."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-black mb-8">Как сделать заказ</h1>
        
        <div className="space-y-12">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-6 items-start">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                <step.icon className="h-8 w-8" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-primary font-black text-xl">0{index + 1}.</span>
                  <h2 className="text-2xl font-bold">{step.title}</h2>
                </div>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 p-8 bg-muted/30 rounded-[2.5rem] border text-center">
          <h3 className="text-2xl font-bold mb-4">Остались вопросы?</h3>
          <p className="text-muted-foreground mb-8">Наша служба поддержки работает круглосуточно и готова помочь вам с любым вопросом.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              variant="outline" 
              className="rounded-full px-8 h-12 border-primary text-primary hover:bg-primary/5 bg-white font-bold"
              onClick={() => navigate('/catalog')}
            >
              Перейти к покупкам
            </Button>
            <Button className="rounded-full px-8 h-12 font-bold">
              Связаться с нами
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HowToOrder;