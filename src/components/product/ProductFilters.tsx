'use client';
import { useState } from 'react';
import type { Category } from '@/types';

export default function ProductFilters({ categories, onFilterChange }: { categories: Category[]; onFilterChange: (f: { categoryId?: string; sort?: string; search?: string }) => void }) {
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [sort, setSort] = useState('');

  function update(u: Partial<{ categoryId: string; sort: string; search: string }>) {
    const ns = u.search ?? search, nc = u.categoryId ?? categoryId, no = u.sort ?? sort;
    setSearch(ns); setCategoryId(nc); setSort(no);
    onFilterChange({ search: ns || undefined, categoryId: nc || undefined, sort: no || undefined });
  }

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => update({ search: e.target.value })}
        className="input flex-1 min-w-48"
      />
      <select value={categoryId} onChange={(e) => update({ categoryId: e.target.value })} className="input w-auto min-w-44">
        <option value="">All Categories</option>
        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <select value={sort} onChange={(e) => update({ sort: e.target.value })} className="input w-auto min-w-44">
        <option value="">Sort By</option>
        <option value="price_asc">Price: Low→High</option>
        <option value="price_desc">Price: High→Low</option>
        <option value="name">Name</option>
      </select>
    </div>
  );
}
