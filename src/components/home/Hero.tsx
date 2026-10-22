"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ChevronRight, Loader2, ChevronLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

const Hero = () => {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false })
  ]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    const fetchBanners = async () => {
      const { data } = await supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      setBanners(data || []);
      setLoading(false);
    };
    fetchBanners();
  }, []);

  if (loading) return (
    <div className="container mx-auto px-4 py-6 h-[300px] sm:h-[450px] flex items-center justify-center bg-muted rounded-[2.5rem]">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  const displayBanners = banners.length > 0 ? banners : [{
    id: 'default',
    title: "Сезонная распродажа",
    subtitle: "Скидки до -70% на электронику",
    image_url: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=2070",
    link: "/catalog"
  }];

  return (
    <section className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[350px] sm:h-[500px]">
        <div className="lg:col-span-2 relative rounded-[2.5rem] overflow-hidden group">
          <div className="h-full w-full" ref={emblaRef}>
            <div className="flex h-full">
              {displayBanners.map((banner) => (
                <div 
                  key={banner.id} 
                  className="relative flex-[0_0_100%] min-w-0 h-full cursor-pointer"
                  onClick={() => navigate(banner.link)}
                >
                  <img 
                    src={banner.image_url} 
                    alt={banner.title} 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
                  <div className="absolute inset-0 p-8 sm:p-16 flex flex-col justify-center text-white">
                    <motion.span 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      className="text-sm sm:text-base font-bold uppercase tracking-widest mb-4 text-primary-foreground/80"
                    >
                      {banner.subtitle}
                    </motion.span>
                    <motion.h1 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-3xl sm:text-6xl font-black mb-8 leading-tight max-w-xl"
                    >
                      {banner.title}
                    </motion.h1>
                    <Button size="lg" className="w-fit rounded-full bg-primary text-white hover:bg-primary/90 font-bold px-10 h-14 text-lg shadow-xl shadow-primary/20">
                      Подробнее
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {displayBanners.length > 1 && (
            <>
              <button 
                onClick={(e) => { e.stopPropagation(); scrollPrev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20 z-10"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); scrollNext(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20 z-10"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>

        <div className="hidden lg:flex flex-col gap-4">
          <div className="flex-1 relative rounded-[2.5rem] overflow-hidden bg-slate-900 group cursor-pointer" onClick={() => navigate('/catalog')}>
            <img 
              src="https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&q=80&w=1000" 
              className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-700"
              alt="New Arrival"
            />
            <div className="absolute inset-0 p-8 flex flex-col justify-end">
              <span className="text-xs font-bold text-primary mb-2 uppercase">Новое поступление</span>
              <h3 className="text-2xl font-black text-white mb-2">Кроссовки 2024</h3>
              <p className="text-white/60 text-sm">Уже в продаже</p>
            </div>
          </div>
          <div className="flex-1 relative rounded-[2.5rem] overflow-hidden bg-primary group cursor-pointer" onClick={() => navigate('/catalog')}>
            <img 
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000" 
              className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-700"
              alt="Accessories"
            />
            <div className="absolute inset-0 p-8 flex flex-col justify-end">
              <span className="text-xs font-bold text-white/80 mb-2 uppercase">Аксессуары</span>
              <h3 className="text-2xl font-black text-white mb-2">Смарт-часы</h3>
              <p className="text-white/60 text-sm">Скидки до -30%</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;