import AuctionCard from '@/components/AuctionCard';
import { supabase } from '@/lib/supabase/client';
import { AuctionWithGem } from '@/lib/types';

async function getAuctions() {
  const { data } = await supabase
    .from('auctions')
    .select(`
      *,
      gem:gems(*)
    `)
    .eq('status', 'live')
    .order('end_time', { ascending: true });

  const auctions: AuctionWithGem[] = (data || []).map((a: any) => ({
    ...a,
    gem: Array.isArray(a.gem) ? a.gem[0] : a.gem,
    startTime: new Date(a.start_time),
    endTime: new Date(a.end_time),
  }));

  return auctions;
}

export default async function AuctionsPage() {
  const liveAuctions = await getAuctions();

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-serif text-white mb-4">
            Live Auctions
          </h1>
          <p className="text-white/60 text-lg">
            Bid on the world's most exceptional gemstones
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search auctions..."
              className="w-full px-6 py-3 bg-white/10 backdrop-blur border border-gold/20 rounded-lg focus:outline-none focus:border-gold text-white placeholder-white/40"
            />
          </div>
          <select className="px-6 py-3 bg-white/10 backdrop-blur border border-gold/20 rounded-lg focus:outline-none focus:border-gold text-white">
            <option>Ending Soon</option>
            <option>Highest Bid</option>
            <option>Newly Added</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {liveAuctions.map(auction => (
            <AuctionCard key={auction.id} auction={auction} />
          ))}
        </div>
      </div>
    </div>
  );
}
