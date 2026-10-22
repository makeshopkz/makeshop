"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from "@/components/ui/button";
import { useCart } from '@/context/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { ShoppingCart, Heart, ChevronLeft, ChevronRight, Star, ShieldCheck, Truck, ExternalLink, Info, List, Store, MessageSquare, Check, Minus, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import ReviewForm from '@/components/product/ReviewForm';
import ReviewList from '@/components/product/ReviewList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);

  const fetchProductData = async () => {
    const { data: productData, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq(id ? 'id' : '', id)
      .single();
    
    if (productError) {
      toast.error('Товар не найден');
      navigate('/catalog');
      return;
    }

    const { data: reviewsData } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', id)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    setProduct(productData);
    
    // Создаем список всех доступных вариантов (основной + дополнительные)
    const allVariants = [];
    if (productData.color) {
      allVariants.push({
        name: 'Основной',
        color: productData.color,
        price: productData.price,
        images: productData.images || [productData.image_url],
        kaspi_link: productData.kaspi_link,
        isBase: true
      });
    }
    
    if (productData.variants && Array.isArray(productData.variants)) {
      allVariants.push(...productData.variants);
    }

    // Если есть варианты, выбираем первый по умолчанию
    if (allVariants.length > 0) {
      setSelectedVariant(allVariants[0]);
    }
    
    setReviews(reviewsData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProductData();
  }, [id, navigate]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Загрузка...</div>;
  if (!product) return null;

  const isInWishlist = wishlist?.some((item: any) => item.id === product.id);
  
  // Логика выбора изображений
  const variantImages = selectedVariant?.images && Array.isArray(selectedVariant.images) && selectedVariant.images.length > 0 
    ? selectedVariant.images 
    : null;
    
  const allImages = variantImages || (product.images && product.images.length > 0 ? product.images : [product.image_url || '/placeholder.svg']);

  // Логика выбора цены
  const displayPrice = (selectedVariant?.price && selectedVariant.price !== "" && !isNaN(parseFloat(selectedVariant.price))) 
    ? parseFloat(selectedVariant.price) 
    : product.price;

  // Логика ссылки Kaspi
  const displayKaspiLink = (selectedVariant?.kaspi_link && selectedVariant.kaspi_link !== "")
    ? selectedVariant.kaspi_link
    : product.kaspi_link;

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);

  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      nextImage();
    } else if (info.offset.x > swipeThreshold) {
      prevImage();
    }
  };

  const handleVariantSelect = (variant: any) => {
    setSelectedVariant(variant);
    setCurrentImageIndex(0);
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({ ...product, price: displayPrice, selectedVariant });
    }
    toast.success(`Добавлено в корзину: ${quantity} шт.${selectedVariant?.name ? `: ${selectedVariant.name}` : ''}`);
  };

  // Собираем все варианты для отображения
  const displayVariants = [];
  if (product.color) {
    displayVariants.push({
      name: 'Основной',
      color: product.color,
      price: product.price,
      images: product.images || [product.image_url],
      kaspi_link: product.kaspi_link,
      isBase: true
    });
  }
  if (product.variants && Array.isArray(product.variants)) {
    displayVariants.push(...product.variants);
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-6 gap-2 rounded-full" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-4 w-4" /> Назад
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Image Section */}
          <div className="flex flex-col gap-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              className="relative aspect-square rounded-[2rem] overflow-hidden bg-muted border shadow-sm group touch-none"
            >
              <AnimatePresence mode="wait">
                <motion.img 
                  key={`${selectedVariant?.name || 'main'}-${currentImageIndex}`}
                  src={allImages[currentImageIndex]} 
                  alt={product.title} 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={handleDragEnd}
                  className="w-full h-full object-cover cursor-grab active:cursor-grabbing" 
                />
              </AnimatePresence>

              {allImages.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                  {allImages.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`h-1.5 rounded-full transition-all ${currentImageIndex === idx ? 'w-8 bg-primary' : 'w-2 bg-white/60'}`}
                    />
                  ))}
                </div>
              )}
            </motion.div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-4 overflow-x-auto p-2 scrollbar-hide">
                {allImages.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${
                      currentImageIndex === idx ? 'border-primary scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${product.title} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info Section */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center text-yellow-400">
                <Star className="h-4 w-4 fill-current" />
                <span className="ml-1 text-sm font-bold text-foreground">{product.rating || 5.0}</span>
              </div>
              <span className="text-muted-foreground text-sm">• {reviews.length} отзывов</span>
              <span className="ml-auto text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                {product.category}
              </span>
            </div>

            <h1 className="text-3xl font-black mb-6 leading-tight">{product.title}</h1>
            
            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-4xl font-black text-primary">{displayPrice.toLocaleString()} ₸</span>
              {product.old_price && product.old_price > displayPrice && (
                <span className="text-xl text-muted-foreground line-through">{product.old_price.toLocaleString()} ₸</span>
              )}
            </div>

            {/* Variant Selection with Images */}
            {displayVariants.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-bold mb-4 uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  Выберите вариант: <span className="text-foreground">{selectedVariant?.name || 'Не указан'}</span>
                </h3>
                <div className="flex flex-wrap gap-4">
                  {displayVariants.map((variant: any, idx: number) => {
                    const variantThumb = variant.images?.[0] || variant.image_url || product.image_url;
                    const isSelected = selectedVariant?.color === variant.color && selectedVariant?.name === variant.name;
                    
                    return (
                      <button
                        key={idx}
                        onClick={() => handleVariantSelect(variant)}
                        className={`relative w-16 h-16 rounded-2xl border-2 overflow-hidden transition-all ${
                          isSelected
                            ? 'border-primary scale-110 shadow-lg shadow-primary/20' 
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <img 
                          src={variantThumb} 
                          alt={variant.name} 
                          className="w-full h-full object-cover"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                            <div className="bg-primary text-white rounded-full p-1">
                              <Check className="h-4 w-4" />
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-8">
              <h3 className="text-sm font-bold mb-4 uppercase tracking-wider text-muted-foreground">Количество</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 rounded-2xl p-1 bg-muted/30">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-12 w-12 rounded-xl hover:bg-white"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-5 w-5" />
                  </Button>
                  <span className="w-16 text-center font-bold text-xl">{quantity}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-12 w-12 rounded-xl hover:bg-white"
                    onClick={incrementQuantity}
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>
                <span className="text-lg font-medium text-muted-foreground">шт.</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 mt-4">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/50 border border-border/50">
                <ShieldCheck className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-bold text-sm">Гарантия качества</p>
                  <p className="text-xs text-muted-foreground">100% оригинал</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/50 border border-border/50">
                <Truck className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-bold text-sm">Быстрая доставка</p>
                  <p className="text-xs text-muted-foreground">По всему Казахстану</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-auto">
              <Button 
                size="lg" 
                className="w-full h-16 rounded-2xl text-lg font-bold gap-3 shadow-xl bg-red-600 hover:bg-red-700" 
                onClick={() => {
                  if (displayKaspiLink) {
                    window.open(displayKaspiLink, '_blank');
                  } else {
                    toast.error("Ссылка на Kaspi еще не добавлена");
                  }
                }}
              >
                <ExternalLink className="h-6 w-6" /> Купить в Kaspi
              </Button>
              
              <div className="flex gap-4">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="flex-1 h-16 rounded-2xl text-lg font-bold gap-3 shadow-xl" 
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-6 w-6" /> В корзину
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className={`h-16 w-16 rounded-2xl border-2 transition-all ${isInWishlist ? 'border-primary bg-primary/5' : ''}`}
                  onClick={() => toggleWishlist(product)}
                >
                  <Heart className={`h-6 w-6 transition-colors ${isInWishlist ? 'fill-primary text-primary' : ''}`} />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Reviews and Description Tabs */}
        <Tabs defaultValue="description" className="mt-16">
          <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0 gap-8">
            <TabsTrigger 
              value="description" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-4 text-lg font-bold"
            >
              Описание
            </TabsTrigger>
            <TabsTrigger 
              value="reviews" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-4 text-lg font-bold"
            >
              Отзывы ({reviews.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="py-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                {product.description || "Описание товара скоро будет добавлено."}
              </p>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-1">
                <ReviewForm productId={product.id} onSuccess={fetchProductData} />
              </div>
              <div className="lg:col-span-2">
                <ReviewList reviews={reviews} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;