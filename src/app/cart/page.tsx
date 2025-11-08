'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Gem } from '@/lib/types';

interface CartItem {
  id: string;
  gem_id: string;
  quantity: number;
  gem: Gem;
}

export default function CartPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin');
    } else if (user) {
      loadCart();
    }
  }, [user, authLoading, router]);

  async function loadCart() {
    try {
      const { data, error } = await supabase
        .from('cart')
        .select(`
          *,
          gem:gems(*)
        `)
        .eq('user_id', user!.id);

      if (error) throw error;
      
      const items: CartItem[] = (data || []).map((item: any) => ({
        id: item.id,
        gem_id: item.gem_id,
        quantity: item.quantity,
        gem: Array.isArray(item.gem) ? item.gem[0] : item.gem,
      }));
      
      setCartItems(items);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateQuantity(itemId: string, newQuantity: number) {
    if (newQuantity < 1) return;
    
    try {
      const { error } = await supabase
        .from('cart')
        .update({ quantity: newQuantity })
        .eq('id', itemId);

      if (error) throw error;
      
      setCartItems(items =>
        items.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  }

  async function removeItem(itemId: string) {
    try {
      const { error } = await supabase
        .from('cart')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      
      setCartItems(items => items.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error removing item:', error);
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center">
        <div className="text-white text-lg">Loading cart...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.gem.price * item.quantity, 0);
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-serif text-white mb-8">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.length === 0 ? (
              <div className="bg-gradient-to-br from-royal-blue/20 to-black border border-gold/20 rounded-lg p-12 text-center">
                <div className="text-6xl mb-4">🛒</div>
                <h3 className="text-2xl text-white font-serif mb-2">Your cart is empty</h3>
                <p className="text-white/60 mb-6">Start adding some beautiful gems to your collection</p>
                <Link 
                  href="/shop"
                  className="inline-block px-6 py-3 bg-gold text-black font-semibold rounded-lg hover:bg-gold/90 transition"
                >
                  Browse Gems
                </Link>
              </div>
            ) : (
              <>
                {cartItems.map(item => (
                  <div key={item.id} className="bg-gradient-to-br from-royal-blue/20 to-black border border-gold/20 rounded-lg p-6">
                    <div className="flex gap-6">
                      <Link href={`/shop/${item.gem_id}`} className="w-24 h-24 bg-gradient-to-br from-gold/20 to-royal-blue/20 rounded-lg flex items-center justify-center flex-shrink-0 hover:scale-105 transition">
                        <span className="text-4xl">💎</span>
                      </Link>
                      
                      <div className="flex-1">
                        <Link href={`/shop/${item.gem_id}`}>
                          <h3 className="text-xl text-white font-semibold mb-2 hover:text-gold transition">{item.gem.name}</h3>
                        </Link>
                        <p className="text-white/60 text-sm mb-4">{item.gem.carat} ct • {item.gem.origin}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 bg-white/10 rounded border border-gold/20 hover:border-gold transition flex items-center justify-center text-white"
                            >
                              −
                            </button>
                            <span className="text-white font-semibold">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 bg-white/10 rounded border border-gold/20 hover:border-gold transition flex items-center justify-center text-white"
                            >
                              +
                            </button>
                          </div>
                          
                          <div className="flex items-center space-x-6">
                            <p className="text-2xl text-gold font-semibold">
                              {formatPrice(item.gem.price * item.quantity)}
                            </p>
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="text-white/60 hover:text-red-400 transition"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {cartItems.length > 0 && (
              <Link 
                href="/shop"
                className="inline-flex items-center space-x-2 text-gold hover:text-gold/80 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Continue Shopping</span>
              </Link>
            )}
          </div>

          {/* Order Summary */}
          {cartItems.length > 0 && (
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-royal-blue/20 to-black border border-gold/20 rounded-lg p-6 sticky top-24">
                <h2 className="text-2xl font-serif text-white mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-white/80">
                    <span>Subtotal ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-white/80">
                    <span>Shipping</span>
                    <span className="text-gold">Free</span>
                  </div>
                  <div className="pt-4 border-t border-gold/20 flex justify-between text-xl">
                    <span className="text-white font-semibold">Total</span>
                    <span className="text-gold font-bold">{formatPrice(total)}</span>
                  </div>
                </div>

                <button className="w-full px-6 py-4 bg-gold text-black font-semibold rounded-lg hover:bg-gold/90 transition mb-4">
                  Proceed to Checkout
                </button>

                <div className="space-y-3 text-sm text-white/60">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Free insured shipping</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>30-day return policy</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
