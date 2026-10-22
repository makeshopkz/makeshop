"use client";

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Check, X, Trash2, Star } from 'lucide-react';

const AdminReviews = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*, products(title)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setReviews(data || []);
    } catch (error: any) {
      toast.error('Ошибка загрузки: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ status: newStatus })
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success(`Статус изменен на "${newStatus}"`);
      // Сразу обновляем локальное состояние для мгновенного отклика
      setReviews(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    } catch (error: any) {
      console.error("Update status error:", error);
      toast.error('Не удалось изменить статус: ' + error.message);
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm('Удалить отзыв безвозвратно?')) return;
    try {
      const { error } = await supabase.from('reviews').delete().eq('id', id);
      if (error) throw error;
      
      toast.success('Отзыв удален');
      setReviews(prev => prev.filter(r => r.id !== id));
    } catch (error: any) {
      toast.error('Ошибка удаления: ' + error.message);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">Ожидает</Badge>;
      case 'approved': return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Одобрен</Badge>;
      case 'rejected': return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Отклонен</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-black mb-8">Управление отзывами</h1>

        <div className="bg-white rounded-[2rem] shadow-xl shadow-primary/5 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Дата / Пользователь</TableHead>
                <TableHead>Товар</TableHead>
                <TableHead>Оценка</TableHead>
                <TableHead className="max-w-xs">Комментарий</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-10"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></TableCell></TableRow>
              ) : reviews.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-10">Отзывов пока нет</TableCell></TableRow>
              ) : reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>
                    <div className="font-bold text-sm">{review.user_name}</div>
                    <div className="text-xs text-muted-foreground">{new Date(review.created_at).toLocaleDateString()}</div>
                  </TableCell>
                  <TableCell className="max-w-[150px] truncate font-medium">
                    {review.products?.title || 'Удаленный товар'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold">{review.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="text-sm text-muted-foreground line-clamp-2">{review.comment}</p>
                  </TableCell>
                  <TableCell>{getStatusBadge(review.status)}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={`text-green-600 hover:bg-green-50 ${review.status === 'approved' ? 'bg-green-50' : ''}`}
                      onClick={() => updateStatus(review.id, 'approved')}
                      title="Одобрить"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={`text-orange-600 hover:bg-orange-50 ${review.status === 'rejected' ? 'bg-orange-50' : ''}`}
                      onClick={() => updateStatus(review.id, 'rejected')}
                      title="Отклонить"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive hover:bg-red-50"
                      onClick={() => deleteReview(review.id)}
                      title="Удалить"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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

export default AdminReviews;