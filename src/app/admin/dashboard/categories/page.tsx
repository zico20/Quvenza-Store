'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Icon } from '@/components/ui/Icon';
import type { Category } from '@/types';
import adminApiClient from '@/lib/admin/api';
import Topbar from '@/components/admin/layout/Topbar';
import { useLang } from '@/hooks/admin/useLang';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters'),
  isActive: z.boolean(),
});

type FormData = z.infer<typeof schema>;

function slugify(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-');
}

export default function CategoriesPage() {
  const { t } = useLang();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Category | null>(null);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { isActive: true },
  });

  const nameValue = watch('name');

  useEffect(() => {
    if (nameValue && !editingCategory) {
      setValue('slug', slugify(nameValue));
    }
  }, [nameValue, editingCategory, setValue]);

  function showToast(message: string, type: 'success' | 'error') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function fetchCategories() {
    try {
      const res = await adminApiClient.get<{ success: boolean; data: Category[] }>('/categories');
      if (res.data.success) setCategories(res.data.data);
    } catch {
      showToast('Failed to load categories', 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchCategories(); }, []);

  function openCreate() {
    setEditingCategory(null);
    reset({ name: '', slug: '', isActive: true });
    setModalOpen(true);
  }

  function openEdit(cat: Category) {
    setEditingCategory(cat);
    reset({ name: cat.name, slug: cat.slug, isActive: true });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingCategory(null);
    reset();
  }

  async function onSubmit(data: FormData) {
    setSaving(true);
    try {
      if (editingCategory) {
        await adminApiClient.put(`/categories/${editingCategory.id}`, {
          name: data.name,
          slug: data.slug,
          isActive: data.isActive,
        });
        showToast('Category updated', 'success');
      } else {
        await adminApiClient.post('/categories', {
          name: data.name,
          slug: data.slug,
        });
        showToast('Category created', 'success');
      }
      closeModal();
      await fetchCategories();
    } catch (err: any) {
      showToast(err.response?.data?.message ?? 'Operation failed', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(cat: Category) {
    setSaving(true);
    try {
      await adminApiClient.delete(`/categories/${cat.id}`);
      showToast('Category deleted', 'success');
      setDeleteConfirm(null);
      await fetchCategories();
    } catch (err: any) {
      showToast(err.response?.data?.message ?? 'Delete failed', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col">
      <Topbar title={t('categories.title')} />

      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-md shadow-lg text-sm font-medium text-white ${toast.type === 'success' ? 'bg-success' : 'bg-error'}`}>
          {toast.message}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div style={{ background: '#121216', border: '1px solid #26262E', borderRadius: 6 }} className="shadow-xl p-6 max-w-sm w-full mx-4">
            <h3 style={{ color: '#F7F7F8', fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
              {t('common.delete')} {t('categories.title')}
            </h3>
            <p style={{ color: '#A6A6AE', fontSize: 14, marginBottom: 24 }}>
              Are you sure you want to delete <strong style={{ color: '#F7F7F8' }}>{deleteConfirm.name}</strong>?
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setDeleteConfirm(null)}
                style={{ background: 'transparent', border: '1px solid #26262E', color: '#A6A6AE', padding: '8px 16px', borderRadius: 4, fontSize: 13, cursor: 'pointer' }}
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={saving}
                style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 4, fontSize: 13, cursor: 'pointer', opacity: saving ? 0.5 : 1 }}
              >
                {saving ? t('products.deleting') : t('common.delete')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div style={{ background: '#121216', border: '1px solid #26262E', borderRadius: 6 }} className="shadow-xl p-6 max-w-md w-full mx-4">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ color: '#F7F7F8', fontSize: 16, fontWeight: 600 }}>
                {editingCategory ? t('common.edit') : t('categories.new')}
              </h3>
              <button
                onClick={closeModal}
                style={{ background: 'transparent', border: 'none', color: '#6C6C76', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Icon name="x" size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: '#A6A6AE', marginBottom: 6 }}>
                  {t('categories.columns.name')}
                </label>
                <input
                  {...register('name')}
                  placeholder="e.g. Electronics"
                  style={{ width: '100%', background: '#1A1A20', border: '1px solid #26262E', borderRadius: 4, padding: '8px 12px', color: '#F7F7F8', fontSize: 13, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                />
                {errors.name && <p style={{ color: '#FB7185', fontSize: 11, marginTop: 4 }}>{errors.name.message}</p>}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: '#A6A6AE', marginBottom: 6 }}>
                  {t('categories.columns.slug')}
                </label>
                <input
                  {...register('slug')}
                  placeholder="e.g. electronics"
                  style={{ width: '100%', background: '#1A1A20', border: '1px solid #26262E', borderRadius: 4, padding: '8px 12px', color: '#F7F7F8', fontSize: 13, outline: 'none', fontFamily: 'JetBrains Mono, monospace', boxSizing: 'border-box' }}
                />
                {errors.slug && <p style={{ color: '#FB7185', fontSize: 11, marginTop: 4 }}>{errors.slug.message}</p>}
              </div>
              {editingCategory && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" id="catActive" {...register('isActive')} style={{ width: 14, height: 14, accentColor: '#FF7A33' }} />
                  <label htmlFor="catActive" style={{ fontSize: 13, color: '#A6A6AE', cursor: 'pointer' }}>
                    {t('common.active')}
                  </label>
                </div>
              )}
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', paddingTop: 8 }}>
                <button
                  type="button"
                  onClick={closeModal}
                  style={{ background: 'transparent', border: '1px solid #26262E', color: '#A6A6AE', padding: '8px 16px', borderRadius: 4, fontSize: 13, cursor: 'pointer' }}
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{ background: '#FF7A33', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: 'pointer', opacity: saving ? 0.5 : 1 }}
                >
                  {saving ? t('products.saving') : editingCategory ? t('common.save') : t('categories.new')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ padding: 32 }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <p className="mono" style={{ fontSize: 12, color: '#6C6C76' }}>
            {categories.length} {t('categories.title').toLowerCase()}
          </p>
          <button
            onClick={openCreate}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '10px 18px', background: '#FF7A33', color: '#fff',
              borderRadius: 4, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer',
            }}
          >
            <Icon name="plus" size={14} stroke={2} />
            {t('categories.new')}
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ height: 56, background: '#121216', border: '1px solid #26262E', borderRadius: 4 }} />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div style={{ background: '#121216', border: '1px solid #26262E', borderRadius: 6, padding: '64px 32px', textAlign: 'center' }}>
            <Icon name="tag" size={40} stroke={1.2} style={{ color: '#6C6C76', marginBottom: 16 }} />
            <p style={{ color: '#F7F7F8', fontSize: 16, fontWeight: 600, margin: '0 0 12px' }}>
              {t('categories.title')}
            </p>
            <button
              onClick={openCreate}
              style={{ background: 'transparent', border: 'none', color: '#FF7A33', fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}
            >
              {t('categories.new')}
            </button>
          </div>
        ) : (
          <div style={{ background: '#121216', border: '1px solid #26262E', borderRadius: 6, overflow: 'hidden' }}>
            {/* Header */}
            <div style={{
              display: 'grid', gridTemplateColumns: '2fr 1fr 100px 80px',
              padding: '10px 20px', background: '#1A1A20', borderBottom: '1px solid #26262E',
            }}>
              {[t('categories.columns.name'), t('categories.columns.slug'), t('categories.columns.status'), t('categories.columns.actions')].map(h => (
                <div key={h} className="mono" style={{ fontSize: 10, color: '#6C6C76' }}>{h}</div>
              ))}
            </div>
            {/* Rows */}
            {categories.map((cat) => (
              <div
                key={cat.id}
                style={{
                  display: 'grid', gridTemplateColumns: '2fr 1fr 100px 80px',
                  padding: '14px 20px', borderBottom: '1px solid #1A1A20',
                  alignItems: 'center', transition: 'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#1A1A20')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                {/* Name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 4, overflow: 'hidden', flexShrink: 0, background: '#26262E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Icon name="tag" size={14} style={{ color: '#6C6C76' }} stroke={1.4} />
                    )}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#F7F7F8' }}>{cat.name}</span>
                </div>
                {/* Slug */}
                <div className="mono" style={{ fontSize: 11, color: '#6C6C76' }}>{cat.slug}</div>
                {/* Status */}
                <div>
                  <span style={{
                    display: 'inline-flex', padding: '3px 10px', borderRadius: 3, fontSize: 10, fontWeight: 600,
                    fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.08em', textTransform: 'uppercase',
                    background: 'rgba(52,211,153,0.1)', color: '#34D399', border: '1px solid rgba(52,211,153,0.2)',
                  }}>
                    {t('common.active')}
                  </span>
                </div>
                {/* Actions */}
                <div style={{ display: 'flex', gap: 4 }}>
                  <button
                    onClick={() => openEdit(cat)}
                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 4, background: 'transparent', color: '#A6A6AE', border: 'none', cursor: 'pointer' }}
                  >
                    <Icon name="edit" size={14} stroke={1.6} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(cat)}
                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 4, background: 'transparent', color: '#A6A6AE', border: 'none', cursor: 'pointer' }}
                  >
                    <Icon name="trash" size={14} stroke={1.6} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
