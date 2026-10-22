"use client";

import React from 'react';
import Header from '@/components/layout/Header';
import { CreditCard, Wallet, Landmark, ShieldCheck } from 'lucide-react';

const PaymentMethods = () => {
  const methods = [
    {
      icon: CreditCard,
      title: "Банковские карты",
      description: "Мы принимаем карты Visa, MasterCard и Kaspi Gold. Оплата происходит через защищенный шлюз."
    },
    {
      icon: Wallet,
      title: "Kaspi QR",
      description: "Самый быстрый способ оплаты. Просто отсканируйте QR-код в приложении Kaspi.kz при оформлении заказа."
    },
    {
      icon: Landmark,
      title: "Рассрочка и кредит",
      description: "Вы можете приобрести товары в рассрочку 0-0-12 или в кредит через банки-партнеры."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-black mb-8">Способы оплаты</h1>
        
        <div className="grid gap-8 mb-12">
          {methods.map((method, index) => (
            <div key={index} className="p-8 bg-card border rounded-[2rem] flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                <method.icon className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">{method.title}</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {method.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-[2rem] p-8 flex items-start gap-4">
          <ShieldCheck className="h-8 w-8 text-primary shrink-0" />
          <div>
            <h3 className="text-xl font-bold mb-2">Безопасность платежей</h3>
            <p className="text-muted-foreground">
              Все платежные данные передаются по зашифрованному протоколу SSL. Мы не храним данные ваших банковских карт на наших серверах.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentMethods;