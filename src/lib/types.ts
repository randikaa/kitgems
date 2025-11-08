// Core types for KIT GEMS - matching database schema

export interface Gem {
    id: string;
    name: string;
    type: 'sapphire' | 'ruby' | 'emerald' | 'diamond' | 'quartz' | 'other';
    description: string;
    price: number;
    carat: number;
    color: string;
    origin: string;
    cut: string;
    clarity: string;
    images: string[];
    certification?: string;
    in_stock: boolean;
    featured?: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface Auction {
    id: string;
    gem_id: string;
    gem?: Gem;
    starting_bid: number;
    current_bid: number;
    bid_count: number;
    start_time: string;
    end_time: string;
    status: 'upcoming' | 'live' | 'ended';
    winner_id?: string;
    bids?: Bid[];
    created_at?: string;
    updated_at?: string;
}

export interface AuctionWithGem extends Omit<Auction, 'gem'> {
    gem: Gem;
    startTime: Date;
    endTime: Date;
}

export interface Bid {
    id: string;
    auction_id: string;
    user_id: string;
    amount: number;
    created_at: string;
    user?: {
        full_name: string;
        email?: string;
    };
}

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}

export interface CartItem {
    gem: Gem;
    quantity: number;
}

export interface Order {
    id: string;
    userId: string;
    items: CartItem[];
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered';
    createdAt: Date;
    shippingAddress: Address;
}

export interface Address {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
}
