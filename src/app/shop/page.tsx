'use client';

import { useState, useEffect } from 'react';
import GemCard from '@/components/GemCard';
import { supabase } from '@/lib/supabase/client';
import { Gem } from '@/lib/types';

export default function ShopPage() {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [gems, setGems] = useState<Gem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGems();
  }, []);

  async function loadGems() {
    try {
      const { data, error } = await supabase
        .from('gems')
        .select('*')
        .eq('in_stock', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGems(data || []);
    } catch (error) {
      console.error('Error loading gems:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredGems = gems.filter(gem => {
    if (selectedType !== 'all' && gem.type !== selectedType) return false;
    if (priceRange === 'under-10k' && gem.price >= 10000) return false;
    if (priceRange === '10k-30k' && (gem.price < 10000 || gem.price >= 30000)) return false;
    if (priceRange === 'over-30k' && gem.price < 30000) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center">
        <div className="text-white text-lg">Loading gems...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-serif text-white mb-4">
            Shop Gemstones
          </h1>
          <p className="text-white/60 text-lg">
            Certified, ethically sourced gems from around the world
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-royal-blue/20 to-black border border-gold/20 rounded-lg p-6 sticky top-24">
              <h3 className="text-xl font-serif text-white mb-6">Filters</h3>
              
              <div className="mb-6">
                <h4 className="text-white font-semibold mb-3">Gemstone Type</h4>
                <div className="space-y-2">
                  {['all', 'sapphire', 'ruby', 'emerald', 'diamond', 'quartz'].map(type => (
                    <label key={type} className="flex items-center text-white/80 hover:text-gold cursor-pointer">
                      <input
                        type="radio"
                        name="type"
                        value={type}
                        checked={selectedType === type}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="mr-2"
                      />
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-white font-semibold mb-3">Price Range</h4>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'All Prices' },
                    { value: 'under-10k', label: 'Under $10,000' },
                    { value: '10k-30k', label: '$10,000 - $30,000' },
                    { value: 'over-30k', label: 'Over $30,000' },
                  ].map(range => (
                    <label key={range.value} className="flex items-center text-white/80 hover:text-gold cursor-pointer">
                      <input
                        type="radio"
                        name="price"
                        value={range.value}
                        checked={priceRange === range.value}
                        onChange={(e) => setPriceRange(e.target.value)}
                        className="mr-2"
                      />
                      {range.label}
                    </label>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => {
                  setSelectedType('all');
                  setPriceRange('all');
                }}
                className="w-full px-4 py-2 text-gold border border-gold/30 rounded hover:bg-gold/10 transition"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <p className="text-white/60">
                {filteredGems.length} {filteredGems.length === 1 ? 'gem' : 'gems'} found
              </p>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-white/10 backdrop-blur border border-gold/20 rounded-lg focus:outline-none focus:border-gold text-white"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGems.map(gem => (
                <GemCard key={gem.id} gem={gem} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
