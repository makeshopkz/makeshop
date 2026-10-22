"use client";

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, ExternalLink, Upload, Loader2, Pencil } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminBanners = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [editingBanner, setEditingBanner] = useState<any>(null);

  // Защита роута
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Нужно войти в аккаунт для управления баннерами");
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const fetchBanners = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('banners').select('*').order('created_at', { ascending: false });
    if (error) toast.error('Ошибка загрузки баннеров');
    else setBanners(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (user) fetchBanners();
  }, [user]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('banners')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('banners')
        .getPublicUrl(filePath);

      setImageUrl(publicUrl);
      toast.success('Баннер загружен в хранилище');
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error('Ошибка загрузки: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const bannerData = {
      image_url: imageUrl || formData.get('image_url'),
      title: formData.get('title'),
      subtitle: formData.get('subtitle'),
      link: formData.get('link') || '/',
      is_active: true
    };

    if (!bannerData.image_url) {
      toast.error('Загрузите изображение');
      return;
    }

    if (editingBanner) {
      const { error } = await supabase.from('banners').update(bannerData).eq('id', editingBanner.id);
      if (error) toast.error('Ошибка обновления');
      else {
        toast.success('Баннер обновлен');
        setIsDialogOpen(false);
        setEditingBanner(null);
        setImageUrl('');
        fetchBanners();
      }
    } else {
      const { error } = await supabase.from('banners').insert([bannerData]);
      if (error) toast.error('Ошибка добавления в базу');
      else {
        toast.success('Баннер успешно добавлен');
        setIsDialogOpen(false);
        setImageUrl('');
        fetchBanners();
      }
    }
  };

  const deleteBanner = async (id: string) => {
    if (!confirm('Удалить баннер?')) return;
    const { error } = await supabase.from('banners').delete().eq('id', id);
    if (error) toast.error('Ошибка удаления');
    else {
      toast.success('Баннер удален');
      fetchBanners();
    }
  };

  const handleEdit = (banner: any) => {
    setEditingBanner(banner);
    setImageUrl(banner.image_url);
    setIsDialogOpen(true);
  };

  if (authLoading) return <div className="flex h-screen items-center justify-center">Загрузка...</div>;

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black">Управление баннерами</h1>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditingBanner(null);
              setImageUrl('');
            }
          }}>
            <DialogTrigger asChild>
              <Button className="rounded-full gap-2">
                <Plus className="h-5 w-5" /> Добавить баннер
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] rounded-[2rem]">
              <DialogHeader>
                <DialogTitle>{editingBanner ? 'Редактировать баннер' : 'Новый баннер'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Изображение баннера</Label>
                  <div className="flex flex-col gap-4">
                    {imageUrl ? (
                      <div className="relative w-full h-40 rounded-xl overflow-hidden border">
                        <img src={imageUrl} className="w-full h-full object-cover" alt="Preview" />
                        <Button 
                          type="button" 
                          variant="destructive" 
                          size="icon" 
                          className="absolute top-2 right-2 rounded-full h-8 w-8"
                          onClick={() => setImageUrl('')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer bg-muted/50 hover:bg-muted transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          {uploading ? (
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          ) : (
                            <>
                              <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">Загрузить файл в папку баннеров</p>
                            </>
                          )}
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                      </label>
                    )}
                    <Input 
                      name="image_url" 
                      placeholder="Или вставьте прямую ссылку" 
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="rounded-xl" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Заголовок</Label>
                  <Input id="title" name="title" defaultValue={editingBanner?.title} className="rounded-xl" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subtitle">Подзаголовок</Label>
                  <Input id="subtitle" name="subtitle" defaultValue={editingBanner?.subtitle} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="link">Ссылка (куда ведет)</Label>
                  <Input id="link" name="link" defaultValue={editingBanner?.link || "/"} className="rounded-xl" />
                </div>
                <Button type="submit" className="w-full rounded-xl h-12 font-bold" disabled={uploading}>
                  {editingBanner ? 'Сохранить изменения' : 'Опубликовать баннер'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : banners.length === 0 ? (
            <p className="col-span-full text-center text-muted-foreground py-10">Баннеров пока нет</p>
          ) : banners.map((banner) => (
            <Card key={banner.id} className="border-none shadow-xl shadow-primary/5 rounded-[2rem] overflow-hidden group">
              <div className="aspect-[21/9] relative">
                <img src={banner.image_url} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6 text-white">
                  <h3 className="text-xl font-bold">{banner.title}</h3>
                  <p className="text-sm opacity-80">{banner.subtitle}</p>
                </div>
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="secondary" size="icon" className="rounded-full" onClick={() => handleEdit(banner)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="secondary" size="icon" className="rounded-full" asChild>
                    <a href={banner.link} target="_blank" rel="noreferrer"><ExternalLink className="h-4 w-4" /></a>
                  </Button>
                  <Button variant="destructive" size="icon" className="rounded-full" onClick={() => deleteBanner(banner.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminBanners;