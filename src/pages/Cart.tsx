"use client";

import React from 'react';
import Header from '@/components/layout/Header';
import { useCart } from '@/context/CartContext';
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pb-24 md:pb-8">
        <h1 className="text-3xl font-black mb-8">Корзина <span className="text-muted-foreground font-normal text-xl ml-2">({cartCount} товаров)</span></h1>

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-[2.5rem] border-2 border-dashed">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Ваша корзина пуста</h2>
            <p className="text-muted-foreground mb-8">Самое время добавить в неё что-нибудь интересное!</p>
            <Button variant="outline" size="lg" className="rounded-full px-10 border-primary text-primary hover:bg-primary/5 bg-white font-bold" onClick={() => navigate('/catalog')}>
              Перейти в каталог
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence mode="popLayout">
                {cart.map((item) => (
                  <motion.div 
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-4 p-4 bg-card border rounded-3xl"
                  >
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-muted shrink-0">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm sm:text-base line-clamp-1 mb-1">{item.title}</h3>
                      <p className="text-primary font-black text-lg">{item.price.toLocaleString()} ₸</p>
                    </div>

                    <div className="flex items-center gap-3 bg-muted/50 p-1 rounded-xl">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-lg"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-bold">{item.quantity}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-lg"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card border rounded-[2rem] p-6 sticky top-24">
                <h3 className="text-xl font-bold mb-6">Детали заказа</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Товары ({cartCount})</span>
                    <span>{cartTotal.toLocaleString()} ₸</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Доставка</span>
                    <span className="text-green-600 font-medium">Бесплатно</span>
                  </div>
                  <div className="h-px bg-border my-2" />
                  <div className="flex justify-between text-xl font-black">
                    <span>Итого</span>
                    <span className="text-primary">{cartTotal.toLocaleString()} ₸</span>
                  </div>
                </div>

                <Button 
                  variant="outline"
                  className="w-full h-14 rounded-2xl text-lg font-bold gap-2 border-primary text-primary hover:bg-primary/5 bg-white shadow-sm"
                  onClick={() => navigate('/checkout')}
                >
                  Оформить заказ
                  <ArrowRight className="h-5 w-5" />
                </Button>
                
                <p className="text-center text-xs text-muted-foreground mt-4">
                  Нажимая кнопку, вы соглашаетесь с условиями оферты и политикой конфиденциальности
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;