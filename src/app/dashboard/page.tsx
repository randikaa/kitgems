'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import Avatar from '@/components/Avatar';
import Link from 'next/link';
import Link from 'next/link';
import Link from 'next/link';
import Link from 'next/link';
import Link from 'next/link';
import Link from 'next/link';
import Link from 'next/link';
import Link from 'next/link';
import Link from 'next/link';
import Link from 'next/link';
import Link from 'next/link';
import Link from 'next/link';

function ProfileTab() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    phone: '',
    avatar_url: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  async function loadProfile() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .single();

      if (error) {
        // Profile doesn't exist, create it
        if (error.code === 'PGRST116') {
          await createProfile();
          return;
        }
        throw error;
      }

      if (data) {
        setProfile({
          full_name: data.full_name || '',
          email: data.email || user!.email || '',
          phone: data.phone || '',
          avatar_url: data.avatar_url || '',
        });
      }
    } catch (error: any) {
      console.warn('Profile not found, using default values:', error?.message || 'Unknown error');
      // Set default values from user object
      setProfile({
        full_name: user!.user_metadata?.full_name || '',
        email: user!.email || '',
        phone: '',
        avatar_url: '',
      });
    } finally {
      setLoading(false);
    }
  }

  async function createProfile() {
    try {
      const { error } = await supabase.from('profiles').insert({
        id: user!.id,
        email: user!.email!,
        full_name: user!.user_metadata?.full_name || '',
      });

      if (error && !error.message.includes('duplicate')) {
        throw error;
      }

      // Reload profile after creation
      await loadProfile();
    } catch (error: any) {
      console.warn('Could not create profile, using defaults:', error?.message || 'Unknown error');
      // Set default values
      setProfile({
        full_name: user!.user_metadata?.full_name || '',
        email: user!.email || '',
        phone: '',
        avatar_url: '',
      });
      setLoading(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select an image file' });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image must be less than 5MB' });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user!.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: user!.id,
          email: user!.email!,
          full_name: profile.full_name,
          phone: profile.phone,
          avatar_url: publicUrl,
        }, {
          onConflict: 'id'
        });

      if (updateError) throw updateError;

      setProfile({ ...profile, avatar_url: publicUrl });
      setMessage({ type: 'success', text: 'Profile photo updated!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to upload image' });
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      // Use upsert to handle both insert and update
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user!.id,
          email: user!.email!,
          full_name: profile.full_name,
          phone: profile.phone,
          avatar_url: profile.avatar_url,
        }, {
          onConflict: 'id'
        });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-royal-blue/20 to-black border border-gold/20 rounded-lg p-8">
        <div className="text-center text-white/60">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-royal-blue/20 to-black border border-gold/20 rounded-lg p-8">
      <h2 className="text-2xl font-serif text-white mb-6">Profile Information</h2>
      
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-500/20 border border-green-500/50 text-green-200' 
            : 'bg-red-500/20 border border-red-500/50 text-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <div className="mb-6 flex items-center space-x-4">
        <div className="relative">
          <Avatar 
            src={profile.avatar_url}
            email={profile.email || user!.email || ''}
            alt={profile.full_name || 'User'}
            size="xl"
            onClick={() => fileInputRef.current?.click()}
          />
          {uploading && (
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <div className="absolute bottom-0 right-0 w-8 h-8 bg-gold rounded-full flex items-center justify-center cursor-pointer hover:bg-gold/90 transition">
            <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        <div>
          <p className="text-white font-semibold mb-1">Profile Picture</p>
          <p className="text-white/60 text-sm">
            {profile.avatar_url ? 'Custom photo' : 'Gmail profile photo or auto-generated'}
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-gold hover:text-gold/80 text-sm mt-1 transition"
          >
            Click to upload new photo
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-white/60 mb-2">Full Name</label>
          <input
            type="text"
            value={profile.full_name}
            onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
            className="w-full px-4 py-3 bg-white/10 backdrop-blur border border-gold/20 rounded-lg focus:outline-none focus:border-gold text-white"
            placeholder="Your full name"
          />
        </div>

        <div>
          <label className="block text-white/60 mb-2">Email</label>
          <input
            type="email"
            value={profile.email}
            disabled
            className="w-full px-4 py-3 bg-white/5 backdrop-blur border border-gold/10 rounded-lg text-white/60 cursor-not-allowed"
          />
          <p className="text-xs text-white/40 mt-1">Email cannot be changed</p>
        </div>

        <div>
          <label className="block text-white/60 mb-2">Phone</label>
          <input
            type="tel"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            className="w-full px-4 py-3 bg-white/10 backdrop-blur border border-gold/20 rounded-lg focus:outline-none focus:border-gold text-white"
            placeholder="+1 (234) 567-890"
          />
        </div>



        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-gold text-black font-semibold rounded-lg hover:bg-gold/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={loadProfile}
            className="px-6 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition border border-gold/20"
          >
            Reset
          </button>
        </div>
      </form>

      <div className="mt-8 pt-8 border-t border-gold/20">
        <h3 className="text-lg font-serif text-white mb-4">Account Information</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-white/60">User ID</span>
            <span className="text-white/80 font-mono text-xs">{user?.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Account Created</span>
            <span className="text-white/80">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Email Verified</span>
            <span className={user?.email_confirmed_at ? 'text-green-400' : 'text-yellow-400'}>
              {user?.email_confirmed_at ? '✓ Verified' : '⚠ Not verified'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'auctions' | 'wishlist'>('profile');
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [bids, setBids] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    } else if (user) {
      loadUserData();
    }
  }, [user, loading, router]);

  async function loadUserData() {
    setDataLoading(true);
    try {
      // Load orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(
            *,
            gem:gems(*)
          )
        `)
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      setOrders(ordersData || []);

      // Load bids
      const { data: bidsData } = await supabase
        .from('bids')
        .select(`
          *,
          auction:auctions(
            *,
            gem:gems(*)
          )
        `)
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      setBids(bidsData || []);

      // Load wishlist
      const { data: wishlistData } = await supabase
        .from('wishlist')
        .select(`
          *,
          gem:gems(*)
        `)
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      setWishlist(wishlistData || []);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setDataLoading(false);
    }
  }

  async function removeFromWishlist(wishlistId: string) {
    try {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('id', wishlistId);

      if (error) throw error;
      
      setWishlist(items => items.filter(item => item.id !== wishlistId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  }

  async function addToCart(gemId: string) {
    try {
      const { error } = await supabase
        .from('cart')
        .upsert({
          user_id: user!.id,
          gem_id: gemId,
          quantity: 1,
        });

      if (error) throw error;
      
      router.push('/cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-serif text-white mb-8">
          My Dashboard
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-royal-blue/20 to-black border border-gold/20 rounded-lg p-6">
              <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gold/20">
                <Avatar 
                  src={user.user_metadata?.avatar_url}
                  email={user.email || ''}
                  alt={user.user_metadata?.full_name || 'User'}
                  size="lg"
                />
                <div>
                  <h3 className="text-white font-semibold">
                    {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                  </h3>
                  <p className="text-white/60 text-sm">
                    {user.email}
                  </p>
                </div>
              </div>

              <nav className="space-y-2">
                {[
                  { id: 'profile', label: 'Profile', icon: '👤' },
                  { id: 'orders', label: 'My Orders', icon: '📦' },
                  { id: 'auctions', label: 'My Auctions', icon: '⚡' },
                  { id: 'wishlist', label: 'Wishlist', icon: '❤️' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                      activeTab === tab.id
                        ? 'bg-gold/20 text-gold border border-gold/30'
                        : 'text-white/70 hover:bg-white/5'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && <ProfileTab />}

            {activeTab === 'orders' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-serif text-white mb-6">Order History</h2>
                {dataLoading ? (
                  <div className="bg-gradient-to-br from-royal-blue/20 to-black border border-gold/20 rounded-lg p-12 text-center">
                    <div className="text-white/60">Loading orders...</div>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="bg-gradient-to-br from-royal-blue/20 to-black border border-gold/20 rounded-lg p-12 text-center">
                    <div className="text-6xl mb-4">📦</div>
                    <h3 className="text-xl text-white font-serif mb-2">No orders yet</h3>
                    <p className="text-white/60 mb-6">Start shopping to see your orders here</p>
                    <Link 
                      href="/shop"
                      className="inline-block px-6 py-3 bg-gold text-black font-semibold rounded-lg hover:bg-gold/90 transition"
                    >
                      Browse Gems
                    </Link>
                  </div>
                ) : (
                  orders.map(order => (
                    <div key={order.id} className="bg-gradient-to-br from-royal-blue/20 to-black border border-gold/20 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-white font-semibold mb-1">Order #{order.id.slice(0, 8).toUpperCase()}</h3>
                          <p className="text-white/60 text-sm">
                            Placed on {new Date(order.created_at).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          order.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                          order.status === 'shipped' ? 'bg-blue-500/20 text-blue-400' :
                          order.status === 'processing' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-gold/20 text-gold'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {order.order_items?.map((item: any) => {
                          const gem = Array.isArray(item.gem) ? item.gem[0] : item.gem;
                          return (
                            <div key={item.id} className="flex items-center space-x-4">
                              <div className="w-16 h-16 bg-gradient-to-br from-gold/20 to-royal-blue/20 rounded flex items-center justify-center">
                                💎
                              </div>
                              <div className="flex-1">
                                <p className="text-white">{gem?.name || 'Unknown Gem'}</p>
                                <p className="text-white/60 text-sm">
                                  {gem?.carat} ct • Qty: {item.quantity}
                                </p>
                              </div>
                              <p className="text-gold font-semibold">${item.price.toLocaleString()}</p>
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-4 pt-4 border-t border-gold/20 flex justify-between items-center">
                        <span className="text-white/60">Total</span>
                        <span className="text-xl text-gold font-bold">${order.total.toLocaleString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'auctions' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-serif text-white mb-6">My Auction Activity</h2>
                
                <div>
                  <h3 className="text-lg text-white mb-4">My Bids</h3>
                  {dataLoading ? (
                    <div className="bg-gradient-to-br from-royal-blue/20 to-black border border-gold/20 rounded-lg p-12 text-center">
                      <div className="text-white/60">Loading bids...</div>
                    </div>
                  ) : bids.length === 0 ? (
                    <div className="bg-gradient-to-br from-royal-blue/20 to-black border border-gold/20 rounded-lg p-12 text-center">
                      <div className="text-6xl mb-4">⚡</div>
                      <h3 className="text-xl text-white font-serif mb-2">No bids yet</h3>
                      <p className="text-white/60 mb-6">Start bidding on auctions to see your activity here</p>
                      <Link 
                        href="/auctions"
                        className="inline-block px-6 py-3 bg-gold text-black font-semibold rounded-lg hover:bg-gold/90 transition"
                      >
                        Browse Auctions
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bids.map(bid => {
                        const auction = Array.isArray(bid.auction) ? bid.auction[0] : bid.auction;
                        const gem = auction && (Array.isArray(auction.gem) ? auction.gem[0] : auction.gem);
                        const isWinning = auction && bid.amount >= auction.current_bid;
                        const isLive = auction && auction.status === 'live';
                        
                        return (
                          <div key={bid.id} className="bg-gradient-to-br from-royal-blue/20 to-black border border-gold/20 rounded-lg p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h4 className="text-white font-semibold mb-1">{gem?.name || 'Unknown Gem'}</h4>
                                <p className="text-white/60 text-sm">{gem?.carat} ct • {gem?.origin}</p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                                isLive ? 'bg-gold text-black' : 'bg-white/10 text-white/60'
                              }`}>
                                {auction?.status?.toUpperCase() || 'ENDED'}
                              </span>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-white/60">Your Bid</span>
                                <span className={isWinning ? 'text-gold font-semibold' : 'text-white'}>
                                  ${bid.amount.toLocaleString()}
                                </span>
                              </div>
                              {auction && (
                                <>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-white/60">Current Highest</span>
                                    <span className="text-gold font-semibold">${auction.current_bid.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-white/60">Status</span>
                                    <span className={isWinning ? 'text-green-400' : 'text-red-400'}>
                                      {isWinning ? '✓ Winning' : '✗ Outbid'}
                                    </span>
                                  </div>
                                </>
                              )}
                            </div>
                            {isLive && auction && (
                              <Link 
                                href={`/auctions/${auction.id}`}
                                className="block w-full mt-4 px-4 py-2 bg-gold text-black font-semibold rounded-lg hover:bg-gold/90 transition text-center"
                              >
                                {isWinning ? 'View Auction' : 'Increase Bid'}
                              </Link>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div>
                <h2 className="text-2xl font-serif text-white mb-6">My Wishlist</h2>
                {dataLoading ? (
                  <div className="bg-gradient-to-br from-royal-blue/20 to-black border border-gold/20 rounded-lg p-12 text-center">
                    <div className="text-white/60">Loading wishlist...</div>
                  </div>
                ) : wishlist.length === 0 ? (
                  <div className="bg-gradient-to-br from-royal-blue/20 to-black border border-gold/20 rounded-lg p-12 text-center">
                    <div className="text-6xl mb-4">❤️</div>
                    <h3 className="text-xl text-white font-serif mb-2">Your wishlist is empty</h3>
                    <p className="text-white/60 mb-6">Save your favorite gems to your wishlist</p>
                    <Link 
                      href="/shop"
                      className="inline-block px-6 py-3 bg-gold text-black font-semibold rounded-lg hover:bg-gold/90 transition"
                    >
                      Browse Gems
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {wishlist.map(item => {
                      const gem = Array.isArray(item.gem) ? item.gem[0] : item.gem;
                      return (
                        <div key={item.id} className="bg-gradient-to-br from-royal-blue/20 to-black border border-gold/20 rounded-lg overflow-hidden group">
                          <Link href={`/shop/${gem.id}`} className="block aspect-square bg-gradient-to-br from-royal-blue/10 to-black relative overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gold/30 to-royal-blue/30 blur-2xl group-hover:scale-150 transition-transform duration-500" />
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-6xl opacity-50 group-hover:scale-110 transition-transform duration-300">💎</div>
                            </div>
                          </Link>
                          <div className="p-4">
                            <Link href={`/shop/${gem.id}`}>
                              <h3 className="text-white font-semibold mb-1 hover:text-gold transition">{gem.name}</h3>
                            </Link>
                            <p className="text-white/60 text-sm mb-2">{gem.carat} ct • {gem.origin}</p>
                            <p className="text-gold font-semibold mb-3">${gem.price.toLocaleString()}</p>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => addToCart(gem.id)}
                                className="flex-1 px-4 py-2 bg-gold text-black font-semibold rounded-lg hover:bg-gold/90 transition"
                              >
                                Add to Cart
                              </button>
                              <button 
                                onClick={() => removeFromWishlist(item.id)}
                                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-red-500/20 hover:text-red-400 transition"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
