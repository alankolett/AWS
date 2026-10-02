'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { uploadImageAction } from '@/app/actions/upload';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  bucket?: 'avatars' | 'event-banners' | 'cms-media' | 'team-photos';
  label?: string;
  aspect?: 'square' | 'video' | 'banner' | 'auto';
  helperText?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  bucket = 'cms-media',
  label = 'Upload Image',
  aspect = 'auto',
  helperText = 'PNG, JPG, WebP up to 10MB'
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(value || '');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync if value changes externally
  React.useEffect(() => {
    setPreview(value || '');
  }, [value]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    const res = await uploadImageAction(formData, bucket);

    if (res.error) {
      setError(res.error);
    } else if (res.publicUrl) {
      setPreview(res.publicUrl);
      onChange(res.publicUrl);
    }

    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview('');
    onChange('');
  };

  const aspectClass =
    aspect === 'square'
      ? 'aspect-square max-w-[140px]'
      : aspect === 'video'
      ? 'aspect-video max-w-sm'
      : aspect === 'banner'
      ? 'aspect-[21/9] max-w-xl'
      : 'aspect-video max-w-xs';

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-mono text-slate-300 font-medium">
          {label}
        </label>
      )}

      {preview ? (
        <div className={`relative rounded-xl overflow-hidden border border-white/[0.15] bg-[#080b10] group ${aspectClass}`}>
          <img
            src={preview}
            alt="Uploaded preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-mono backdrop-blur transition-colors"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1.5 rounded-lg bg-red-500/80 hover:bg-red-600 text-white transition-colors"
              title="Remove"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {uploading && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center gap-2 text-white font-mono text-xs">
              <Loader2 className="w-4 h-4 animate-spin text-[#ff9900]" />
              <span>Uploading to Supabase...</span>
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/[0.12] hover:border-[#a855f7] rounded-xl cursor-pointer bg-[#080b10] hover:bg-[#0f141c] transition-all group max-w-md"
        >
          {uploading ? (
            <div className="flex items-center gap-2 text-[#a855f7] font-mono text-xs py-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Uploading to Storage Bucket...</span>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-2 group-hover:border-[#a855f7]/40 group-hover:bg-[#a855f7]/10 transition-colors">
                <Upload className="w-4 h-4 text-slate-400 group-hover:text-[#a855f7]" />
              </div>
              <span className="text-xs font-mono text-slate-200 font-medium">Click to Upload Image</span>
              <span className="text-[10px] text-slate-500 font-mono mt-0.5">{helperText}</span>
            </>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && (
        <p className="text-xs text-red-400 font-mono mt-1">{error}</p>
      )}
    </div>
  );
};
