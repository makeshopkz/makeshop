"use client";

import React, { useState, useRef } from 'react';
import { Star, Send, Loader2, X, Upload, Video } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Props {
  productId: string;
  onSuccess: () => void;
}

const ReviewForm = ({ productId, onSuccess }: Props) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<{ url: string; type: 'image' | 'video' }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newMedia = [...mediaFiles];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');

      if (!isImage && !isVideo) {
        toast.error(`Файл ${file.name} не поддерживается`);
        continue;
      }

      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `reviews/${productId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);

        newMedia.push({ url: publicUrl, type: isImage ? 'image' : 'video' });
      } catch (error: any) {
        console.error("Upload error:", error);
        toast.error(`Ошибка загрузки ${file.name}`);
      }
    }

    setMediaFiles(newMedia);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeMedia = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Войдите в аккаунт, чтобы оставить отзыв");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('reviews').insert([{
        product_id: productId,
        user_id: user.id,
        user_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Аноним',
        rating,
        comment,
        status: 'pending',
        media_urls: mediaFiles
      }]);

      if (error) throw error;

      toast.success("Отзыв отправлен и появится после модерации");
      setComment('');
      setRating(5);
      setMediaFiles([]);
      onSuccess();
    } catch (error: any) {
      console.error("Review submission error:", error);
      toast.error("Ошибка при отправке: " + (error.message || "неизвестная ошибка"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-muted/30 p-6 rounded-[2rem] border border-border/50">
      <h3 className="text-xl font-bold mb-4">Оставить отзыв</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium text-muted-foreground mr-2">Ваша оценка:</span>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="focus:outline-none transition-transform active:scale-90"
            >
              <Star 
                className={`h-6 w-6 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`} 
              />
            </button>
          ))}
        </div>
        
        <Textarea 
          placeholder="Поделитесь вашим впечатлением о товаре..." 
          className="rounded-2xl min-h-[100px] bg-background border-none focus-visible:ring-primary"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />

        {mediaFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {mediaFiles.map((file, idx) => (
              <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border bg-black">
                {file.type === 'image' ? (
                  <img src={file.url} className="w-full h-full object-cover" alt="" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Video className="text-white h-8 w-8" />
                  </div>
                )}
                <button 
                  type="button"
                  onClick={() => removeMedia(idx)}
                  className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 hover:bg-black"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <input 
            type="file" 
            multiple 
            accept="image/*,video/*" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <Button 
            type="button" 
            variant="outline" 
            className="flex-1 rounded-xl h-12 gap-2 border-dashed"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Upload className="h-4 w-4" /> Фото / Видео</>}
          </Button>
          
          <Button 
            type="submit" 
            className="flex-[2] rounded-xl h-12 font-bold gap-2" 
            disabled={loading || uploading}
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Send className="h-4 w-4" /> Отправить</>}
          </Button>
        </div>
        
        <p className="text-[10px] text-center text-muted-foreground">
          Максимум 5 файлов. Отзыв будет опубликован после проверки.
        </p>
      </form>
    </div>
  );
};

export default ReviewForm;