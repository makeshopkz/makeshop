"use client";

import React from 'react';
import Header from '@/components/layout/Header';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock, Send, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from "sonner";

const Contacts = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Сообщение отправлено! Мы свяжемся с вами в ближайшее время.");
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Телефон",
      details: ["+7 (777) 123-45-67", "+7 (700) 987-65-43"],
      action: "Позвонить",
      link: "tel:+77771234567"
    },
    {
      icon: Mail,
      title: "Email",
      details: ["support@makeshop.kz", "info@makeshop.kz"],
      action: "Написать",
      link: "mailto:support@makeshop.kz"
    },
    {
      icon: MapPin,
      title: "Адрес",
      details: ["г. Алматы, пр. Абая 150", "БЦ 'Достык', 5 этаж"],
      action: "На карте",
      link: "https://maps.google.com"
    },
    {
      icon: Clock,
      title: "Режим работы",
      details: ["Пн-Пт: 09:00 - 20:00", "Сб-Вс: 10:00 - 18:00"],
      action: "График",
      link: "#"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pb-20">
        {/* Hero Section */}
        <section className="bg-primary/5 py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-black mb-6"
            >
              Свяжитесь с нами
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground text-lg max-w-2xl mx-auto"
            >
              Есть вопросы или предложения? Мы всегда рады помочь! Выберите удобный способ связи или заполните форму ниже.
            </motion.p>
          </div>
        </section>

        <section className="container mx-auto px-4 -mt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="border-none shadow-xl shadow-primary/5 rounded-[2rem] h-full">
                  <CardContent className="pt-8 flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                      <info.icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-lg font-bold mb-4">{info.title}</h3>
                    <div className="space-y-1 mb-6">
                      {info.details.map((detail, i) => (
                        <p key={i} className="text-sm text-muted-foreground">{detail}</p>
                      ))}
                    </div>
                    <Button variant="ghost" className="text-primary font-bold hover:bg-primary/5" asChild>
                      <a href={info.link}>{info.action}</a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-muted/30 p-8 md:p-12 rounded-[3rem] border border-border/50">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-black">Напишите нам</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold ml-1">Ваше имя</label>
                    <Input placeholder="Иван Иванов" className="rounded-2xl h-12 bg-background" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold ml-1">Email</label>
                    <Input type="email" placeholder="example@mail.com" className="rounded-2xl h-12 bg-background" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">Тема</label>
                  <Input placeholder="Вопрос по заказу" className="rounded-2xl h-12 bg-background" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">Сообщение</label>
                  <Textarea placeholder="Ваше сообщение..." className="rounded-2xl min-h-[150px] bg-background" required />
                </div>
                <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-bold gap-2">
                  Отправить сообщение <Send className="h-5 w-5" />
                </Button>
              </form>
            </div>

            {/* Map Placeholder */}
            <div className="h-full min-h-[400px] rounded-[3rem] overflow-hidden relative shadow-2xl border border-border/50">
              <div className="absolute inset-0 bg-slate-200 flex flex-col items-center justify-center text-center p-8">
                <MapPin className="h-16 w-16 text-primary/40 mb-4" />
                <h3 className="text-xl font-bold mb-2">Мы на карте</h3>
                <p className="text-muted-foreground mb-6">Здесь будет интерактивная карта с нашими офисами и пунктами выдачи</p>
                <div className="w-full h-full absolute inset-0 opacity-50 grayscale">
                  <img 
                    src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1000" 
                    alt="Map" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button className="relative z-10 rounded-full px-8">Открыть в Google Maps</Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Contacts;