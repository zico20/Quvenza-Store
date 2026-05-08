'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ProductForm from '@/components/admin/products/ProductForm';
import Topbar from '@/components/admin/layout/Topbar';
import { adminProducts } from '@/lib/admin/api';
export default function NewProductPage() {
  const router = useRouter(); const [loading, setLoading] = useState(false);
  async function handleSubmit(data: any) { setLoading(true); try { await adminProducts.create(data); router.push('/admin/dashboard/products'); } catch(e){console.error(e);} finally{setLoading(false);} }
  return <div className="flex flex-col"><Topbar title="New Product"/><div className="p-6 max-w-2xl"><ProductForm onSubmit={handleSubmit} isLoading={loading}/></div></div>;
}
