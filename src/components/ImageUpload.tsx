'use client';

import { useState, useRef, DragEvent } from 'react';

interface Props {
  onImageSelected: (file: File) => void;
  preview?: string | null;
}

export default function ImageUpload({ onImageSelected, preview }: Props) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      onImageSelected(file);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onImageSelected(file);
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all ${
        dragOver ? 'border-pink bg-pink-light/20 scale-[1.01]' : 'border-lavender/40 hover:border-pink/50'
      } ${preview ? 'p-0 glass overflow-hidden' : 'p-10 glass-subtle'}`}
    >
      {preview ? (
        <img src={preview} alt="Preview" className="w-full max-h-72 object-contain rounded-2xl" />
      ) : (
        <div className="text-center">
          <div className="text-5xl mb-3">📸</div>
          <p className="text-foreground text-sm font-medium">Tap to add a photo</p>
          <p className="text-muted text-xs mt-1">or drag and drop here</p>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
