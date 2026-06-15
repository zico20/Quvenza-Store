'use client';
import { useCallback, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
export default function ImageUpload({ onUpload, existingImages = [], onRemoveExisting }: { onUpload: (files: File[]) => void; existingImages?: string[]; onRemoveExisting?: (url: string) => void }) {
  const [isDragging, setIsDragging] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const handleDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); const files = Array.from(e.dataTransfer.files).filter((f)=>f.type.startsWith('image/')); if (!files.length) return; setPreviews(files.map((f)=>URL.createObjectURL(f))); onUpload(files); }, [onUpload]);
  return (
    <div className="space-y-4">
      <div onDrop={handleDrop} onDragOver={(e)=>{e.preventDefault();setIsDragging(true);}} onDragLeave={()=>setIsDragging(false)} className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging?'border-accent bg-accent/5':'border-border hover:border-border-strong'}`}>
        <Icon name="upload" className="h-8 w-8 text-text-muted mx-auto mb-2" size={32}/>
        <p className="text-sm text-text-secondary mb-1">Drag & drop or</p>
        <label className="cursor-pointer text-sm font-medium text-accent hover:underline">browse<input type="file" accept="image/*" multiple onChange={(e)=>{const f=Array.from(e.target.files??[]);if(!f.length)return;setPreviews(f.map((fi)=>URL.createObjectURL(fi)));onUpload(f);}} className="hidden"/></label>
      </div>
      {(existingImages.length>0||previews.length>0)&&<div className="grid grid-cols-4 gap-3">
        {existingImages.map((url)=><div key={url} className="relative aspect-square rounded-md overflow-hidden bg-bg-elevated"><img src={url} alt="" className="w-full h-full object-cover"/>{onRemoveExisting&&<button onClick={()=>onRemoveExisting(url)} className="absolute top-1 right-1 bg-error text-white rounded-full p-0.5 hover:bg-error/90"><Icon name="x" className="h-3 w-3"/></button>}</div>)}
        {previews.map((src,i)=><div key={i} className="relative aspect-square rounded-md overflow-hidden bg-bg-elevated"><img src={src} alt="" className="w-full h-full object-cover"/></div>)}
      </div>}
    </div>
  );
}
