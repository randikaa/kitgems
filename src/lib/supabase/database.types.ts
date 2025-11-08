export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      gems: {
        Row: {
          id: string
          name: string
          type: 'sapphire' | 'ruby' | 'emerald' | 'diamond' | 'quartz' | 'other'
          description: string | null
          price: number
          carat: number
          color: string
          origin: string
          cut: string
          clarity: string
          images: string[]
          certification: string | null
          in_stock: boolean
          featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: 'sapphire' | 'ruby' | 'emerald' | 'diamond' | 'quartz' | 'other'
          description?: string | null
          price: number
          carat: number
          color: string
          origin: string
          cut: string
          clarity: string
          images?: string[]
          certification?: string | null
          in_stock?: boolean
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'sapphire' | 'ruby' | 'emerald' | 'diamond' | 'quartz' | 'other'
          description?: string | null
          price?: number
          carat?: number
          color?: string
          origin?: string
          cut?: string
          clarity?: string
          images?: string[]
          certification?: string | null
          in_stock?: boolean
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      auctions: {
        Row: {
          id: string
          gem_id: string
          starting_bid: number
          current_bid: number
          bid_count: number
          start_time: string
          end_time: string
          status: 'upcoming' | 'live' | 'ended'
          winner_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          gem_id: string
          starting_bid: number
          current_bid: number
          bid_count?: number
          start_time: string
          end_time: string
          status?: 'upcoming' | 'live' | 'ended'
          winner_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          gem_id?: string
          starting_bid?: number
          current_bid?: number
          bid_count?: number
          start_time?: string
          end_time?: string
          status?: 'upcoming' | 'live' | 'ended'
          winner_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      bids: {
        Row: {
          id: string
          auction_id: string
          user_id: string
          amount: number
          created_at: string
        }
        Insert: {
          id?: string
          auction_id: string
          user_id: string
          amount: number
          created_at?: string
        }
        Update: {
          id?: string
          auction_id?: string
          user_id?: string
          amount?: number
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          total: number
          status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          shipping_address: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          total: number
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          shipping_address: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          total?: number
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          shipping_address?: Json
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          gem_id: string
          quantity: number
          price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          gem_id: string
          quantity?: number
          price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          gem_id?: string
          quantity?: number
          price?: number
          created_at?: string
        }
      }
      wishlist: {
        Row: {
          id: string
          user_id: string
          gem_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          gem_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          gem_id?: string
          created_at?: string
        }
      }
      cart: {
        Row: {
          id: string
          user_id: string
          gem_id: string
          quantity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          gem_id: string
          quantity?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          gem_id?: string
          quantity?: number
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          gem_id: string
          user_id: string
          rating: number
          comment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          gem_id: string
          user_id: string
          rating: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          gem_id?: string
          user_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}
