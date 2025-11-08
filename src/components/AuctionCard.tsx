'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { AuctionWithGem } from '@/lib/types';
import { formatPrice, formatTimeRemaining } from '@/lib/utils';

interface AuctionCardProps {
  auction: AuctionWithGem;
}

export default function AuctionCard({ auction }: AuctionCardProps) {
  const [timeRemaining, setTimeRemaining] = useState(formatTimeRemaining(auction.endTime));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(formatTimeRemaining(auction.endTime));
    }, 1000);

    return () => clearInterval(interval);
  }, [auction.endTime]);

  return (
    <Link href={`/auctions/${auction.id}`} className="group">
      <div className="bg-gradient-to-br from-royal-blue/20 to-black border border-gold/30 rounded-lg overflow-hidden hover:border-gold transition-all duration-300 hover:shadow-xl hover:shadow-gold/30">
        <div className="relative">
          <div className="aspect-square bg-gradient-to-br from-royal-blue/10 to-black relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-gold/40 to-royal-blue/40 blur-3xl animate-pulse" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-7xl group-hover:scale-110 transition-transform duration-300">💎</div>
            </div>
          </div>
          
          <div className="absolute top-4 right-4 bg-gold text-black px-3 py-1 rounded-full text-xs font-bold">
            LIVE
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-serif text-white mb-1 group-hover:text-gold transition">
            {auction.gem.name}
          </h3>
          <p className="text-sm text-white/60 mb-3">
            {auction.gem.carat} ct • {auction.gem.origin}
          </p>
          
          <div className="space-y-2 mb-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Current Bid</span>
              <span className="text-gold font-semibold">{formatPrice(auction.current_bid)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Bids</span>
              <span className="text-white">{auction.bid_count}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-3 border-t border-gold/20">
            <div className="flex items-center space-x-2 text-white/80">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-mono" suppressHydrationWarning>{timeRemaining}</span>
            </div>
            <button className="text-sm text-gold hover:text-gold/80 transition font-semibold">
              Place Bid →
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
