'use client';

import { useState } from 'react';
import Link from 'next/link';
import { resetPassword } from '@/lib/supabase/auth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="bg-gradient-to-br from-royal-blue/20 to-black border border-gold/20 rounded-lg p-8 text-center">
            <div className="text-6xl mb-4">📧</div>
            <h2 className="text-2xl font-serif text-white mb-4">Check Your Email</h2>
            <p className="text-white/60 mb-6">
              We've sent a password reset link to <strong className="text-white">{email}</strong>
            </p>
            <p className="text-white/60 text-sm mb-6">
              Click the link in the email to reset your password.
            </p>
            <Link
              href="/auth/signin"
              className="inline-block px-6 py-3 bg-gold text-black font-semibold rounded-lg hover:bg-gold/90 transition"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
            Reset Password
          </h1>
          <p className="text-white/60">Enter your email to receive a reset link</p>
        </div>

        <div className="bg-gradient-to-br from-royal-blue/20 to-black border border-gold/20 rounded-lg p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-white mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/10 backdrop-blur border border-gold/20 rounded-lg focus:outline-none focus:border-gold text-white placeholder-white/40"
                placeholder="your@email.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gold text-black font-semibold rounded-lg hover:bg-gold/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <p className="mt-6 text-center text-white/60 text-sm">
            Remember your password?{' '}
            <Link href="/auth/signin" className="text-gold hover:text-gold/80 transition font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
