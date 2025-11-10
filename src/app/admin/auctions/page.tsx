'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import AdminGuard from '@/components/AdminGuard';

interface Auction {
  id: string;
  gem_id: string;
  starting_bid: number;
  current_bid: number;
  bid_count: number;
  start_time: string;
  end_time: string;
  status: 'upcoming' | 'live' | 'ended';
  gem?: {
    name: string;
    type: string;
  };
}

interface Gem {
  id: string;
  name: string;
  type: string;
  price: number;
}

export default function AuctionsManagement() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [gems, setGems] = useState<Gem[]>([]);
  const [loadingAuctions, setLoadingAuctions] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    gem_id: '',
    starting_bid: '',
    start_time: '',
    end_time: '',
    status: 'upcoming' as 'upcoming' | 'live' | 'ended',
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    } else if (user) {
      loadAuctions();
      loadGems();
    }
  }, [user, loading, router]);

  async function loadAuctions() {
    try {
      setLoadingAuctions(true);
      const { data, error } = await supabase
        .from('auctions')
        .select(`
          *,
          gem:gems(name, type)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading auctions:', error);
        setAuctions([]);
      } else {
        setAuctions(data || []);
      }
    } catch (error) {
      console.error('Error loading auctions:', error);
      setAuctions([]);
    } finally {
      setLoadingAuctions(false);
    }
  }

  async function loadGems() {
    try {
      const { data, error } = await supabase
        .from('gems')
        .select('id, name, type, price')
        .eq('in_stock', true)
        .order('name');

      if (error) throw error;
      setGems(data || []);
    } catch (error) {
      console.error('Error loading gems:', error);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const auctionData = {
        gem_id: formData.gem_id,
        starting_bid: parseFloat(formData.starting_bid),
        current_bid: parseFloat(formData.starting_bid),
        bid_count: 0,
        start_time: new Date(formData.start_time).toISOString(),
        end_time: new Date(formData.end_time).toISOString(),
        status: formData.status,
      };

      // @ts-ignore
      const { error } = await supabase
        .from('auctions')
        // @ts-ignore
        .insert([auctionData]);

      if (error) throw error;

      alert('Auction created successfully');
      setShowModal(false);
      resetForm();
      loadAuctions();
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this auction?')) return;

    try {
      const { error } = await supabase
        .from('auctions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAuctions(auctions.filter(a => a.id !== id));
      alert('Auction deleted successfully');
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  }

  async function handleUpdateStatus(id: string, newStatus: 'upcoming' | 'live' | 'ended') {
    try {
      // @ts-ignore
      const { error } = await supabase
        .from('auctions')
        // @ts-ignore
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setAuctions(auctions.map(a => a.id === id ? { ...a, status: newStatus } : a));
      alert('Auction status updated');
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  }

  function resetForm() {
    setFormData({
      gem_id: '',
      starting_bid: '',
      start_time: '',
      end_time: '',
      status: 'upcoming',
    });
  }

  if (loading || loadingAuctions) {
    return (
      <AdminGuard>
        <div className="min-h-screen py-12 px-4 flex items-center justify-center bg-black">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-white text-lg">Loading auctions...</div>
          </div>
        </div>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link href="/admin" className="text-gold hover:text-gold/80 transition text-sm mb-2 inline-block">
                ← Back to Dashboard
              </Link>
              <h1 className="text-4xl md:text-5xl font-serif text-white mb-2">
                Auctions Management
              </h1>
              <p className="text-white/60">Total: {auctions.length} auctions</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-gold text-black font-semibold rounded-lg hover:bg-gold/90 transition"
            >
              + Create Auction
            </button>
          </div>

          {auctions.length === 0 ? (
            <div className="bg-gradient-to-br from-royal-blue/20 to-black border border-gold/20 rounded-lg p-12 text-center">
              <div className="text-8xl mb-6">⚡</div>
              <h2 className="text-3xl font-serif text-white mb-4">No Auctions Yet</h2>
              <p className="text-white/60 mb-8 max-w-md mx-auto">
                Create your first auction to start accepting bids on your gems.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="px-8 py-4 bg-gold text-black font-semibold rounded-lg hover:bg-gold/90 transition"
              >
                Create First Auction
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {auctions.map((auction) => {
                const gem = Array.isArray(auction.gem) ? auction.gem[0] : auction.gem;
                return (
                  <div key={auction.id} className="bg-gradient-to-br from-royal-blue/20 to-black border border-gold/20 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-serif text-white mb-2">{gem?.name || 'Unknown Gem'}</h3>
                        <p className="text-white/60 capitalize mb-4">{gem?.type}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-white/60 text-sm mb-1">Starting Bid</p>
                            <p className="text-white font-semibold">${auction.starting_bid.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-white/60 text-sm mb-1">Current Bid</p>
                            <p className="text-gold font-semibold">${auction.current_bid.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-white/60 text-sm mb-1">Total Bids</p>
                            <p className="text-white font-semibold">{auction.bid_count}</p>
                          </div>
                          <div>
                            <p className="text-white/60 text-sm mb-1">Status</p>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              auction.status === 'live' ? 'bg-gold/20 text-gold' :
                              auction.status === 'upcoming' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-white/10 text-white/60'
                            }`}>
                              {auction.status.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <p className="text-white/60 text-sm mb-1">Start Time</p>
                            <p className="text-white text-sm">{new Date(auction.start_time).toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-white/60 text-sm mb-1">End Time</p>
                            <p className="text-white text-sm">{new Date(auction.end_time).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-gold/20">
                      {auction.status !== 'live' && (
                        <button
                          onClick={() => handleUpdateStatus(auction.id, 'live')}
                          className="px-4 py-2 bg-gold/20 text-gold rounded hover:bg-gold/30 transition text-sm"
                        >
                          Set Live
                        </button>
                      )}
                      {auction.status !== 'ended' && (
                        <button
                          onClick={() => handleUpdateStatus(auction.id, 'ended')}
                          className="px-4 py-2 bg-white/10 text-white rounded hover:bg-white/20 transition text-sm"
                        >
                          End Auction
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(auction.id)}
                        className="px-4 py-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition text-sm ml-auto"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Create Auction Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-gradient-to-br from-royal-blue/40 to-black border border-gold/30 rounded-lg p-8 max-w-md w-full">
                <h2 className="text-2xl font-serif text-white mb-6">Create New Auction</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-white/60 mb-2">Select Gem *</label>
                    <select
                      required
                      value={formData.gem_id}
                      onChange={(e) => setFormData({ ...formData, gem_id: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur border border-gold/20 rounded-lg focus:outline-none focus:border-gold text-white"
                    >
                      <option value="">Choose a gem...</option>
                      {gems.map(gem => (
                        <option key={gem.id} value={gem.id}>
                          {gem.name} ({gem.type}) - ${gem.price.toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/60 mb-2">Starting Bid ($) *</label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      value={formData.starting_bid}
                      onChange={(e) => setFormData({ ...formData, starting_bid: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur border border-gold/20 rounded-lg focus:outline-none focus:border-gold text-white"
                      placeholder="50000"
                    />
                  </div>

                  <div>
                    <label className="block text-white/60 mb-2">Start Time *</label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.start_time}
                      onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur border border-gold/20 rounded-lg focus:outline-none focus:border-gold text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-white/60 mb-2">End Time *</label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.end_time}
                      onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur border border-gold/20 rounded-lg focus:outline-none focus:border-gold text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-white/60 mb-2">Status *</label>
                    <select
                      required
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur border border-gold/20 rounded-lg focus:outline-none focus:border-gold text-white"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="live">Live</option>
                      <option value="ended">Ended</option>
                    </select>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gold text-black font-semibold rounded-lg hover:bg-gold/90 transition"
                    >
                      Create Auction
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        resetForm();
                      }}
                      className="flex-1 px-6 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition border border-gold/20"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminGuard>
  );
}
