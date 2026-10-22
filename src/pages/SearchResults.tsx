"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/home/ProductCard';
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      // Ищем товары, где название или категория содержат поисковый запрос
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`title.ilike.%${query}%,category.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (!error) {
        setProducts(data || []);
      }
      setLoading(false);
    };

    fetchResults();
  }, [query]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black mb-2">Результаты поиска</h1>
          <p className="text-muted-foreground">
            По запросу <span className="text-primary font-bold">"{query}"</span> {loading ? 'ищем товары...' : `найдено ${products.length} товаров`}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-[2.5rem] border-2 border-dashed">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Ничего не найдено</h2>
            <p className="text-muted-foreground mb-8">Попробуйте изменить запрос или использовать более общие слова.</p>
            <Button variant="outline" className="rounded-full px-10 border-primary text-primary hover:bg-primary/5 bg-white font-bold" onClick={() => window.history.back()}>
              Вернуться назад
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                id={product.id}
                title={product.title}
                price={product.price}
                oldPrice={product.old_price}
                image={product.image_url || '/placeholder.svg'}
                images={product.images}
                rating={product.rating || 5.0}
                reviews={product.reviews || 0}
                badge={product.category}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default SearchResults;