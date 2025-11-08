'use client';

import { use, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { formatPrice, formatTimeRemaining } from '@/lib/utils';
import { notFound } from 'next/navigation';
import { AuctionWithGem, Bid } from '@/lib/types';

export default function AuctionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [auction, setAuction] = useState<AuctionWithGem & { bids: Bid[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState('');
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    loadAuction();
  }, [id]);

  async function loadAuction() {
    try {
      const { data, error } = await supabase
        .from('auctions')
        .select(`
          *,
          gem:gems(*),
          bids(
            *,
            user:profiles(full_name, email)
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      const d = data as any;
      const auctionData: AuctionWithGem & { bids: Bid[] } = {
        ...d,
        gem: Array.isArray(d.gem) ? d.gem[0] : d.gem,
        startTime: new Date(d.start_time),
        endTime: new Date(d.end_time),
        bids: d.bids || [],
      };

      setAuction(auctionData);
      setTimeRemaining(formatTimeRemaining(auctionData.endTime));
    } catch (error) {
      console.error('Error loading auction:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (auction) {
      const interval = setInterval(() => {
        setTimeRemaining(formatTimeRemaining(auction.endTime));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [auction]);

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center">
        <div className="text-white text-lg">Loading auction...</div>
      </div>
    );
  }

  if (!auction) {
    notFound();
  }

  const minBid = auction.current_bid + 1000;

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <div className="aspect-square bg-gradient-to-br from-royal-blue/20 to-black border border-gold/30 rounded-lg overflow-hidden mb-4 relative">
              <div className="absolute top-4 right-4 z-10">
                <span className="px-4 py-2 bg-gold text-black rounded-full text-sm font-bold">
                  LIVE AUCTION
                </span>
              </div>
              {auction.gem.images && auction.gem.images.length > 0 ? (
                <img
                  src={auction.gem.images[0]}
                  alt={auction.gem.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-64 h-64 rounded-full bg-gradient-to-br from-gold/40 to-royal-blue/40 blur-3xl animate-pulse" />
                  </div>
                  <div className="text-9xl relative z-10">💎</div>
                </div>
              )}
            </div>
          </div>

          {/* Auction Info */}
          <div>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
              {auction.gem.name}
            </h1>

            {auction.gem.certification && (
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gold/20 border border-gold/30 rounded-full mb-6">
                <span className="text-gold">✓</span>
                <span className="text-gold font-semibold">{auction.gem.certification}</span>
              </div>
            )}

            <p className="text-white/80 leading-relaxed mb-8">
              {auction.gem.description}
            </p>

            {/* Bidding Section */}
            <div className="bg-gradient-to-br from-gold/10 to-royal-blue/10 border-2 border-gold/50 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-white/60 text-sm mb-1">Current Bid</p>
                  <p className="text-3xl text-gold font-bold">{formatPrice(auction.current_bid)}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">Time Remaining</p>
                  <p className="text-2xl text-white font-mono font-semibold" suppressHydrationWarning>{timeRemaining}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gold/20">
                <span className="text-white/60">Total Bids</span>
                <span className="text-white font-semibold">{auction.bid_count}</span>
              </div>

              <div className="mb-4">
                <label className="block text-white mb-2">Your Bid (minimum: {formatPrice(minBid)})</label>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder={minBid.toString()}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur border border-gold/30 rounded-lg focus:outline-none focus:border-gold text-white text-lg"
                />
              </div>

              <button className="w-full px-8 py-4 bg-gold text-black font-bold rounded-lg hover:bg-gold/90 transition text-lg">
                Place Bid
              </button>

              <div className="mt-4 flex items-center space-x-2 text-white/60 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Bids are binding and cannot be retracted</span>
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-gradient-to-br from-royal-blue/20 to-black border border-gold/20 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-serif text-white mb-4">Specifications</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-white/60 text-sm mb-1">Carat Weight</p>
                  <p className="text-white font-semibold">{auction.gem.carat} ct</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">Color</p>
                  <p className="text-white font-semibold">{auction.gem.color}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">Origin</p>
                  <p className="text-white font-semibold">{auction.gem.origin}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">Cut</p>
                  <p className="text-white font-semibold">{auction.gem.cut}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">Clarity</p>
                  <p className="text-white font-semibold">{auction.gem.clarity}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">Starting Bid</p>
                  <p className="text-white font-semibold">{formatPrice(auction.starting_bid)}</p>
                </div>
              </div>
            </div>

            {/* Bid History */}
            <div className="bg-gradient-to-br from-royal-blue/20 to-black border border-gold/20 rounded-lg p-6">
              <h3 className="text-xl font-serif text-white mb-4">Recent Bids</h3>
              <div className="space-y-3">
                {[
                  { user: 'User ***45', amount: auction.current_bid, time: '2 minutes ago' },
                  { user: 'User ***23', amount: auction.current_bid - 2500, time: '15 minutes ago' },
                  { user: 'User ***78', amount: auction.current_bid - 5000, time: '1 hour ago' },
                ].map((bid, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-gold/10 last:border-0">
                    <div>
                      <p className="text-white font-semibold">{bid.user}</p>
                      <p className="text-white/60 text-sm">{bid.time}</p>
                    </div>
                    <p className="text-gold font-semibold">{formatPrice(bid.amount)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
