# 💎 KIT GEMS - Luxury Gemstone Marketplace

A full-featured, luxury eCommerce and auction platform for rare gemstones. Built with Next.js 16, React 19, TypeScript, and Tailwind CSS 4.

## ✨ Features

### Core Functionality
- **Direct Sales**: Browse and purchase certified gemstones
- **Live Auctions**: Real-time bidding on rare gems with countdown timers
- **User Dashboard**: Track orders, bids, wishlist, and profile
- **Shopping Cart**: Full cart management with checkout flow
- **Product Details**: 360° viewers, specifications, and certification info
- **Auction Details**: Live bid tracking, bid history, and auto-bid options

### Authentication
- **Email/Password**: Secure sign up and sign in
- **Google OAuth**: One-click sign in with Google
- **Password Reset**: Email-based password recovery
- **Email Verification**: Confirm email addresses
- **Session Management**: Automatic session handling
- **Protected Routes**: Secure user-specific pages

### Design & UX
- **Luxury Aesthetic**: Deep black (#0A0A0A), royal blue (#243B6B), and gold (#D4AF37) color scheme
- **Glassmorphism UI**: Modern glass effects with gemstone glow animations
- **Responsive Design**: Mobile-first approach, works on all devices
- **Smooth Animations**: Fade-ins, hover effects, and real-time updates
- **Typography**: Playfair Display (serif) for headings, Inter for body text

### Pages Included
1. **Home** - Hero section, featured auctions, shop by category, testimonials
2. **Auctions** - Grid of live auctions with filtering and sorting
3. **Shop** - Product catalog with advanced filters (type, price, etc.)
4. **Product Detail** - Full gem specifications and purchase options
5. **Auction Detail** - Live bidding interface with real-time updates
6. **Dashboard** - User profile, orders, auction activity, wishlist
7. **Cart** - Shopping cart with order summary
8. **About** - Brand story and value propositions
9. **Contact** - Contact form and information
10. **Sign In/Sign Up** - Complete authentication with email and Google OAuth
11. **Password Reset** - Forgot password flow

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (or npm/yarn)

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Set up Supabase (see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)):
```bash
cp .env.local.example .env.local
# Add your Supabase credentials to .env.local
```

3. Run the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── page.tsx             # Home page
│   ├── auctions/            # Auction pages
│   ├── shop/                # Shop pages
│   ├── dashboard/           # User dashboard
│   ├── cart/                # Shopping cart
│   ├── about/               # About page
│   └── contact/             # Contact page
├── components/              # Reusable UI components
│   ├── Header.tsx           # Navigation header
│   ├── Footer.tsx           # Site footer
│   ├── GemCard.tsx          # Product card
│   └── AuctionCard.tsx      # Auction card with timer
└── lib/                     # Utilities and data
    ├── types.ts             # TypeScript interfaces
    ├── data.ts              # Mock data
    └── utils.ts             # Helper functions
```

## 🎨 Design System

### Colors
- **Black**: `#0A0A0A` - Primary background
- **Royal Blue**: `#243B6B` - Accent color
- **Gold**: `#D4AF37` - Primary accent, CTAs

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)

### Components
- Glassmorphism cards with backdrop blur
- Gold border accents on hover
- Gradient backgrounds (royal-blue to black)
- Gemstone glow effects with blur and pulse animations

## 🔧 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Fonts**: Google Fonts (Playfair Display, Inter)

## 🗄️ Database

KIT GEMS uses **Supabase** (PostgreSQL) for data management:

- **Tables**: gems, auctions, bids, orders, cart, wishlist, reviews, profiles
- **Row Level Security**: User data protection
- **Real-time subscriptions**: Live auction updates
- **Authentication**: Built-in user management
- **Storage**: Image uploads for gems

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for complete setup instructions.

## 🎯 Future Enhancements

- **Real-time Auctions**: WebSocket integration (Supabase Realtime)
- **Payment Integration**: Stripe, PayPal, crypto payments
- **Email Notifications**: Bid updates, auction results (Supabase Edge Functions)
- **AI Recommendations**: Personalized gem suggestions
- **Admin Dashboard**: Manage products, auctions, users
- **Advanced Search**: Full-text search with PostgreSQL
- **Image Storage**: Supabase Storage for gem photos
- **Reviews System**: Already in database schema
- **SEO**: Schema markup, meta tags, sitemap

## 📝 Database Schema

The Supabase database includes:

### Tables
- **profiles** - User profiles and settings
- **gems** - Gemstone products with details
- **auctions** - Live auction listings
- **bids** - Auction bid history
- **orders** - Customer orders
- **order_items** - Items in each order
- **cart** - Shopping cart items
- **wishlist** - User wishlists
- **reviews** - Product reviews and ratings

### Features
- Row Level Security (RLS) policies
- Automatic timestamps
- Foreign key constraints
- Optimized indexes
- Real-time subscriptions
- Triggers for bid updates

## 🚀 Production Deployment

For production use:

1. **Database**: Already configured with Supabase ✅
2. **Authentication**: Implement auth UI with Supabase Auth
3. **Real-time**: Enable Supabase Realtime for live auctions
4. **Payments**: Integrate Stripe or PayPal
5. **Email**: Set up Supabase Edge Functions for notifications
6. **Storage**: Configure Supabase Storage for images
7. **Deploy**: Deploy to Vercel (recommended) or your platform
8. **Domain**: Configure custom domain and SSL

## 📄 License

MIT License - feel free to use this for your projects!

---

Built with 💎 by Kiro
