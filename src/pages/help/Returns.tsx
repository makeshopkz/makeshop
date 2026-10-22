"use client";

import React from 'react';
import Header from '@/components/layout/Header';
import { RotateCcw, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';

const Returns = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-black mb-8">Возврат товара</h1>
        
        <div className="prose prose-lg max-w-none mb-12">
          <div className="bg-red-50 border border-red-100 rounded-[2rem] p-8 mb-8 flex items-start gap-4">
            <RotateCcw className="h-8 w-8 text-red-600 shrink-0" />
            <div>
              <h3 className="text-xl font-bold text-red-900 mb-2">14 дней на возврат</h3>
              <p className="text-red-800">
                Вы можете вернуть товар надлежащего качества в течение 14 дней, если он не подошел вам по размеру, фасону или цвету.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-6">Условия возврата</h2>
          <ul className="space-y-4 mb-12">
            <li className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span>Товар не был в употреблении</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span>Сохранен товарный вид и упаковка</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span>Имеются все ярлыки и пломбы</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span>Есть документ, подтверждающий покупку</span>
            </li>
          </ul>

          <h2 className="text-2xl font-bold mb-6">Как оформить возврат?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-card border rounded-2xl">
              <FileText className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-bold mb-2">Заполните заявление</h3>
              <p className="text-sm text-muted-foreground">Скачайте и заполните форму возврата в личном кабинете.</p>
            </div>
            <div className="p-6 bg-card border rounded-2xl">
              <ShieldAlert className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-bold mb-2">Проверка товара</h3>
              <p className="text-sm text-muted-foreground">Мы проверим состояние товара в течение 3-х рабочих дней.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Returns;