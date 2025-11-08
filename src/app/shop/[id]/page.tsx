'use client';

import { use, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { formatPrice } from '@/lib/utils';
import { notFound } from 'next/navigation';
import { Gem } from '@/lib/types';
import Image from 'next/image';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [gem, setGem] = useState<Gem | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    loadGem();
  }, [id]);

  async function loadGem() {
    try {
      const { data, error } = await supabase
        .from('gems')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        setGem(null);
      } else {
        setGem(data as Gem);
      }
    } catch (error) {
      console.error('Error loading gem:', error);
      setGem(null);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (!gem) {
    notFound();
  }

  const hasImages = gem.images && gem.images.length > 0 && !imageError;
  const displayImages = hasImages ? gem.images : [];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <div className="aspect-square bg-gradient-to-br from-royal-blue/20 to-black border border-gold/20 rounded-lg overflow-hidden mb-4 relative">
              {hasImages ? (
                <Image
                  src={displayImages[selectedImage]}
                  alt={gem.name}
                  fill
                  className="object-cover"
                  priority
                  onError={() => setImageError(true)}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-64 h-64 rounded-full bg-gradient-to-br from-gold/30 to-royal-blue/30 blur-3xl" />
                  </div>
                  <div className="text-9xl relative z-10">💎</div>
                </div>
              )}
            </div>
            
            {/* Thumbnail Gallery */}
            {hasImages && displayImages.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {displayImages.slice(0, 4).map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`aspect-square bg-gradient-to-br from-royal-blue/10 to-black border rounded-lg overflow-hidden cursor-pointer hover:border-gold transition relative ${
                      selectedImage === i ? 'border-gold' : 'border-gold/20'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${gem.name} ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 25vw, 12vw"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
              {gem.name}
            </h1>
            <p className="text-3xl text-gold font-semibold mb-6">
              {formatPrice(gem.price)}
            </p>

            {gem.certification && (
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gold/20 border border-gold/30 rounded-full mb-6">
                <span className="text-gold">✓</span>
                <span className="text-gold font-semibold">{gem.certification}</span>
              </div>
            )}

            <p className="text-white/80 leading-relaxed mb-8">
              {gem.description}
            </p>

            <div className="bg-gradient-to-br from-royal-blue/20 to-black border border-gold/20 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-serif text-white mb-4">Specifications</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-white/60 text-sm mb-1">Carat Weight</p>
                  <p className="text-white font-semibold">{gem.carat} ct</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">Color</p>
                  <p className="text-white font-semibold">{gem.color}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">Origin</p>
                  <p className="text-white font-semibold">{gem.origin}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">Cut</p>
                  <p className="text-white font-semibold">{gem.cut}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">Clarity</p>
                  <p className="text-white font-semibold">{gem.clarity}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">Type</p>
                  <p className="text-white font-semibold capitalize">{gem.type}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mb-6">
              <button className="flex-1 px-8 py-4 bg-gold text-black font-semibold rounded-lg hover:bg-gold/90 transition">
                Add to Cart
              </button>
              <button className="px-6 py-4 bg-white/10 backdrop-blur border border-gold/30 rounded-lg hover:border-gold transition">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            <button className="w-full px-8 py-4 bg-white/10 backdrop-blur text-white font-semibold rounded-lg border border-gold/30 hover:border-gold transition">
              Buy Now
            </button>

            <div className="mt-8 space-y-4">
              <div className="flex items-start space-x-3">
                <span className="text-gold text-xl">🚚</span>
                <div>
                  <p className="text-white font-semibold">Free Shipping</p>
                  <p className="text-white/60 text-sm">Insured delivery worldwide</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-gold text-xl">🔒</span>
                <div>
                  <p className="text-white font-semibold">Secure Payment</p>
                  <p className="text-white/60 text-sm">Bank-level encryption</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-gold text-xl">↩️</span>
                <div>
                  <p className="text-white font-semibold">30-Day Returns</p>
                  <p className="text-white/60 text-sm">Full refund guarantee</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
