"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { showSuccess } from '@/utils/toast';

interface Product {
  id: number | string;
  title: string;
  price: number;
  image?: string;
  image_url?: string;
  quantity?: number;
  selectedVariant?: any;
}

interface CartContextType {
  cart: Product[];
  wishlist: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number | string) => void;
  updateQuantity: (productId: number | string, delta: number) => void;
  toggleWishlist: (product: Product) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('dyad_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Error parsing cart from localStorage", e);
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('dyad_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Error parsing wishlist from localStorage", e);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('dyad_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('dyad_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      // Учитываем вариант при поиске существующего товара в корзине
      const existing = prev.find(item => 
        item.id === product.id && 
        JSON.stringify(item.selectedVariant) === JSON.stringify(product.selectedVariant)
      );
      
      if (existing) {
        return prev.map(item => 
          (item.id === product.id && JSON.stringify(item.selectedVariant) === JSON.stringify(product.selectedVariant))
            ? { ...item, quantity: (item.quantity || 1) + 1 } 
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showSuccess(`${product.title} добавлен в корзину`);
  };

  const removeFromCart = (productId: number | string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number | string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, (item.quantity || 1) + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const isExist = prev.some(item => item.id === product.id);
      if (isExist) {
        return prev.filter(item => item.id !== product.id);
      }
      showSuccess("Добавлено в избранное");
      return [...prev, product];
    });
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      wishlist, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      toggleWishlist, 
      clearCart,
      cartTotal,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};