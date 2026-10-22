"use client";

import React, { useState, useEffect, useRef } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Pencil, Trash2, Search, Upload, Loader2, FileSpreadsheet, Download, ExternalLink, ChevronDown, ChevronRight, FolderPlus, Palette, X, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

// DND Kit imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensors,
  useSensor,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import SortableProductImage from '@/components/admin/SortableProductImage';

const INITIAL_KASPI_CATEGORIES = [
  {
    label: "Телефоны и гаджеты",
    subcategories: ["Смартфоны", "Смарт-часы", "Наушники", "Аксессуары для телефонов", "Планшеты"]
  },
  {
    label: "Компьютеры",
    subcategories: ["Ноутбуки", "Мониторы", "Комплектующие", "Периферия", "Сетевое оборудование"]
  },
  {
    label: "Бытовая техника",
    subcategories: ["Стиральные машины", "Холодильники", "Пылесосы", "Кондиционеры", "Плиты", "Микроволновые печи", "Электрочайники"]
  },
  {
    label: "ТВ, Аудио, Видео",
    subcategories: ["Телевизоры", "Аудиосистемы", "Игровые приставки", "Проекторы"]
  },
  {
    label: "Автотовары",
    subcategories: ["Шины", "Видеорегистраторы", "Автохимия", "Аккумуляторы", "Запчасти"]
  },
  {
    label: "Одежда",
    subcategories: ["Мужская одежда", "Женская одежда", "Детская одежда", "Верхняя одежда", "Спортивная одежда"]
  },
  {
    label: "Обувь",
    subcategories: ["Мужская обувь", "Женская обувь", "Детская обувь", "Кроссовки", "Ботинки"]
  },
  {
    label: "Аксессуары",
    subcategories: ["Сумки и рюкзаки", "Кошельки", "Ремни", "Очки", "Зонты"]
  },
  {
    label: "Красота и здоровье",
    subcategories: ["Парфюмерия", "Уход за кожей", "Декоративная косметика", "Фены и стайлеры", "Электробритвы"]
  },
  {
    label: "Аптека",
    subcategories: ["Витамины", "Медицинские приборы", "Гигиена", "Оптика"]
  },
  {
    label: "Детские товары",
    subcategories: ["Игрушки", "Коляски", "Детское питание", "Подгузники", "Товары для школы"]
  },
  {
    label: "Товары для дома и дачи",
    subcategories: ["Посуда", "Текстиль", "Освещение", "Садовая техника", "Декор"]
  },
  {
    label: "Мебель",
    subcategories: ["Диваны", "Шкафы", "Столы и стулья", "Кровати", "Офисная мебель"]
  },
  {
    label: "Строительство и ремонт",
    subcategories: ["Инструменты", "Сантехника", "Электрика", "Отделочные материалы", "Межкомнатные двери"]
  },
  {
    label: "Спорт и туризм",
    subcategories: ["Тренажеры", "Велосипеды", "Палатки", "Спортивное питание", "Самокаты"]
  },
  {
    label: "Досуг и книги",
    subcategories: ["Художественная литература", "Настольные игры", "Музыкальные инструменты", "Творчество"]
  },
  {
    label: "Канцелярские товары",
    subcategories: ["Бумага", "Письменные принадлежности", "Офисные мелочи"]
  },
  {
    label: "Подарки и товары для праздников",
    subcategories: ["Сувениры", "Упаковка", "Воздушные шары", "Открытки"]
  },
  {
    label: "Продукты питания",
    subcategories: ["Напитки", "Сладости", "Бакалея", "Чай и кофе"]
  },
  {
    label: "Товары для животных",
    subcategories: ["Корм", "Аксессуары для животных", "Игрушки для животных"]
  },
  {
    label: "Украшения",
    subcategories: ["Ювелирные изделия", "Бижутерия", "Часы"]
  }
];

interface ProductVariant {
  name: string;
  color: string;
  price: string;
  images: string[];
  kaspi_link: string;
}

const AdminProducts = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const multiFileInputRef = useRef<HTMLInputElement>(null);
  const variantFileInputRef = useRef<HTMLInputElement>(null);
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeVariantIndex, setActiveVariantIndex] = useState<number | null>(null);
  const [mainColor, setMainColor] = useState('#000000');
  
  // Category management state with persistence
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('kaspi_categories');
    return saved ? JSON.parse(saved) : INITIAL_KASPI_CATEGORIES;
  });

  useEffect(() => {
    localStorage.setItem('kaspi_categories', JSON.stringify(categories));
  }, [categories]);

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [parentCategoryForSub, setParentCategoryForSub] = useState('none');

  // DND Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Для доступа к админке нужно войти в аккаунт");
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (error) toast.error('Ошибка загрузки товаров');
    else setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (user) fetchProducts();
  }, [user]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isVariant = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;

        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);
        uploadedUrls.push(publicUrl);
      }

      if (isVariant && activeVariantIndex !== null) {
        const newVariants = [...variants];
        newVariants[activeVariantIndex].images = [...(newVariants[activeVariantIndex].images || []), ...uploadedUrls];
        setVariants(newVariants);
      } else {
        setImageUrls([...imageUrls, ...uploadedUrls]);
      }
      
      toast.success('Фотографии загружены');
    } catch (error: any) {
      toast.error('Ошибка загрузки: ' + error.message);
    } finally {
      setUploading(false);
      if (multiFileInputRef.current) multiFileInputRef.current.value = '';
      if (variantFileInputRef.current) variantFileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number, variantIdx: number | null = null) => {
    if (variantIdx !== null) {
      const newVariants = [...variants];
      newVariants[variantIdx].images = newVariants[variantIdx].images.filter((_, i) => i !== index);
      setVariants(newVariants);
    } else {
      setImageUrls(imageUrls.filter((_, i) => i !== index));
    }
  };

  const handleDragEnd = (event: DragEndEvent, variantIdx: number | null = null) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      if (variantIdx !== null) {
        const newVariants = [...variants];
        const items = newVariants[variantIdx].images;
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        newVariants[variantIdx].images = arrayMove(items, oldIndex, newIndex);
        setVariants(newVariants);
      } else {
        setImageUrls((items) => {
          const oldIndex = items.indexOf(active.id as string);
          const newIndex = items.indexOf(over.id as string);
          return arrayMove(items, oldIndex, newIndex);
        });
      }
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) toast.error('Ошибка удаления');
    else {
      toast.success('Товар удален');
      fetchProducts();
    }
  };

  const deleteSelectedProducts = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Вы уверены, что хотите удалить ${selectedIds.length} товаров?`)) return;
    
    const { error } = await supabase.from('products').delete().in('id', selectedIds);
    if (error) toast.error('Ошибка при удалении');
    else {
      toast.success(`Удалено ${selectedIds.length} товаров`);
      setSelectedIds([]);
      fetchProducts();
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map(p => p.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast.error('Введите название');
      return;
    }

    if (parentCategoryForSub === 'none') {
      if (categories.some((c: any) => c.label.toLowerCase() === newCategoryName.toLowerCase())) {
        toast.error('Такая категория уже есть');
        return;
      }
      setCategories([...categories, { label: newCategoryName, subcategories: [] }]);
      toast.success('Категория добавлена');
    } else {
      const updatedCategories = categories.map((cat: any) => {
        if (cat.label === parentCategoryForSub) {
          if (cat.subcategories.some((s: string) => s.toLowerCase() === newCategoryName.toLowerCase())) {
            toast.error('Такая подкатегория уже есть');
            return cat;
          }
          return { ...cat, subcategories: [...cat.subcategories, newCategoryName] };
        }
        return cat;
      });
      setCategories(updatedCategories);
      toast.success('Подкатегория добавлена');
    }

    setNewCategoryName('');
    setIsAddingCategory(false);
  };

  const addVariant = () => {
    setVariants([...variants, { name: '', color: '#000000', price: '', images: [], kaspi_link: '' }]);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: keyof ProductVariant, value: any) => {
    const newVariants = [...variants];
    (newVariants[index] as any)[field] = value;
    setVariants(newVariants);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Сессия истекла. Пожалуйста, войдите снова.");
      navigate('/auth');
      return;
    }

    const formData = new FormData(e.currentTarget);
    const price = parseFloat(formData.get('price') as string);
    
    if (isNaN(price)) {
      toast.error('Введите корректную цену');
      return;
    }
    
    const productData = {
      title: formData.get('title'),
      price: price,
      old_price: formData.get('old_price') ? parseFloat(formData.get('old_price') as string) : null,
      category: selectedCategory,
      image_url: imageUrls[0] || '',
      images: imageUrls,
      variants: variants,
      description: formData.get('description'),
      kaspi_link: formData.get('kaspi_link'),
      color: mainColor,
    };

    setLoading(true);
    try {
      if (editingProduct) {
        const { error } = await supabase.from('products').update(productData).eq('id', editingProduct.id);
        if (error) throw error;
        toast.success('Товар обновлен');
      } else {
        const { error } = await supabase.from('products').insert([productData]);
        if (error) throw error;
        toast.success('Товар добавлен');
      }
      setIsDialogOpen(false);
      fetchProducts();
    } catch (error: any) {
      console.error("Database error:", error);
      toast.error('Ошибка базы данных: ' + (error.message || 'неизвестная ошибка'));
    } finally {
      setLoading(false);
    }
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        setUploading(true);
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        if (data.length === 0) {
          toast.error('Файл пуст');
          return;
        }

        const productsToInsert = data.map((item: any) => {
          const title = item.model || item.title || item['Название'] || item['Название товара'] || '';
          const priceStr = (item.price || item['Цена'] || '0').toString().replace(/\s/g, '');
          const price = parseFloat(priceStr);
          const category = item.brand || item.category || item['Категория'] || '';
          
          return {
            title,
            price,
            category,
            image_url: item.image_url || item['Ссылка на фото'] || '',
            description: item.description || item['Описание'] || '',
            kaspi_link: item.kaspi_link || item['Ссылка Kaspi'] || '',
          };
        }).filter(p => p.title && p.price > 0);

        if (productsToInsert.length === 0) {
          toast.error('Не найдено корректных данных. Проверьте колонки "model" и "price"');
          return;
        }

        const { error } = await supabase.from('products').insert(productsToInsert);
        if (error) throw error;

        toast.success(`Успешно добавлено ${productsToInsert.length} товаров`);
        setIsBulkDialogOpen(false);
        fetchProducts();
      } catch (error: any) {
        toast.error('Ошибка при обработке файла: ' + error.message);
      } finally {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsBinaryString(file);
  };

  const downloadTemplate = () => {
    const template = [
      {
        'SKU': 'SKU001',
        'model': 'iPhone 15 Pro',
        'brand': 'Смартфоны',
        'price': 650000,
        'PP1': 'yes',
        'PP2': 'yes',
        'PP3': 'yes',
        'PP4': 'yes',
        'PP5': 'yes',
        'preorder': 'no'
      }
    ];
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Products");
    XLSX.writeFile(wb, "products_template.xlsx");
  };

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (authLoading) return <div className="flex h-screen items-center justify-center">Загрузка...</div>;

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black">Управление товарами</h1>
          <div className="flex gap-3">
            {selectedIds.length > 0 && (
              <Button 
                variant="destructive" 
                className="rounded-full gap-2 animate-in fade-in slide-in-from-right-4"
                onClick={deleteSelectedProducts}
              >
                <Trash2 className="h-5 w-5" /> Удалить ({selectedIds.length})
              </Button>
            )}
            
            <Dialog open={isBulkDialogOpen} onOpenChange={setIsBulkDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="rounded-full gap-2 border-primary text-primary hover:bg-primary/5">
                  <FileSpreadsheet className="h-5 w-5" /> Импорт Excel
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-[2rem]">
                <DialogHeader>
                  <DialogTitle>Массовая загрузка</DialogTitle>
                  <DialogDescription>
                    Загрузите Excel-файл с товарами. Поддерживаются форматы Kaspi и стандартные шаблоны.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl bg-muted/30">
                    {uploading ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                        <p className="font-medium">Обработка файла...</p>
                      </div>
                    ) : (
                      <>
                        <FileSpreadsheet className="h-12 w-12 text-muted-foreground mb-4" />
                        <Button onClick={() => fileInputRef.current?.click()} className="rounded-xl">
                          Выбрать файл .xlsx
                        </Button>
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          className="hidden" 
                          accept=".xlsx, .xls" 
                          onChange={handleBulkUpload} 
                        />
                      </>
                    )}
                  </div>
                  <div className="flex justify-center">
                    <Button variant="ghost" onClick={downloadTemplate} className="text-primary gap-2">
                      <Download className="h-4 w-4" /> Скачать шаблон Excel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) {
                setEditingProduct(null);
                setImageUrls([]);
                setSelectedCategory('');
                setExpandedGroup(null);
                setIsAddingCategory(false);
                setVariants([]);
                setMainColor('#000000');
              } else if (editingProduct) {
                setSelectedCategory(editingProduct.category || '');
                setVariants(editingProduct.variants || []);
                setMainColor(editingProduct.color || '#000000');
                const initialImages = editingProduct.images || (editingProduct.image_url ? [editingProduct.image_url] : []);
                setImageUrls(initialImages);
              }
            }}>
              <DialogTrigger asChild>
                <Button className="rounded-full gap-2">
                  <Plus className="h-5 w-5" /> Добавить товар
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto rounded-[2rem]">
                <DialogHeader>
                  <DialogTitle>{editingProduct ? 'Редактировать товар' : 'Новый товар'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-8 py-4">
                  {/* Основная информация */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Название основного товара</Label>
                      <Input id="title" name="title" defaultValue={editingProduct?.title} required className="rounded-xl" />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs uppercase font-bold text-muted-foreground">Цвет основного товара</Label>
                      <div className="flex gap-3">
                        <Input 
                          type="color"
                          value={mainColor}
                          onChange={(e) => setMainColor(e.target.value)}
                          className="w-12 h-10 p-1 rounded-lg cursor-pointer"
                        />
                        <Input 
                          placeholder="#000000" 
                          value={mainColor}
                          onChange={(e) => setMainColor(e.target.value)}
                          className="flex-1 rounded-xl"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="flex items-center gap-2">
                          <ImageIcon className="h-4 w-4" /> Фотографии основного товара ({imageUrls.length}/10)
                        </Label>
                        {imageUrls.length < 10 && (
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm" 
                            className="rounded-lg h-8 text-xs gap-1"
                            onClick={() => multiFileInputRef.current?.click()}
                            disabled={uploading}
                          >
                            {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
                            Добавить фото
                          </Button>
                        )}
                      </div>
                      
                      <DndContext 
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={(e) => handleDragEnd(e)}
                      >
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                          <SortableContext 
                            items={imageUrls}
                            strategy={rectSortingStrategy}
                          >
                            {imageUrls.map((url, index) => (
                              <SortableProductImage 
                                key={url} 
                                id={url} 
                                url={url} 
                                index={index} 
                                onRemove={(idx) => removeImage(idx)} 
                              />
                            ))}
                          </SortableContext>
                          
                          {imageUrls.length < 10 && (
                            <button
                              type="button"
                              onClick={() => multiFileInputRef.current?.click()}
                              disabled={uploading}
                              className="aspect-square border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors"
                            >
                              {uploading ? (
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                              ) : (
                                <>
                                  <Upload className="h-6 w-6 mb-1" />
                                  <span className="text-[10px]">Загрузить</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </DndContext>
                      
                      <input 
                        type="file" 
                        ref={multiFileInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        multiple 
                        onChange={(e) => handleImageUpload(e)} 
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Цена (₸)</Label>
                        <Input id="price" name="price" type="number" defaultValue={editingProduct?.price} required className="rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="old_price">Старая цена (₸)</Label>
                        <Input id="old_price" name="old_price" type="number" defaultValue={editingProduct?.old_price} className="rounded-xl" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="category">Категория</Label>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 px-2 text-xs gap-1 text-primary hover:bg-primary/10 rounded-lg"
                          onClick={() => setIsAddingCategory(!isAddingCategory)}
                        >
                          <FolderPlus className="h-3.5 w-3.5" /> {isAddingCategory ? 'Отмена' : 'Добавить'}
                        </Button>
                      </div>

                      {isAddingCategory && (
                        <div className="p-3 border rounded-xl bg-muted/30 space-y-3 animate-in fade-in slide-in-from-top-2">
                          <div className="space-y-1.5">
                            <Label className="text-[10px] uppercase text-muted-foreground">Родительская категория</Label>
                            <Select value={parentCategoryForSub} onValueChange={setParentCategoryForSub}>
                              <SelectTrigger className="h-8 text-xs rounded-lg">
                                <SelectValue placeholder="Выберите родителя" />
                              </SelectTrigger>
                              <SelectContent className="rounded-lg">
                                <SelectItem value="none">Новая основная категория</SelectItem>
                                {categories.map((c: any) => (
                                  <SelectItem key={c.label} value={c.label}>{c.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-[10px] uppercase text-muted-foreground">Название</Label>
                            <div className="flex gap-2">
                              <Input 
                                value={newCategoryName} 
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                placeholder="Напр: Смартфоны" 
                                className="h-8 text-xs rounded-lg"
                              />
                              <Button type="button" size="sm" className="h-8 rounded-lg" onClick={handleAddCategory}>
                                Ок
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="rounded-xl">
                          <span className="truncate">
                            {selectedCategory || "Выберите категорию"}
                          </span>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl max-h-[400px]">
                          {categories.map((group: any) => (
                            <SelectGroup key={group.label}>
                              <div 
                                className="flex items-center justify-between px-2 py-2 text-sm font-bold text-primary cursor-pointer hover:bg-muted rounded-md transition-colors"
                                onPointerDown={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setExpandedGroup(expandedGroup === group.label ? null : group.label);
                                }}
                              >
                                {group.label}
                                {expandedGroup === group.label ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                              </div>
                              {expandedGroup === group.label && group.subcategories.map((sub: string) => (
                                <SelectItem key={sub} value={sub} className="pl-6 py-2">
                                  {sub}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Варианты цветов */}
                  <div className="space-y-6 border-t pt-8">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="flex items-center gap-2 text-lg font-black">
                          <Palette className="h-5 w-5 text-primary" /> Дополнительные варианты (Цвета)
                        </Label>
                        <p className="text-xs text-muted-foreground">Добавьте другие цвета товара с их собственными фото и ценами</p>
                      </div>
                      <Button type="button" variant="outline" size="sm" onClick={addVariant} className="rounded-full h-10 px-4 border-primary text-primary hover:bg-primary/5">
                        <Plus className="h-4 w-4 mr-2" /> Добавить вариант
                      </Button>
                    </div>
                    
                    <div className="space-y-6">
                      {variants.map((variant, vIdx) => (
                        <div key={vIdx} className="p-6 border-2 border-primary/10 rounded-[2rem] bg-primary/5 space-y-6 relative animate-in zoom-in-95 duration-300">
                          <Button 
                            type="button" 
                            variant="destructive" 
                            size="icon" 
                            className="absolute -top-3 -right-3 h-8 w-8 rounded-full shadow-lg"
                            onClick={() => removeVariant(vIdx)}
                          >
                            <X className="h-4 w-4" />
                          </Button>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label className="text-xs uppercase font-bold text-muted-foreground">Название цвета</Label>
                                <Input 
                                  placeholder="Напр: Космический серый" 
                                  value={variant.name}
                                  onChange={(e) => updateVariant(vIdx, 'name', e.target.value)}
                                  className="rounded-xl"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs uppercase font-bold text-muted-foreground">Цвет для кружка (HEX)</Label>
                                <div className="flex gap-3">
                                  <Input 
                                    type="color"
                                    value={variant.color}
                                    onChange={(e) => updateVariant(vIdx, 'color', e.target.value)}
                                    className="w-12 h-10 p-1 rounded-lg cursor-pointer"
                                  />
                                  <Input 
                                    placeholder="#000000" 
                                    value={variant.color}
                                    onChange={(e) => updateVariant(vIdx, 'color', e.target.value)}
                                    className="flex-1 rounded-xl"
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs uppercase font-bold text-muted-foreground">Цена для этого цвета (₸)</Label>
                                <Input 
                                  type="number"
                                  placeholder="Оставьте пустым, если цена такая же" 
                                  value={variant.price}
                                  onChange={(e) => updateVariant(vIdx, 'price', e.target.value)}
                                  className="rounded-xl"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs uppercase font-bold text-muted-foreground">Ссылка Kaspi для этого цвета</Label>
                                <Input 
                                  placeholder="https://kaspi.kz/shop/p/..." 
                                  value={variant.kaspi_link}
                                  onChange={(e) => updateVariant(vIdx, 'kaspi_link', e.target.value)}
                                  className="rounded-xl"
                                />
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <Label className="text-xs uppercase font-bold text-muted-foreground">Фотографии варианта ({variant.images?.length || 0}/10)</Label>
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-8 text-xs rounded-lg"
                                  onClick={() => {
                                    setActiveVariantIndex(vIdx);
                                    variantFileInputRef.current?.click();
                                  }}
                                >
                                  <Upload className="h-3 w-3 mr-1" /> Загрузить
                                </Button>
                              </div>

                              <DndContext 
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={(e) => handleDragEnd(e, vIdx)}
                              >
                                <div className="grid grid-cols-3 gap-2">
                                  <SortableContext 
                                    items={variant.images || []}
                                    strategy={rectSortingStrategy}
                                  >
                                    {(variant.images || []).map((url, imgIdx) => (
                                      <SortableProductImage 
                                        key={url} 
                                        id={url} 
                                        url={url} 
                                        index={imgIdx} 
                                        onRemove={(idx) => removeImage(idx, vIdx)} 
                                      />
                                    ))}
                                  </SortableContext>
                                  {(variant.images?.length || 0) < 10 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setActiveVariantIndex(vIdx);
                                        variantFileInputRef.current?.click();
                                      }}
                                      className="aspect-square border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-muted-foreground hover:bg-primary/5 hover:border-primary/30 transition-colors"
                                    >
                                      <Plus className="h-5 w-5" />
                                    </button>
                                  )}
                                </div>
                              </DndContext>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <input 
                      type="file" 
                      ref={variantFileInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      multiple 
                      onChange={(e) => handleImageUpload(e, true)} 
                    />
                  </div>

                  <div className="space-y-2 border-t pt-8">
                    <Label htmlFor="description">Описание</Label>
                    <Textarea 
                      id="description" 
                      name="description" 
                      defaultValue={editingProduct?.description} 
                      className="rounded-xl min-h-[120px] resize-y" 
                      placeholder="Введите подробное описание товара..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="kaspi_link" className="flex items-center gap-2">
                      Основная ссылка на Kaspi <ExternalLink className="h-3 w-3" />
                    </Label>
                    <Input id="kaspi_link" name="kaspi_link" placeholder="https://kaspi.kz/shop/p/..." defaultValue={editingProduct?.kaspi_link} className="rounded-xl" />
                  </div>

                  <Button type="submit" className="w-full rounded-xl h-14 text-lg font-black shadow-xl shadow-primary/20" disabled={loading || uploading}>
                    {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (editingProduct ? 'Сохранить изменения' : 'Добавить товар')}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] shadow-xl shadow-primary/5 overflow-hidden">
          <div className="p-4 border-b flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Поиск по названию или категории..." 
                className="pl-10 rounded-full bg-muted/50 border-none" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox 
                    checked={selectedIds.length === filteredProducts.length && filteredProducts.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>Фото</TableHead>
                <TableHead>Название</TableHead>
                <TableHead>Категория</TableHead>
                <TableHead>Цена</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && products.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-10">Загрузка...</TableCell></TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-10">Товаров не найдено</TableCell></TableRow>
              ) : filteredProducts.map((product) => (
                <TableRow key={product.id} className={selectedIds.includes(product.id) ? 'bg-primary/5' : ''}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedIds.includes(product.id)}
                      onCheckedChange={() => toggleSelect(product.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <img src={product.image_url || '/placeholder.svg'} className="w-12 h-12 rounded-lg object-cover" alt="" />
                  </TableCell>
                  <TableCell className="font-bold">{product.title}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="rounded-full">{product.category || 'Без категории'}</Badge>
                  </TableCell>
                  <TableCell>{product.price.toLocaleString()} ₸</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => {
                      setEditingProduct(product);
                      const initialImages = product.images || (product.image_url ? [product.image_url] : []);
                      setImageUrls(initialImages);
                      setSelectedCategory(product.category || '');
                      setVariants(product.variants || []);
                      setMainColor(product.color || '#000000');
                      setIsDialogOpen(true);
                    }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteProduct(product.id)}>
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

export default AdminProducts;