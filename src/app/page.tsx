import Link from 'next/link';
import AuctionCard from '@/components/AuctionCard';
import GemCard from '@/components/GemCard';
import { supabase } from '@/lib/supabase/client';
import { Gem, AuctionWithGem } from '@/lib/types';

// Revalidate this page every 60 seconds
export const revalidate = 60;

async function getHomeData() {
  const { data: featuredGems, error: gemsError } = await supabase
    .from('gems')
    .select('*')
    .eq('featured', true)
    .eq('in_stock', true)
    .limit(3);

  console.log('Featured gems query:', { featuredGems, gemsError, count: featuredGems?.length });

  const { data: auctionsData } = await supabase
    .from('auctions')
    .select(`
      *,
      gem:gems(*)
    `)
    .eq('status', 'live')
    .order('end_time', { ascending: true })
    .limit(3);

  const liveAuctions: AuctionWithGem[] = (auctionsData || []).map((a: any) => ({
    ...a,
    gem: Array.isArray(a.gem) ? a.gem[0] : a.gem,
    startTime: new Date(a.start_time),
    endTime: new Date(a.end_time),
  }));

  return {
    featuredGems: (featuredGems || []) as Gem[],
    liveAuctions,
  };
}

export default async function HomePage() {
  const { featuredGems, liveAuctions } = await getHomeData();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-royal-blue/30 via-black to-black" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-royal-blue/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-serif text-white mb-6 leading-tight">
            Discover. Bid. Own.
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto">
            The world's rarest gems await you
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/auctions"
              className="px-8 py-4 bg-gold text-black font-semibold rounded-lg hover:bg-gold/90 transition transform hover:scale-105"
            >
              Start Bidding
            </Link>
            <Link 
              href="/shop"
              className="px-8 py-4 bg-white/10 backdrop-blur text-white font-semibold rounded-lg border border-gold/30 hover:border-gold transition"
            >
              Shop Gems
            </Link>
          </div>
        </div>
      </section>

      {/* Live Auctions */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-royal-blue/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">
                Live Auctions
              </h2>
              <p className="text-white/60">Bid on exceptional gems in real-time</p>
            </div>
            <Link href="/auctions" className="text-gold hover:text-gold/80 transition font-semibold">
              View All →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {liveAuctions.map(auction => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Gems */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">
                Featured Collection
              </h2>
              <p className="text-white/60">Handpicked certified gemstones</p>
            </div>
            <Link href="/shop" className="text-gold hover:text-gold/80 transition font-semibold">
              Shop All →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredGems.map(gem => (
              <GemCard key={gem.id} gem={gem} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-4 bg-gradient-to-b from-royal-blue/10 to-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-12 text-center">
            Shop by Category
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['Sapphire', 'Ruby', 'Emerald', 'Diamond', 'Quartz'].map(category => (
              <Link
                key={category}
                href={`/shop?type=${category.toLowerCase()}`}
                className="group aspect-square bg-gradient-to-br from-royal-blue/20 to-black border border-gold/20 rounded-lg hover:border-gold transition-all duration-300 flex flex-col items-center justify-center p-6"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">💎</div>
                <span className="text-white font-semibold group-hover:text-gold transition">{category}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-12 text-center">
            Trusted by Collectors
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah Chen', text: 'Exceptional quality and authenticity. Won a stunning Kashmir sapphire at auction.' },
              { name: 'Michael Torres', text: 'The certification process is thorough. I trust KIT GEMS for all my rare gem purchases.' },
              { name: 'Emma Williams', text: 'Beautiful collection and seamless bidding experience. Highly recommended!' },
            ].map((testimonial, i) => (
              <div key={i} className="bg-gradient-to-br from-royal-blue/20 to-black border border-gold/20 rounded-lg p-8">
                <div className="text-gold text-4xl mb-4">"</div>
                <p className="text-white/80 mb-6">{testimonial.text}</p>
                <p className="text-white font-semibold">— {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 px-4 bg-gradient-to-br from-royal-blue/20 to-black">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">
            Stay in the Know
          </h2>
          <p className="text-white/60 mb-8">
            Get exclusive access to new arrivals, upcoming auctions, and special offers
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 bg-white/10 backdrop-blur border border-gold/20 rounded-lg focus:outline-none focus:border-gold text-white placeholder-white/40"
            />
            <button className="px-8 py-4 bg-gold text-black font-semibold rounded-lg hover:bg-gold/90 transition">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
