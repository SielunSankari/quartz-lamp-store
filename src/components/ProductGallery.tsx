'use client';

import Image from 'next/image';
import { useState } from 'react';

// Галерея товара: крупное фото + миниатюры (первое = главное).
export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const main = images[active] ?? images[0]!;

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <Image
          src={main}
          alt={alt}
          fill
          priority
          className="object-contain p-5"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {images.length > 1 && (
        <div className="mt-4 flex flex-wrap gap-3">
          {images.map((img, i) => (
            <button
              key={img}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Фото ${i + 1}`}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border bg-white transition-all ${
                i === active
                  ? 'border-sky-400 ring-2 ring-sky-400/30'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <Image src={img} alt="" fill className="object-contain p-1.5" sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
