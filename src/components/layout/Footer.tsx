"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MadeWithMakeshop } from "@/components/made-with-Makeshop";

const Footer = () => {
  return (
    <footer className="border-t bg-muted/30 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <a href="/" className="mb-6 block">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-red-900 bg-clip-text text-transparent">MAKESHOP</span>
            </a>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Ваш надежный партнер в мире онлайн-шопинга. Лучшие товары со всего мира с доставкой до вашей двери.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6">Покупателям</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link to="/help/how-to-order" className="hover:text-primary transition-colors">Как сделать заказ</Link></li>
              <li><Link to="/help/payment" className="hover:text-primary transition-colors">Способы оплаты</Link></li>
              <li><Link to="/help/shipping" className="hover:text-primary transition-colors">Доставка</Link></li>
              <li><Link to="/help/returns" className="hover:text-primary transition-colors">Возврат товара</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Компания</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary transition-colors">О нас</Link></li>
              <li><Link to="/contacts" className="hover:text-primary transition-colors">Контакты</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Подпишитесь на новости</h4>
            <p className="text-sm text-muted-foreground mb-4">Получайте информацию о скидках и акциях первым!</p>
            <div className="flex gap-2">
              <Input placeholder="Email" className="rounded-xl" />
              <Button className="rounded-xl">OK</Button>
            </div>
          </div>
        </div>
        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">© 2026 Makeshop. Все права защищены.</p>
          <MadeWithMakeshop />
        </div>
      </div>
    </footer>
  );
};

export default Footer;