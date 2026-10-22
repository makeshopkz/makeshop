"use client";

import React from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Users, ShoppingBag, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    { title: 'Всего товаров', value: '128', icon: Package, color: 'text-blue-600' },
    { title: 'Активных баннеров', value: '4', icon: ShoppingBag, color: 'text-emerald-600' },
    { title: 'Пользователей', value: '1,240', icon: Users, color: 'text-purple-600' },
    { title: 'Продажи за месяц', value: '2.4M ₸', icon: TrendingUp, color: 'text-orange-600' },
  ];

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-black mb-8">Панель управления</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <Card key={idx} className="border-none shadow-xl shadow-primary/5 rounded-[2rem]">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-none shadow-xl shadow-primary/5 rounded-[2rem]">
            <CardHeader>
              <CardTitle>Последние действия</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">Здесь будет отображаться история изменений товаров и баннеров.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;