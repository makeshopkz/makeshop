"use client";

import React, { useState } from 'react';
import { Heart, ShoppingCart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import ProductDetailView from '@/components/product/ProductDetailView';
import { toast } from 'sonner';

interface ProductProps {
  id?: number | string;
  title: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  images?: string[];
  badge?: string;
}

const ProductCard = ({ id = 1, title, price, oldPrice, rating, reviews, image, images = [], badge }: ProductProps) => {
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, wishlist } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const isWishlisted = wishlist?.some(item => item.id === id);
  
  const allImages = images && images.length > 0 ? images : [image];

  const productData = {
    id,
    title,
    price,
    image_url: image,
    image
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-card rounded-3xl overflow-hidden border border-border/50 hover:shadow-xl transition-all duration-300 group cursor-pointer relative"
        >
          <div className="relative aspect-square overflow-hidden bg-muted">
            <AnimatePresence mode="wait">
              <motion.img 
                key={currentImageIndex}
                src={allImages[currentImageIndex]} 
                alt={title} 
                loading="lazy"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </AnimatePresence>
            
            <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
              {oldPrice && (
                <Badge variant="destructive" className="border-none">
                  -{Math.round(((oldPrice - price) / oldPrice) * 100)}%
                </Badge>
              )}
            </div>

            {allImages.length > 1 && (
              <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-5 w-5 text-primary" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-5 w-5 text-primary" />
                </Button>
              </div>
            )}

            {allImages.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                {allImages.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`h-1 rounded-full transition-all ${currentImageIndex === idx ? 'w-4 bg-primary' : 'w-1 bg-white/60'}`}
                  />
                ))}
              </div>
            )}
          </div>
          
          <div className="p-4">
            {badge && (
              <Badge variant="secondary" className="mb-2 bg-primary/10 text-primary border-none text-[10px] uppercase tracking-wider font-bold px-2 py-0 h-5">
                {badge}
              </Badge>
            )}
            
            <div className="flex items-center gap-1 mb-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-bold">{rating}</span>
              <span className="text-xs text-muted-foreground">({reviews})</span>
            </div>
            
            <h3 className="font-medium text-sm line-clamp-2 mb-3 h-10 group-hover:text-primary transition-colors">
              {title}
            </h3>
            
            <div className="flex items-end justify-between gap-2">
              <div>
                <div className="text-lg font-black text-primary">
                  {price.toLocaleString()} ₸
                </div>
                {oldPrice && (
                  <div className="text-xs text-muted-foreground line-through">
                    {oldPrice.toLocaleString()} ₸
                  </div>
                )}
              </div>
              <div className="flex gap-1">
                <Button 
                  size="icon" 
                  variant="ghost"
                  className={`rounded-xl ${isWishlisted ? 'text-red-500' : 'text-muted-foreground'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(productData);
                    toast.success(isWishlisted ? 'Удалено из избранного' : 'Добавлено в избранное');
                  }}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </Button>
                <Button 
                  size="icon" 
                  variant="outline"
                  className="rounded-xl border-primary text-primary hover:bg-primary/5 bg-white shadow-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(productData);
                  }}
                >
                  <ShoppingCart className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-[2.5rem] border-none">
        <ProductDetailView id={id.toString()} isQuickView />
      </DialogContent>
    </Dialog>
  );
};

export default ProductCard;