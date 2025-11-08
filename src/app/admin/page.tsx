'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import AdminGuard from '@/components/AdminGuard';

interface Stats {
  totalUsers: number;
  totalGems: number;
  totalAuctions: number;
  totalOrders: number;
  totalRevenue: number;
  activeAuctions: number;
  recentUsers: number;
  avgOrderValue: number;
}

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalGems: 0,
    totalAuctions: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeAuctions: 0,
    recentUsers: 0,
    avgOrderValue: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    } else if (user) {
      loadStats();
    }
  }, [user, loading, router]);

  async function loadStats() {
    try {
      setLoadingStats(true);

      // Get total users
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get total gems
      const { count: gemsCount } = await supabase
        .from('gems')
        .select('*', { count: 'exact', head: true });

      // Get total auctions
      const { count: auctionsCount } = await supabase
        .from('auctions')
        .select('*', { count: 'exact', head: true });

      // Get active auctions
      const { count: activeAuctionsCount } = await supabase
        .from('auctions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'live');

      // Get total orders
      const { count: ordersCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

      // Get total revenue
const { data: ordersData } = await supabase
  .from('orders')
  .select('total')
  .returns<{ total: number | string | null }[]>(); 

const totalRevenue = (ordersData ?? []).reduce(
  (sum, order) => sum + Number(order.total ?? 0),
  0
);
const avgOrderValue = ordersCount ? totalRevenue / ordersCount : 0;


      // Get recent users (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { count: recentUsersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo.toISOString());

      setStats({
        totalUsers: usersCount || 0,
        totalGems: gemsCount || 0,
        totalAuctions: auctionsCount || 0,
        totalOrders: ordersCount || 0,
        totalRevenue,
        activeAuctions: activeAuctionsCount || 0,
        recentUsers: recentUsersCount || 0,
        avgOrderValue,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoadingStats(false);
    }
  }

  if (loading || loadingStats) {
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center">
        <div className="text-white text-lg">Loading admin dashboard...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: 'from-blue-500/20 to-blue-600/20', link: '/admin/users' },
    { label: 'Total Gems', value: stats.totalGems, icon: '💎', color: 'from-purple-500/20 to-purple-600/20', link: '/admin/gems' },
    { label: 'Active Auctions', value: stats.activeAuctions, icon: '⚡', color: 'from-gold/20 to-gold/30', link: '/admin/auctions' },
    { label: 'Total Orders', value: stats.totalOrders, icon: '📦', color: 'from-green-500/20 to-green-600/20', link: '/admin/orders' },
    { label: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: '💰', color: 'from-emerald-500/20 to-emerald-600/20' },
    { label: 'Avg Order Value', value: `$${stats.avgOrderValue.toFixed(0)}`, icon: '📊', color: 'from-cyan-500/20 to-cyan-600/20' },
    { label: 'New Users (7d)', value: stats.recentUsers, icon: '🆕', color: 'from-pink-500/20 to-pink-600/20' },
    { label: 'Total Auctions', value: stats.totalAuctions, icon: '🔨', color: 'from-orange-500/20 to-orange-600/20' },
  ];

  return (
    <AdminGuard>
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl font-serif text-white mb-4">
            Admin Dashboard
          </h1>
          <p className="text-white/60 text-lg">
            Manage your gemstone marketplace
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((stat, index) => (
            <Link
              key={index}
              href={stat.link || '#'}
              className={`bg-gradient-to-br ${stat.color} border border-gold/20 rounded-lg p-6 hover:border-gold/40 transition group`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">{stat.icon}</span>
                <svg className="w-5 h-5 text-white/40 group-hover:text-gold transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-white/60 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            href="/admin/users"
            className="bg-gradient-to-br from-royal-blue/20 to-black border border-gold/20 rounded-lg p-6 hover:border-gold transition group"
          >
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-serif text-white mb-2 group-hover:text-gold transition">
              Manage Users
            </h3>
            <p className="text-white/60 text-sm">
              View, edit, and manage user accounts
            </p>
          </Link>

          <Link
            href="/admin/gems"
            className="bg-gradient-to-br from-royal-blue/20 to-black border border-gold/20 rounded-lg p-6 hover:border-gold transition group"
          >
            <div className="text-4xl mb-4">💎</div>
            <h3 className="text-xl font-serif text-white mb-2 group-hover:text-gold transition">
              Manage Gems
            </h3>
            <p className="text-white/60 text-sm">
              Add, edit, and delete gemstones
            </p>
          </Link>

          <Link
            href="/admin/auctions"
            className="bg-gradient-to-br from-royal-blue/20 to-black border border-gold/20 rounded-lg p-6 hover:border-gold transition group"
          >
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-serif text-white mb-2 group-hover:text-gold transition">
              Manage Auctions
            </h3>
            <p className="text-white/60 text-sm">
              Create and manage live auctions
            </p>
          </Link>

          <Link
            href="/admin/orders"
            className="bg-gradient-to-br from-royal-blue/20 to-black border border-gold/20 rounded-lg p-6 hover:border-gold transition group"
          >
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-xl font-serif text-white mb-2 group-hover:text-gold transition">
              Manage Orders
            </h3>
            <p className="text-white/60 text-sm">
              View and process customer orders
            </p>
          </Link>
        </div>
        </div>
      </div>
    </AdminGuard>
  );
}
