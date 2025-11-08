'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import Avatar from '@/components/Avatar';
import AdminGuard from '@/components/AdminGuard';

interface User {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  is_admin: boolean;
}

export default function UsersManagement() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    } else if (user) {
      loadUsers();
    }
  }, [user, loading, router]);

  async function loadUsers() {
    try {
      setLoadingUsers(true);
      const { data, error, count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      console.log('Users query result:', { data, error, count, dataLength: data?.length });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Setting users:', data);
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      alert('Error loading users. Check console for details.');
    } finally {
      setLoadingUsers(false);
    }
  }

  async function handleDeleteUser(userId: string) {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;
      
      setUsers(users.filter(u => u.id !== userId));
      alert('User deleted successfully');
    } catch (error: any) {
      alert('Error deleting user: ' + error.message);
    }
  }

  async function handleToggleAdmin(userId: string, currentStatus: boolean) {
    if (!confirm(`Are you sure you want to ${currentStatus ? 'remove admin access from' : 'make'} this user ${currentStatus ? '' : 'an admin'}?`)) {
      return;
    }

    try {
      const profiles = supabase.from('profiles') as any;
      const { error } = await profiles
        .update({ is_admin: !currentStatus })
        .eq('id', userId);

      if (error) throw error;

      setUsers(users.map(u => u.id === userId ? { ...u, is_admin: !currentStatus } : u));
      alert(`User ${currentStatus ? 'removed from' : 'promoted to'} admin successfully`);
    } catch (error: any) {
      alert('Error updating admin status: ' + error.message);
    }
  }

  async function handleUpdateUser(updatedUser: User) {
    try {
      const profiles = supabase.from('profiles') as any;
      const { error } = await profiles
        .update({
          full_name: updatedUser.full_name,
          phone: updatedUser.phone,
        })
        .eq('id', updatedUser.id);

      if (error) throw error;

      setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
      setShowEditModal(false);
      setSelectedUser(null);
      alert('User updated successfully');
    } catch (error: any) {
      alert('Error updating user: ' + error.message);
    }
  }

  const filteredUsers = users.filter(u =>
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading || loadingUsers) {
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center">
        <div className="text-white text-lg">Loading users...</div>
      </div>
    );
  }

  return (
    <AdminGuard>
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin" className="text-gold hover:text-gold/80 transition text-sm mb-2 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-2">
              Users Management
            </h1>
            <p className="text-white/60">
              Total: {users.length} users
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by email or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-96 px-4 py-3 bg-white/10 backdrop-blur border border-gold/20 rounded-lg focus:outline-none focus:border-gold text-white placeholder-white/40"
          />
        </div>

        {/* Users Table */}
        <div className="bg-gradient-to-br from-royal-blue/20 to-black border border-gold/20 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-gold/20">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Phone</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Joined</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-white">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/10">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-white/5 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <Avatar
                          src={u.avatar_url}
                          email={u.email}
                          alt={u.full_name || 'User'}
                          size="sm"
                        />
                        <span className="text-white font-medium">
                          {u.full_name || 'No name'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white/80">{u.email}</td>
                    <td className="px-6 py-4 text-white/80">{u.phone || '-'}</td>
                    <td className="px-6 py-4">
                      {u.is_admin ? (
                        <span className="px-3 py-1 bg-gold/20 text-gold rounded-full text-xs font-semibold">
                          Admin
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-white/10 text-white/60 rounded-full text-xs">
                          User
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-white/80">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleToggleAdmin(u.id, u.is_admin)}
                        className={`${u.is_admin ? 'text-orange-400 hover:text-orange-300' : 'text-green-400 hover:text-green-300'} transition mr-4`}
                        title={u.is_admin ? 'Remove Admin' : 'Make Admin'}
                      >
                        {u.is_admin ? '👤 Demote' : '⭐ Promote'}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(u);
                          setShowEditModal(true);
                        }}
                        className="text-gold hover:text-gold/80 transition mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="text-red-400 hover:text-red-300 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Modal */}
        {showEditModal && selectedUser && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-royal-blue/40 to-black border border-gold/30 rounded-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-serif text-white mb-6">Edit User</h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-white/60 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={selectedUser.full_name || ''}
                    onChange={(e) => setSelectedUser({ ...selectedUser, full_name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur border border-gold/20 rounded-lg focus:outline-none focus:border-gold text-white"
                  />
                </div>

                <div>
                  <label className="block text-white/60 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={selectedUser.phone || ''}
                    onChange={(e) => setSelectedUser({ ...selectedUser, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur border border-gold/20 rounded-lg focus:outline-none focus:border-gold text-white"
                  />
                </div>

                <div>
                  <label className="block text-white/60 mb-2">Email (read-only)</label>
                  <input
                    type="email"
                    value={selectedUser.email}
                    disabled
                    className="w-full px-4 py-3 bg-white/5 border border-gold/10 rounded-lg text-white/60 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => handleUpdateUser(selectedUser)}
                  className="flex-1 px-6 py-3 bg-gold text-black font-semibold rounded-lg hover:bg-gold/90 transition"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedUser(null);
                  }}
                  className="flex-1 px-6 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition border border-gold/20"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </AdminGuard>
  );
}
