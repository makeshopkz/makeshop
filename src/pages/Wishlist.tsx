"use client";

import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/context/CartContext';
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2, Heart, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const Wishlist = () => {
  const { wishlist, toggleWishlist, addToCart } = useCart();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-14 h-14 rounded-[1.5rem] bg-primary/10 flex items-center justify-center text-primary">
            <Heart className="h-7 w-7 fill-current" />
          </div>
          <div>
            <h1 className="text-4xl font-black">Избранное</h1>
            <p className="text-muted-foreground">Ваши сохраненные товары ({wishlist?.length || 0})</p>
          </div>
        </div>

        {wishlist && wishlist.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {wishlist.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group bg-card rounded-[2.5rem] border border-border/50 overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
                >
                  <div 
                    className="relative aspect-square overflow-hidden cursor-pointer"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <img 
                      src={product.image_url || '/placeholder.svg'} 
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-4 right-4 h-10 w-10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product);
                        toast.success('Удалено из избранного');
                      }}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                      {product.title}
                    </h3>
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-2xl font-black text-primary">
                        {product.price?.toLocaleString()} ₸
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        className="flex-1 rounded-xl h-12 font-bold gap-2"
                        onClick={() => {
                          addToCart(product);
                          toast.success('Добавлено в корзину');
                        }}
                      >
                        <ShoppingCart className="h-4 w-4" /> В корзину
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-24 bg-muted/20 rounded-[3rem] border-2 border-dashed border-border/50">
            <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Heart className="h-10 w-10 text-muted-foreground/30" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Список пуст</h2>
            <p className="text-muted-foreground mb-8">Вы еще не добавили ни одного товара в избранное</p>
            <Button 
              onClick={() => navigate('/catalog')}
              className="rounded-2xl h-14 px-8 font-bold gap-2"
            >
              Перейти в каталог <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Wishlist;