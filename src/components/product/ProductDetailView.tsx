"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, ShoppingCart, Truck, ShieldCheck, Loader2, ExternalLink, ArrowRight, ChevronLeft, ChevronRight, Check, Minus, Plus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface Props {
  id: string;
  isQuickView?: boolean;
}

const ProductDetailView = ({ id, isQuickView }: Props) => {
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, wishlist } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  
  const isWishlisted = wishlist.some(item => item.id === id);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (data) {
        setProduct(data);
        
        const allVariants = [];
        if (data.color) {
          allVariants.push({
            name: 'Основной',
            color: data.color,
            price: data.price,
            images: data.images || [data.image_url],
            kaspi_link: data.kaspi_link,
            isBase: true
          });
        }
        
        if (data.variants && Array.isArray(data.variants)) {
          allVariants.push(...data.variants);
        }

        if (allVariants.length > 0) {
          setSelectedVariant(allVariants[0]);
        }
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  );

  if (!product) return <div className="text-center py-20">Товар не найден</div>;

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

  const variantImages = selectedVariant?.images && Array.isArray(selectedVariant.images) && selectedVariant.images.length > 0 
    ? selectedVariant.images 
    : null;

  const images = variantImages || (product.images && Array.isArray(product.images) && product.images.length > 0 
    ? product.images 
    : [product.image_url || '/placeholder.svg']);

  const displayPrice = (selectedVariant?.price && selectedVariant.price !== "" && !isNaN(parseFloat(selectedVariant.price))) 
    ? parseFloat(selectedVariant.price) 
    : product.price;

  const displayKaspiLink = (selectedVariant?.kaspi_link && selectedVariant.kaspi_link !== "")
    ? selectedVariant.kaspi_link
    : product.kaspi_link;

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleAddToCart = () => {
    // Добавляем товар в корзину указанное количество раз
    for (let i = 0; i < quantity; i++) {
      addToCart({ 
        id: product.id, 
        title: product.title, 
        price: displayPrice, 
        image: images[0],
        selectedVariant
      });
    }
    toast.success(`Добавлено в корзину: ${quantity} шт.${selectedVariant?.name ? ` (${selectedVariant.name})` : ''}`);
  };

  const handleKaspiClick = () => {
    if (displayKaspiLink) {
      window.open(displayKaspiLink, '_blank');
    } else {
      toast.error("Ссылка на Kaspi для этого товара еще не добавлена");
    }
  };

  const goToProductPage = () => {
    navigate(`/product/${id}`);
  };

  const handleVariantSelect = (variant: any) => {
    setSelectedVariant(variant);
    setSelectedImage(0);
  };

  const incrementQuantity = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  return (
    <div 
      className={`max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 ${
        isQuickView 
          ? 'p-6 sm:p-8 max-h-[85vh] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20' 
          : 'py-8 px-4'
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Gallery */}
      <div className="space-y-4">
        <div 
          className={`relative aspect-square rounded-3xl overflow-hidden bg-muted border shadow-sm transition-opacity group ${isQuickView ? 'cursor-pointer hover:opacity-95' : ''}`}
          onClick={isQuickView ? goToProductPage : undefined}
        >
          <img src={images[selectedImage]} alt="" className="w-full h-full object-cover" />
          
          {images.length > 1 && (
            <>
              <button 
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              >
                <ChevronLeft className="h-6 w-6 text-primary" />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              >
                <ChevronRight className="h-6 w-6 text-primary" />
              </button>
              
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`h-1.5 rounded-full transition-all ${selectedImage === idx ? 'w-6 bg-primary' : 'w-1.5 bg-primary/30'}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        
        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
            {images.map((img, idx) => (
              <button 
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(idx);
                }}
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${selectedImage === idx ? 'border-primary' : 'border-transparent opacity-60'}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-4">
          <Badge className="bg-primary/10 text-primary border-none">В наличии</Badge>
          <div className="flex items-center gap-1 text-sm font-bold">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            {product.rating || 5.0} <span className="text-muted-foreground font-normal">({product.reviews || 0})</span>
          </div>
        </div>

        <h2 
          className={`text-2xl sm:text-3xl font-black mb-4 leading-tight ${isQuickView ? 'cursor-pointer hover:text-primary transition-colors flex items-start gap-2 group' : ''}`}
          onClick={isQuickView ? goToProductPage : undefined}
        >
          {product.title}
          {isQuickView && <ArrowRight className="h-6 w-6 mt-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />}
        </h2>
        
        <div className="flex items-baseline gap-3 mb-6">
          <span className="text-3xl font-black text-primary">{displayPrice.toLocaleString()} ₸</span>
          {product.old_price && (
            <span className="text-lg text-muted-foreground line-through">{product.old_price.toLocaleString()} ₸</span>
          )}
        </div>

        {/* Variant Selection with Images */}
        {displayVariants.length > 0 && (
          <div className="mb-6">
            <p className="text-sm font-bold mb-3 text-muted-foreground uppercase tracking-wider">Вариант: {selectedVariant?.name || 'Не указан'}</p>
            <div className="flex flex-wrap gap-3">
              {displayVariants.map((variant: any, idx: number) => {
                const variantThumb = variant.images?.[0] || variant.image_url || product.image_url;
                const isSelected = selectedVariant?.color === variant.color && selectedVariant?.name === variant.name;
                
                return (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVariantSelect(variant);
                    }}
                    className={`relative w-16 h-16 rounded-xl border-2 overflow-hidden transition-all ${
                      isSelected
                        ? 'border-primary scale-110 shadow-md' 
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
                        <div className="bg-primary text-white rounded-full p-0.5">
                          <Check className="h-3 w-3" />
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
          <p className="text-sm font-bold mb-3 text-muted-foreground uppercase tracking-wider">Количество</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center border-2 rounded-2xl p-1 bg-muted/30">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 rounded-xl hover:bg-white"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-bold text-lg">{quantity}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 rounded-xl hover:bg-white"
                onClick={incrementQuantity}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <span className="text-sm text-muted-foreground">шт.</span>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 text-sm">
            <Truck className="h-5 w-5 text-primary" />
            <span>Бесплатная доставка в некоторые города Казахстана</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span>Гарантия качества</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button 
            className="w-full h-14 rounded-2xl text-lg font-bold gap-2 bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/20"
            onClick={handleKaspiClick}
          >
            <ExternalLink className="h-5 w-5" /> Купить в Kaspi
          </Button>
          
          <div className="flex gap-3">
            <Button 
              variant="outline"
              className="flex-1 h-14 rounded-2xl text-lg font-bold gap-2"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-5 w-5" /> В корзину
            </Button>
            <Button 
              variant="outline" 
              className={`h-14 w-14 rounded-2xl shrink-0 ${isWishlisted ? 'text-red-500 border-red-200 bg-red-50' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(product);
              }}
            >
              <Heart className={`h-6 w-6 ${isWishlisted ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailView;