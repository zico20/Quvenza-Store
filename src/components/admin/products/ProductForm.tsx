'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Product } from '@/types';
const schema = z.object({ name: z.string().min(1), description: z.string().min(1), price: z.coerce.number().positive(), comparePrice: z.coerce.number().positive().optional(), stock: z.coerce.number().int().min(0), categoryId: z.string().min(1) });
type FormData = z.infer<typeof schema>;
export default function ProductForm({ initialData, onSubmit, isLoading }: { initialData?: Partial<Product>; onSubmit: (d: FormData) => Promise<void>; isLoading?: boolean }) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) as any, defaultValues: { name: initialData?.name??'', description: initialData?.description??'', price: initialData?.price??0, comparePrice: initialData?.comparePrice, stock: initialData?.stock??0, categoryId: initialData?.categoryId??'' } });
  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4 bg-bg-surface border border-border rounded-lg p-6">
      {(['name','description','categoryId'] as const).map((f)=>(
        <div key={f}><label className="block text-sm font-medium text-text-secondary mb-1 capitalize">{f}</label>
          {f==='description'?<textarea {...register(f)} rows={4} className="input resize-none"/>:<input {...register(f)} className="input"/>}
          {errors[f]&&<p className="text-error text-xs mt-1">{errors[f]?.message}</p>}
        </div>
      ))}
      <div className="grid grid-cols-3 gap-4">
        {(['price','comparePrice','stock'] as const).map((f)=>(
          <div key={f}><label className="block text-sm font-medium text-text-secondary mb-1 capitalize">{f}</label><input type="number" step={f==='stock'?'1':'0.01'} {...register(f)} className="input"/>{errors[f]&&<p className="text-error text-xs mt-1">{errors[f]?.message}</p>}</div>
        ))}
      </div>
      <button type="submit" disabled={isLoading} className="btn-primary disabled:opacity-50">{isLoading?'Saving...':initialData?'Update':'Create'}</button>
    </form>
  );
}
