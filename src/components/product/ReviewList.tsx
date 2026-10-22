"use client";

import React from 'react';
import { Star, User, Play } from 'lucide-react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Media {
  url: string;
  type: 'image' | 'video';
}

interface Review {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
  media_urls?: Media[];
}

interface Props {
  reviews: Review[];
}

const ReviewList = ({ reviews }: Props) => {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/20 rounded-[2rem] border border-dashed">
        <p className="text-muted-foreground">У этого товара пока нет отзывов. Станьте первым!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="bg-card p-6 rounded-[2rem] border border-border/50 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-primary/10">
                <AvatarFallback className="bg-primary/5 text-primary font-bold">
                  {review.user_name[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-bold text-sm">{review.user_name}</div>
                <div className="text-[10px] text-muted-foreground">
                  {new Date(review.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star}
                  className={`h-3 w-3 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/20'}`} 
                />
              ))}
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {review.comment}
          </p>

          {/* Media Gallery */}
          {review.media_urls && review.media_urls.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {review.media_urls.map((media, idx) => (
                <Dialog key={idx}>
                  <DialogTrigger asChild>
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity bg-muted border">
                      {media.type === 'image' ? (
                        <img src={media.url} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-900">
                          <Play className="text-white h-8 w-8 fill-current" />
                        </div>
                      )}
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-none">
                    <div className="flex items-center justify-center min-h-[300px]">
                      {media.type === 'image' ? (
                        <img src={media.url} className="max-w-full max-h-[80vh] object-contain" alt="" />
                      ) : (
                        <video src={media.url} controls className="max-w-full max-h-[80vh]" autoPlay />
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReviewList;