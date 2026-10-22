"use client";

import React, { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Heart, 
  Settings, 
  LogOut, 
  CreditCard, 
  MapPin, 
  Bell, 
  UserCircle, 
  Loader2, 
  MessageSquare,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ReviewForm from '@/components/product/ReviewForm';

const Profile = () => {
  const { user, signOut, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      setLoadingOrders(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (!error) setOrders(data || []);
      setLoadingOrders(false);
    };

    if (user) fetchOrders();
  }, [user]);

  const menuItems = [
    { id: 'orders', icon: Package, label: "Мои заказы", count: orders.length },
    { id: 'wishlist', icon: Heart, label: "Избранное", path: '/wishlist' },
    { id: 'payments', icon: CreditCard, label: "Способы оплаты" },
    { id: 'addresses', icon: MapPin, label: "Адреса доставки" },
    { id: 'notifications', icon: Bell, label: "Уведомления" },
    { id: 'settings', icon: Settings, label: "Настройки профиля" },
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-muted/30">
        <Header />
        <main className="container mx-auto px-4 py-20 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
            <UserCircle className="h-10 w-10" />
          </div>
          <h1 className="text-3xl font-black mb-4">Личный кабинет</h1>
          <p className="text-muted-foreground max-w-md mb-8">
            Войдите в аккаунт, чтобы отслеживать заказы, сохранять избранные товары и получать персональные скидки.
          </p>
          <Button size="lg" className="rounded-full px-10 font-bold" onClick={() => navigate('/auth')}>
            Войти или зарегистрироваться
          </Button>
        </main>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new': return <Badge className="bg-blue-500">Новый</Badge>;
      case 'processing': return <Badge className="bg-orange-500">В работе</Badge>;
      case 'completed': return <Badge className="bg-green-500">Завершен</Badge>;
      case 'cancelled': return <Badge variant="destructive">Отменен</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-none shadow-xl shadow-primary/5 rounded-[2rem] overflow-hidden bg-white">
              <CardContent className="pt-8 text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-background shadow-lg">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-primary/5 text-primary text-2xl font-black">
                    {user.email?.[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-black truncate px-4">{user.user_metadata?.full_name || 'Пользователь'}</h2>
                <p className="text-muted-foreground text-sm mb-4 truncate px-4">{user.email}</p>
                <Badge variant="secondary" className="rounded-full px-4">Покупатель</Badge>
              </CardContent>
              <div className="border-t p-4">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl gap-3"
                  onClick={() => signOut()}
                >
                  <LogOut className="h-5 w-5" /> Выйти
                </Button>
              </div>
            </Card>

            <div className="hidden lg:block space-y-2">
              {menuItems.map((item) => (
                <Button 
                  key={item.id} 
                  variant="ghost" 
                  className={`w-full justify-between h-12 rounded-xl transition-all ${activeTab === item.id ? 'bg-white shadow-md text-primary' : 'text-muted-foreground hover:bg-white/50'}`}
                  onClick={() => {
                    if (item.path) navigate(item.path);
                    else setActiveTab(item.id);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`h-5 w-5 ${activeTab === item.id ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.count !== undefined && item.count > 0 ? (
                    <Badge className="bg-primary/10 text-primary border-none rounded-full">{item.count}</Badge>
                  ) : null}
                </Button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-none shadow-lg rounded-3xl bg-gradient-to-br from-primary to-red-900 text-white p-6">
                <p className="text-white/70 text-sm mb-1">Всего заказов</p>
                <h3 className="text-3xl font-black">{orders.length}</h3>
              </Card>
              <Card className="border-none shadow-lg rounded-3xl bg-white p-6">
                <p className="text-muted-foreground text-sm mb-1">Бонусы</p>
                <h3 className="text-3xl font-black text-primary">0</h3>
              </Card>
              <Card className="border-none shadow-lg rounded-3xl bg-white p-6">
                <p className="text-muted-foreground text-sm mb-1">Статус</p>
                <h3 className="text-3xl font-black text-emerald-600">Новичок</h3>
              </Card>
            </div>

            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black">Мои заказы</h3>
              </div>
              
              {loadingOrders ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
              ) : orders.length === 0 ? (
                <div className="bg-white p-12 rounded-[2rem] shadow-sm border text-center">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                  <p className="text-muted-foreground">У вас пока нет заказов</p>
                  <Button variant="link" className="mt-2 font-bold" onClick={() => navigate('/catalog')}>
                    Перейти к покупкам
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <Card key={order.id} className="border-none shadow-xl shadow-primary/5 rounded-[2rem] overflow-hidden bg-white">
                      <div className="p-6 border-b bg-muted/10 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <Package className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Заказ от {new Date(order.created_at).toLocaleDateString()}</p>
                            <p className="font-black">#{order.id.slice(0, 8).toUpperCase()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">Сумма</p>
                            <p className="font-black text-primary">{order.total_amount.toLocaleString()} ₸</p>
                          </div>
                          {getStatusBadge(order.status)}
                        </div>
                      </div>
                      <div className="p-6 space-y-4">
                        {order.items.map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-4 group">
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted shrink-0">
                              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-sm line-clamp-1 group-hover:text-primary transition-colors cursor-pointer" onClick={() => navigate(`/product/${item.id}`)}>
                                {item.title}
                              </h4>
                              <p className="text-xs text-muted-foreground">{item.quantity} шт. • {item.price.toLocaleString()} ₸</p>
                            </div>
                            
                            {order.status === 'completed' && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm" className="rounded-full gap-2 border-primary text-primary hover:bg-primary/5">
                                    <MessageSquare className="h-4 w-4" />
                                    Отзыв
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="rounded-[2.5rem] border-none p-0 overflow-hidden max-w-md">
                                  <div className="p-8">
                                    <DialogHeader className="mb-6">
                                      <DialogTitle className="text-2xl font-black">Ваш отзыв</DialogTitle>
                                      <p className="text-muted-foreground text-sm">Оцените товар: {item.title}</p>
                                    </DialogHeader>
                                    <ReviewForm productId={item.id.toString()} onSuccess={() => {}} />
                                  </div>
                                </DialogContent>
                              </Dialog>
                            )}
                          </div>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;