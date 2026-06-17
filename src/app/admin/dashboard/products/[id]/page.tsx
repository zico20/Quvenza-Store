'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Icon } from '@/components/ui/Icon';
import type { Product, Category, ApiResponse } from '@/types';
import { adminProducts, adminOrders } from '@/lib/admin/api';
import adminApiClient from '@/lib/admin/api';
import Topbar from '@/components/admin/layout/Topbar';
import { useLang } from '@/hooks/admin/useLang';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.coerce.number().positive('Price must be positive'),
  comparePrice: z.coerce.number().positive().optional().or(z.literal('')),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative'),
  categoryId: z.string().min(1, 'Category is required'),
  isActive: z.boolean(),
});

type FormData = z.infer<typeof schema>;

function slugify(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-');
}

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { t } = useLang();

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: { isActive: true, stock: 0, price: 0 },
  });

  const nameValue = watch('name');

  useEffect(() => {
    Promise.all([
      adminProducts.getAll({ limit: 200 }),
      adminApiClient.get<ApiResponse<Category[]>>('/categories'),
    ]).then(([productsRes, catsRes]) => {
      const found = productsRes.data.find((p) => p.id === id);
      if (found) {
        setProduct(found);
        setImages(found.images ?? []);
        reset({
          name: found.name,
          slug: found.slug,
          description: found.description,
          price: found.price,
          comparePrice: found.comparePrice ?? ('' as any),
          stock: found.stock,
          categoryId: found.categoryId,
          isActive: found.isActive,
        });
      }
      if (catsRes.data.success) setCategories(catsRes.data.data);
    }).catch(() => showToast(t('products.failedLoad'), 'error'))
      .finally(() => setLoading(false));
  }, [id, reset]);

  useEffect(() => {
    if (nameValue) setValue('slug', slugify(nameValue));
  }, [nameValue, setValue]);

  function showToast(message: string, type: 'success' | 'error') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  function handleImageFiles(files: File[]) {
    const valid = files.filter((f) => f.type.startsWith('image/'));
    setNewImageFiles((prev) => [...prev, ...valid]);
    setNewImagePreviews((prev) => [...prev, ...valid.map((f) => URL.createObjectURL(f))]);
  }

  function removeExistingImage(url: string) {
    setImages((prev) => prev.filter((img) => img !== url));
  }

  function removeNewImage(index: number) {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function onSubmit(data: FormData) {
    setSaving(true);
    try {
      let mergedImages = [...images];

      if (newImageFiles.length > 0) {
        const uploadResponse = await adminProducts.uploadImages(id, newImageFiles);
        const uploadedUrls = uploadResponse.data?.images ?? [];
        mergedImages = Array.from(new Set([...mergedImages, ...uploadedUrls]));
      }

      const payload: any = {
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price,
        stock: data.stock,
        categoryId: data.categoryId,
        isActive: data.isActive,
        images: mergedImages,
      };
      if (data.comparePrice && (data.comparePrice as string | number) !== '') {
        payload.comparePrice = Number(data.comparePrice);
      }
      const updatedResponse = await adminProducts.update(id, payload);
      const persistedImages = updatedResponse.data?.images ?? mergedImages;
      setImages(persistedImages);
      setNewImageFiles([]);
      setNewImagePreviews([]);
      router.push('/admin/dashboard/products');
    } catch (err: any) {
      showToast(err.response?.data?.message ?? t('products.failedUpdate'), 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setSaving(true);
    try {
      await adminProducts.delete(id);
      router.push('/admin/dashboard/products');
    } catch (err: any) {
      showToast(err.response?.data?.message ?? t('products.failedUpdate'), 'error');
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col">
        <Topbar title={t('products.editTitle')} />
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-10 bg-bg-elevated rounded-md" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col">
        <Topbar title={t('products.editTitle')} />
        <div className="p-6 text-center">
          <p className="text-text-muted">{t('products.notFound')}</p>
          <button onClick={() => router.push('/admin/dashboard/products')} className="mt-4 text-sm text-accent hover:underline">
            {t('products.backToProducts')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Topbar title={t('products.editTitle')} />

      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-md shadow-lg text-sm font-medium text-white ${toast.type === 'success' ? 'bg-success' : 'bg-error'}`}>
          {toast.message}
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-bg-surface border border-border rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-text-primary mb-2">{t('products.deleteConfirmTitle')}</h3>
            <p className="text-sm text-text-secondary mb-6">
              {t('products.deleteConfirmBody')}
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowDeleteConfirm(false)} className="btn-secondary px-4 py-2 text-sm">
                {t('common.cancel')}
              </button>
              <button onClick={handleDelete} disabled={saving} className="px-4 py-2 text-sm bg-error text-white rounded-md hover:bg-error/90 disabled:opacity-50">
                {saving ? t('products.deleting') : t('common.delete')}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 max-w-2xl">
        <button onClick={() => router.push('/admin/dashboard/products')} className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary mb-4 transition-colors">
          <Icon name="arrowLeft" className="h-3.5 w-3.5" /> {t('products.backToProducts')}
        </button>

        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-3">
          {/* Basic Info */}
          <div className="bg-bg-surface border border-border rounded-lg p-4 space-y-3">
            <h2 className="text-sm font-semibold text-text-primary">{t('products.basicInfo')}</h2>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">{t('products.nameLabel')}</label>
              <input {...register('name')} className="input text-sm" />
              {errors.name && <p className="text-error text-xs mt-0.5">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">{t('products.slugLabel')}</label>
              <input {...register('slug')} className="input font-mono text-sm" />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">{t('products.descLabel')}</label>
              <textarea {...register('description')} rows={3} className="input resize-none text-sm" />
              {errors.description && <p className="text-error text-xs mt-0.5">{errors.description.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">{t('products.categoryLabel')}</label>
              <select {...register('categoryId')} className="input text-sm">
                <option value="">{t('products.selectCategory')}</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {errors.categoryId && <p className="text-error text-xs mt-0.5">{errors.categoryId.message}</p>}
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="bg-bg-surface border border-border rounded-lg p-4 space-y-3">
            <h2 className="text-sm font-semibold text-text-primary">{t('products.pricing')}</h2>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">{t('products.priceLabel')}</label>
                <input type="number" step="0.01" min="0" {...register('price')} className="input text-sm" />
                {errors.price && <p className="text-error text-xs mt-0.5">{errors.price.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">{t('products.comparePriceLabel')}</label>
                <input type="number" step="0.01" min="0" {...register('comparePrice')} className="input text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">{t('products.stockLabel')}</label>
                <input type="number" min="0" {...register('stock')} className="input text-sm" />
                {errors.stock && <p className="text-error text-xs mt-0.5">{errors.stock.message}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isActive" {...register('isActive')} className="h-3.5 w-3.5 accent-accent" />
              <label htmlFor="isActive" className="text-xs font-medium text-text-secondary">{t('products.activeLabel')}</label>
            </div>
          </div>

          {/* Images */}
          <div className="bg-bg-surface border border-border rounded-lg p-4 space-y-3">
            <h2 className="text-sm font-semibold text-text-primary">{t('products.images')}</h2>
            {(images.length > 0 || newImagePreviews.length > 0) && (
              <div className="grid grid-cols-5 gap-2">
                {images.map((url) => (
                  <div key={url} className="relative aspect-square rounded-md overflow-hidden bg-bg-elevated group">
                    <img src={url} alt="Product" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeExistingImage(url)}
                      className="absolute top-0.5 right-0.5 bg-error text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Icon name="x" className="h-2.5 w-2.5" />
                    </button>
                  </div>
                ))}
                {newImagePreviews.map((src, i) => (
                  <div key={i} className="relative aspect-square rounded-md overflow-hidden bg-bg-elevated group">
                    <img src={src} alt={`New ${i + 1}`} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeNewImage(i)}
                      className="absolute top-0.5 right-0.5 bg-error text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Icon name="x" className="h-2.5 w-2.5" />
                    </button>
                    <span className="absolute bottom-0.5 left-0.5 bg-accent text-white text-[10px] px-1 rounded">New</span>
                  </div>
                ))}
              </div>
            )}
            <label className="flex items-center gap-3 border border-dashed border-border rounded-lg p-3 cursor-pointer hover:border-border-strong transition-colors">
              <Icon name="upload" className="h-4 w-4 text-text-muted flex-shrink-0" size={16} />
              <div>
                <span className="text-xs text-text-secondary">{t('products.uploadImages')}</span>
                <span className="text-xs text-text-muted ml-2">PNG, JPG, WebP</span>
              </div>
              <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleImageFiles(Array.from(e.target.files ?? []))} />
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pb-2">
            <button type="button" onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-error border border-error/20 rounded-md hover:bg-error/10 transition-colors">
              <Icon name="trash" className="h-3.5 w-3.5" /> {t('products.deleteProduct')}
            </button>
            <button type="submit" disabled={saving} className="btn-primary text-sm disabled:opacity-50">
              <Icon name="save" className="h-3.5 w-3.5" />
              {saving ? t('products.saving') : t('products.saveChanges')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
