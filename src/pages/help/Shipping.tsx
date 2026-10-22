"use client";

import React from 'react';
import Header from '@/components/layout/Header';
import { Truck, MapPin, Clock, PackageCheck } from 'lucide-react';

const Shipping = () => {
  const options = [
    {
      icon: Truck,
      title: "Курьерская доставка",
      description: "Доставка до двери в течение 1-3 рабочих дней. Бесплатно при заказе от 50 000 ₸."
    },
    {
      icon: MapPin,
      title: "Пункты выдачи",
      description: "Заберите заказ в удобное время из ближайшего пункта выдачи или постамата."
    },
    {
      icon: Clock,
      title: "Экспресс-доставка",
      description: "Доставка в день заказа для жителей Алматы и Астаны при оформлении до 14:00."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-black mb-8">Доставка</h1>
        
        <div className="grid gap-8 mb-12">
          {options.map((option, index) => (
            <div key={index} className="p-8 bg-card border rounded-[2rem] flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                <option.icon className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">{option.title}</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {option.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-muted/30 rounded-[2rem] p-8">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <PackageCheck className="h-6 w-6 text-primary" />
            Как отследить заказ?
          </h3>
          <p className="text-muted-foreground mb-4">
            После отправки заказа вы получите SMS с трек-номером. Вы можете отследить статус посылки в личном кабинете в разделе «Мои заказы».
          </p>
        </div>
      </main>
    </div>
  );
};

export default Shipping;