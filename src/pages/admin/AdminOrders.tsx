"use client";

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const AdminOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) toast.error('Ошибка загрузки заказов');
    else setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', id);
    
    if (error) toast.error('Ошибка обновления статуса');
    else {
      toast.success('Статус обновлен');
      fetchOrders(); // Исправлено: вызываем fetchOrders вместо несуществующей fetchReviews
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new': return <Badge className="bg-blue-500">Новый</Badge>;
      case 'processing': return <Badge className="bg-orange-500">В работе</Badge>;
      case 'completed': return <Badge className="bg-green-500">Завершен</Badge>;
      case 'cancelled': return <Badge variant="destructive">Отменен</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-black mb-8">Управление заказами</h1>

        <div className="bg-white rounded-[2rem] shadow-xl shadow-primary/5 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID / Дата</TableHead>
                <TableHead>Клиент</TableHead>
                <TableHead>Сумма</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-10"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></TableCell></TableRow>
              ) : orders.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-10">Заказов пока нет</TableCell></TableRow>
              ) : orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div className="font-bold text-xs">#{order.id.slice(0, 8)}</div>
                    <div className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{order.customer_name}</div>
                    <div className="text-xs text-muted-foreground">{order.city}, {order.address}</div>
                  </TableCell>
                  <TableCell className="font-black text-primary">{order.total_amount.toLocaleString()} ₸</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                      </DialogTrigger>
                      <DialogContent className="rounded-[2rem]">
                        <DialogHeader><DialogTitle>Детали заказа</DialogTitle></DialogHeader>
                        <div className="space-y-4">
                          <div className="border-b pb-2">
                            <p className="text-sm font-bold">Товары:</p>
                            {order.items.map((item: any, i: number) => (
                              <div key={i} className="flex justify-between text-sm py-1">
                                <span>{item.title} x{item.quantity}</span>
                                <span>{(item.price * item.quantity).toLocaleString()} ₸</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => updateStatus(order.id, 'processing')}>В работу</Button>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => updateStatus(order.id, 'completed')}>Завершить</Button>
                            <Button size="sm" variant="destructive" onClick={() => updateStatus(order.id, 'cancelled')}>Отменить</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
};

export default AdminOrders;