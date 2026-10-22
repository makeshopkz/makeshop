"use client";

import React, { Suspense, lazy } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CategoryBar from '@/components/home/CategoryBar';
import Hero from '@/components/home/Hero';
import { Loader2 } from 'lucide-react';

// Lazy load heavy sections
const FeaturedProducts = lazy(() => import('@/components/home/FeaturedProducts'));
const Newsletter = lazy(() => import('@/components/home/Newsletter'));

const SectionLoader = () => (
  <div className="py-20 flex justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary/20" />
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow">
        <CategoryBar />
        <Hero />
        <Suspense fallback={<SectionLoader />}>
          <FeaturedProducts />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Newsletter />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default Index;