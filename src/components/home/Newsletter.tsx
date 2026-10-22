"use client";

import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail } from 'lucide-react';
import { toast } from 'sonner';

const Newsletter = () => {
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Спасибо за подписку!");
  };

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="bg-primary/5 rounded-[3rem] p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 border border-primary/10">
        <div className="max-w-md text-center md:text-left">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 mx-auto md:mx-0">
            <Mail className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-black mb-4">Будьте в курсе событий</h2>
          <p className="text-muted-foreground">
            Подпишитесь на нашу рассылку, чтобы получать информацию о новых поступлениях и эксклюзивных скидках.
          </p>
        </div>
        <form onSubmit={handleSubscribe} className="w-full max-w-md flex flex-col sm:flex-row gap-3">
          <Input 
            type="email" 
            placeholder="Ваш email" 
            className="rounded-2xl h-14 bg-white border-none shadow-sm"
            required
          />
          <Button type="submit" className="rounded-2xl h-14 px-8 font-bold text-lg">
            Подписаться
          </Button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;