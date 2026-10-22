"use client";

import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const FeaturedProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .limit(10)
        .order('created_at', { ascending: false });
      setProducts(data || []);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-black">Рекомендуем вам</h2>
      </div>
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
    </section>
  );
};

export default FeaturedProducts;