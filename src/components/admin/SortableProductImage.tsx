"use client";

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { X, GripVertical } from 'lucide-react';

interface SortableProductImageProps {
  id: string;
  url: string;
  index: number;
  onRemove: (index: number) => void;
}

const SortableProductImage = ({ id, url, index, onRemove }: SortableProductImageProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="relative aspect-square rounded-xl overflow-hidden border group bg-white"
    >
      <img src={url} className="w-full h-full object-cover" alt={`Product ${index + 1}`} />
      
      {index === 0 && (
        <div className="absolute top-1 left-1 bg-primary text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase pointer-events-none">
          Главное
        </div>
      )}

      <div 
        {...attributes} 
        {...listeners}
        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing bg-black/20"
      >
        <GripVertical className="text-white h-6 w-6" />
      </div>

      <Button 
        type="button" 
        variant="destructive" 
        size="icon" 
        className="absolute top-1 right-1 rounded-full h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity z-10"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(index);
        }}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default SortableProductImage;