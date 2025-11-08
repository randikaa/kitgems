import { supabase } from './client';
import { Database } from './database.types';

type Gem = Database['public']['Tables']['gems']['Row'];
type Auction = Database['public']['Tables']['auctions']['Row'];
type Bid = Database['public']['Tables']['bids']['Row'];
type Order = Database['public']['Tables']['orders']['Row'];

// Gems API
export async function getGems(filters?: {
  type?: string;
  featured?: boolean;
  inStock?: boolean;
}) {
  let query = supabase.from('gems').select('*');

  if (filters?.type) {
    query = query.eq('type', filters.type);
  }
  if (filters?.featured !== undefined) {
    query = query.eq('featured', filters.featured);
  }
  if (filters?.inStock !== undefined) {
    query = query.eq('in_stock', filters.inStock);
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function getGemById(id: string) {
  const { data, error } = await supabase
    .from('gems')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

export async function searchGems(query: string) {
  const { data, error } = await supabase
    .from('gems')
    .select('*')
    .or(`name.ilike.%${query}%,type.ilike.%${query}%,origin.ilike.%${query}%`)
    .limit(10);
  
  if (error) throw error;
  return data;
}

// Auctions API
export async function getAuctions(status?: 'upcoming' | 'live' | 'ended') {
  let query = supabase
    .from('auctions')
    .select(`
      *,
      gem:gems(*)
    `);

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query.order('end_time', { ascending: true });
  
  if (error) throw error;
  return data;
}

export async function getAuctionById(id: string) {
  const { data, error } = await supabase
    .from('auctions')
    .select(`
      *,
      gem:gems(*),
      bids(
        *,
        user:profiles(full_name)
      )
    `)
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

export async function placeBid(auctionId: string, userId: string, amount: number) {
  const { data, error } = await supabase
    .from('bids')
    .insert({
      auction_id: auctionId,
      user_id: userId,
      amount,
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Cart API
export async function getCart(userId: string) {
  const { data, error } = await supabase
    .from('cart')
    .select(`
      *,
      gem:gems(*)
    `)
    .eq('user_id', userId);
  
  if (error) throw error;
  return data;
}

export async function addToCart(userId: string, gemId: string, quantity: number = 1) {
  const { data, error } = await supabase
    .from('cart')
    .upsert({
      user_id: userId,
      gem_id: gemId,
      quantity,
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function removeFromCart(userId: string, gemId: string) {
  const { error } = await supabase
    .from('cart')
    .delete()
    .eq('user_id', userId)
    .eq('gem_id', gemId);
  
  if (error) throw error;
}

export async function updateCartQuantity(userId: string, gemId: string, quantity: number) {
  const { data, error } = await supabase
    .from('cart')
    .update({ quantity })
    .eq('user_id', userId)
    .eq('gem_id', gemId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Wishlist API
export async function getWishlist(userId: string) {
  const { data, error } = await supabase
    .from('wishlist')
    .select(`
      *,
      gem:gems(*)
    `)
    .eq('user_id', userId);
  
  if (error) throw error;
  return data;
}

export async function addToWishlist(userId: string, gemId: string) {
  const { data, error } = await supabase
    .from('wishlist')
    .insert({
      user_id: userId,
      gem_id: gemId,
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function removeFromWishlist(userId: string, gemId: string) {
  const { error } = await supabase
    .from('wishlist')
    .delete()
    .eq('user_id', userId)
    .eq('gem_id', gemId);
  
  if (error) throw error;
}

// Orders API
export async function getOrders(userId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items(
        *,
        gem:gems(*)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function createOrder(
  userId: string,
  items: { gem_id: string; quantity: number; price: number }[],
  total: number,
  shippingAddress: any
) {
  // Create order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      total,
      shipping_address: shippingAddress,
      status: 'pending',
    })
    .select()
    .single();
  
  if (orderError) throw orderError;

  // Create order items
  const orderItems = items.map(item => ({
    order_id: order.id,
    gem_id: item.gem_id,
    quantity: item.quantity,
    price: item.price,
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);
  
  if (itemsError) throw itemsError;

  // Clear cart
  const { error: cartError } = await supabase
    .from('cart')
    .delete()
    .eq('user_id', userId);
  
  if (cartError) throw cartError;

  return order;
}

// Reviews API
export async function getReviews(gemId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      user:profiles(full_name, avatar_url)
    `)
    .eq('gem_id', gemId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function createReview(
  gemId: string,
  userId: string,
  rating: number,
  comment?: string
) {
  const { data, error } = await supabase
    .from('reviews')
    .insert({
      gem_id: gemId,
      user_id: userId,
      rating,
      comment,
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Profile API
export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateProfile(
  userId: string,
  updates: {
    full_name?: string;
    phone?: string;
    avatar_url?: string;
  }
) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}
