'use client';

import { useState } from 'react';
import Image from 'next/image';

interface GemImageProps {
  images: string[];
  name: string;
  className?: string;
  priority?: boolean;
}

export default function GemImage({ images, name, className = '', priority = false }: GemImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  
  const hasImages = images && images.length > 0 && !imageError;
  const imageUrl = hasImages ? images[0] : '';

  if (!hasImages) {
    // Fallback to emoji if no image
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gold/30 to-royal-blue/30 blur-2xl" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl opacity-50">💎</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {imageLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-royal-blue/10 to-black">
          <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <Image
        src={imageUrl}
        alt={name}
        fill
        className="object-cover"
        priority={priority}
        onLoad={() => setImageLoading(false)}
        onError={() => {
          setImageError(true);
          setImageLoading(false);
        }}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
}
