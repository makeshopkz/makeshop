"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import ProductCard from '@/components/home/ProductCard';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Filter, Loader2 } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { supabase } from '@/integrations/supabase/client';

const FilterSidebar = ({ priceRange, setPriceRange, activeCategories }: any) => (
  <div className="space-y-8">
    <div>
      <h3 className="font-bold text-lg mb-4">Категории</h3>
      <div className="space-y-2">
        {activeCategories.length > 0 ? (
          activeCategories.map((cat: string) => (
            <div key={cat} className="flex items-center gap-2">
              <Checkbox id={cat} />
              <Label htmlFor={cat} className="text-sm font-medium leading-none cursor-pointer">
                {cat}
              </Label>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">Нет доступных категорий</p>
        )}
      </div>
    </div>

    <div>
      <h3 className="font-bold text-lg mb-4">Цена (₸)</h3>
      <Slider 
        defaultValue={[0, 1000000]} 
        max={1000000} 
        step={1000} 
        value={priceRange}
        onValueChange={setPriceRange}
        className="mb-4"
      />
      <div className="flex items-center gap-2">
        <div className="flex-1 p-2 border rounded-xl text-sm">{priceRange[0].toLocaleString()}</div>
        <div className="w-2 h-px bg-border" />
        <div className="flex-1 p-2 border rounded-xl text-sm">{priceRange[1].toLocaleString()}</div>
      </div>
    </div>

    <Button className="w-full rounded-full">Применить фильтры</Button>
  </div>
);

const Catalog = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [activeCategories, setActiveCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Fetch products
      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      setProducts(productsData || []);

      // Extract unique categories from products
      if (productsData) {
        const uniqueCats = Array.from(new Set(productsData.map(p => p.category).filter(Boolean)));
        setActiveCategories(uniqueCats as string[]);
      }
      
      setLoading(false);
    };
    
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="hidden md:block w-64 shrink-0">
            <FilterSidebar 
              priceRange={priceRange} 
              setPriceRange={setPriceRange} 
              activeCategories={activeCategories}
            />
          </aside>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-black">Все товары <span className="text-muted-foreground font-normal text-lg ml-2">({products.length})</span></h1>
              
              <div className="flex items-center gap-2">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="md:hidden rounded-full gap-2">
                      <Filter className="h-4 w-4" /> Фильтры
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                    <SheetHeader className="mb-6">
                      <SheetTitle>Фильтры</SheetTitle>
                    </SheetHeader>
                    <FilterSidebar 
                      priceRange={priceRange} 
                      setPriceRange={setPriceRange} 
                      activeCategories={activeCategories}
                    />
                  </SheetContent>
                </Sheet>

                <Select defaultValue="popular">
                  <SelectTrigger className="w-[180px] rounded-full">
                    <SelectValue placeholder="Сортировка" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">По популярности</SelectItem>
                    <SelectItem value="new">Сначала новые</SelectItem>
                    <SelectItem value="price-asc">Дешевле</SelectItem>
                    <SelectItem value="price-desc">Дороже</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-muted/30 rounded-[2rem] border-2 border-dashed">
                <p className="text-muted-foreground">Товары не найдены</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default Catalog;