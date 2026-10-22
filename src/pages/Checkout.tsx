"use client";

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Truck, MapPin, CheckCircle2, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { showSuccess, showError } from '@/utils/toast';
import { supabase } from '@/integrations/supabase/client';

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOrdered, setIsOrdered] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      showError("Пожалуйста, войдите в аккаунт для оформления заказа");
      navigate('/auth');
      return;
    }

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const orderData = {
      user_id: user.id,
      customer_name: formData.get('name'),
      city: formData.get('city'),
      address: formData.get('address'),
      total_amount: cartTotal,
      items: cart,
      status: 'new'
    };

    const { error } = await supabase.from('orders').insert([orderData]);

    if (error) {
      showError("Ошибка при создании заказа: " + error.message);
      setLoading(false);
    } else {
      setIsOrdered(true);
      clearCart();
      showSuccess("Заказ успешно оформлен!");
      setLoading(false);
    }
  };

  if (isOrdered) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          <h1 className="text-3xl font-black mb-4">Спасибо за заказ!</h1>
          <p className="text-muted-foreground mb-8">
            Ваш заказ успешно принят. Мы свяжемся с вами в ближайшее время для уточнения деталей.
          </p>
          <Button size="lg" className="rounded-full px-10" onClick={() => navigate('/')}>
            Вернуться на главную
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          className="mb-6 gap-2 rounded-full" 
          onClick={() => navigate('/cart')}
        >
          <ArrowLeft className="h-4 w-4" /> Назад в корзину
        </Button>

        <h1 className="text-3xl font-black mb-8">Оформление заказа</h1>

        <form onSubmit={handleOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-xl shadow-primary/5 rounded-[2rem]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" /> Данные получателя
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">ФИО</Label>
                  <Input id="name" name="name" placeholder="Иван Иванов" className="rounded-xl h-12" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Город</Label>
                    <Input id="city" name="city" placeholder="Алматы" className="rounded-xl h-12" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Адрес</Label>
                    <Input id="address" name="address" placeholder="Улица, дом, квартира" className="rounded-xl h-12" required />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl shadow-primary/5 rounded-[2rem]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-primary" /> Способ доставки
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup defaultValue="delivery" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Label htmlFor="delivery" className="flex flex-col items-center justify-between rounded-2xl border-2 border-muted p-4 cursor-pointer [&:has([data-state=checked])]:border-primary">
                    <RadioGroupItem value="delivery" id="delivery" className="sr-only" />
                    <Truck className="mb-3 h-6 w-6" />
                    <span className="font-bold">Курьером</span>
                    <span className="text-xs text-muted-foreground">Завтра, бесплатно</span>
                  </Label>
                  <Label htmlFor="pickup" className="flex flex-col items-center justify-between rounded-2xl border-2 border-muted p-4 cursor-pointer [&:has([data-state=checked])]:border-primary">
                    <RadioGroupItem value="pickup" id="pickup" className="sr-only" />
                    <MapPin className="mb-3 h-6 w-6" />
                    <span className="font-bold">Самовывоз</span>
                    <span className="text-xs text-muted-foreground">Сегодня, бесплатно</span>
                  </Label>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="border-none shadow-xl shadow-primary/5 rounded-[2rem] sticky top-24">
              <CardHeader><CardTitle>Ваш заказ</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground line-clamp-1 flex-1 mr-4">{item.title} x{item.quantity}</span>
                      <span className="font-bold">{(item.price * (item.quantity || 1)).toLocaleString()} ₸</span>
                    </div>
                  ))}
                  <div className="h-px bg-border my-2" />
                  <div className="flex justify-between text-xl font-black pt-2">
                    <span>Итого</span>
                    <span className="text-primary">{cartTotal.toLocaleString()} ₸</span>
                  </div>
                </div>
                <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-bold" disabled={loading || cart.length === 0}>
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Подтвердить заказ"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Checkout;