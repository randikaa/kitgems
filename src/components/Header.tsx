'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { gems, auctions } from '@/lib/data';
import { useTheme, themes, Theme } from '@/lib/theme-context';
import { useAuth } from '@/contexts/AuthContext';
import { signOut } from '@/lib/supabase/auth';
import Avatar from '@/components/Avatar';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { theme, setTheme, mode, setMode } = useTheme();
  const { user, loading } = useAuth();
  const themeRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (themeRef.current && !themeRef.current.contains(event.target as Node)) {
        setThemeOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const searchResults = searchQuery.length > 0
    ? [
      ...gems.filter(g =>
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.origin.toLowerCase().includes(searchQuery.toLowerCase())
      ).map(g => ({ ...g, type: 'gem' as const })),
      ...auctions.filter(a =>
        a.gem && (
          a.gem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.gem.type.toLowerCase().includes(searchQuery.toLowerCase())
        )
      ).map(a => ({ ...a, type: 'auction' as const }))
    ].slice(0, 5)
    : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-gold/20">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-gold to-gold/60 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-xl">K</span>
              </div>
              <span className="text-2xl font-serif text-white">KIT GEMS</span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="/auctions" className="text-white/80 hover:text-gold transition">
                Auctions
              </Link>
              <Link href="/shop" className="text-white/80 hover:text-gold transition">
                Shop
              </Link>
              <Link href="/about" className="text-white/80 hover:text-gold transition">
                About
              </Link>
              <Link href="/contact" className="text-white/80 hover:text-gold transition">
                Contact
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => setSearchOpen(true)}
                className="text-white/80 hover:text-gold transition"
                title="Search"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              <button
                onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
                className="text-white/80 hover:text-gold transition"
                title={mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {mode === 'dark' ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              <div className="relative" ref={themeRef}>
                <button
                  onClick={() => setThemeOpen(!themeOpen)}
                  className="text-white/80 hover:text-gold transition text-2xl"
                  title="Change Theme"
                >
                  {themes[theme].emoji}
                </button>

                {themeOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gradient-to-br from-royal-blue/40 to-black backdrop-blur-md border border-gold/30 rounded-lg shadow-xl overflow-hidden z-50">
                    {(Object.keys(themes) as Theme[]).map((t) => (
                      <button
                        key={t}
                        onClick={() => {
                          setTheme(t);
                          setThemeOpen(false);
                        }}
                        className={`w-full px-4 py-3 flex items-center space-x-3 hover:bg-white/10 transition ${theme === t ? 'bg-gold/20 text-gold' : 'text-white'
                          }`}
                      >
                        <span className="text-xl">{themes[t].emoji}</span>
                        <span className="font-semibold">{themes[t].name}</span>
                        {theme === t && (
                          <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {!loading && (
                user ? (
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="hover:opacity-80 transition"
                      title="Account"
                    >
                      <Avatar
                        src={user.user_metadata?.avatar_url}
                        email={user.email || ''}
                        alt={user.user_metadata?.full_name || 'User'}
                        size="sm"
                      />
                    </button>

                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-gradient-to-br from-royal-blue/40 to-black backdrop-blur-md border border-gold/30 rounded-lg shadow-xl overflow-hidden z-50">
                        <div className="px-4 py-3 border-b border-gold/20">
                          <p className="text-sm text-white/60">Signed in as</p>
                          <p className="text-sm text-white font-semibold truncate">{user.email}</p>
                        </div>
                        <Link
                          href="/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-3 text-white hover:bg-white/10 transition"
                        >
                          Dashboard
                        </Link>
                        <Link
                          href="/dashboard?tab=orders"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-3 text-white hover:bg-white/10 transition"
                        >
                          My Orders
                        </Link>
                        <Link
                          href="/dashboard?tab=wishlist"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-3 text-white hover:bg-white/10 transition"
                        >
                          Wishlist
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-4 py-3 text-red-400 hover:bg-white/10 transition border-t border-gold/20"
                        >
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link href="/auth/signin" className="text-white/80 hover:text-gold transition" title="Sign In">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                  </Link>
                )
              )}
              <Link href="/cart" className="text-white/80 hover:text-gold transition relative" title="Cart">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold rounded-full text-black text-xs flex items-center justify-center font-bold">
                  2
                </span>
              </Link>
            </div>

            <button
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-4">
              <button
                onClick={() => {
                  setSearchOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left text-white/80 hover:text-gold transition"
              >
                Search
              </button>

              <div className="border-t border-gold/20 pt-4">
                <p className="text-white/60 text-sm mb-2 px-2">Appearance</p>
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setMode('dark')}
                    className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition ${mode === 'dark'
                      ? 'bg-gold/20 text-gold border border-gold/30'
                      : 'bg-white/5 text-white/80 border border-gold/10 hover:border-gold/30'
                      }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                    <span className="text-sm font-semibold">Dark</span>
                  </button>
                  <button
                    onClick={() => setMode('light')}
                    className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition ${mode === 'light'
                      ? 'bg-gold/20 text-gold border border-gold/30'
                      : 'bg-white/5 text-white/80 border border-gold/10 hover:border-gold/30'
                      }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span className="text-sm font-semibold">Light</span>
                  </button>
                </div>

                <p className="text-white/60 text-sm mb-2 px-2">Color Theme</p>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(themes) as Theme[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setTheme(t);
                      }}
                      className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition ${theme === t
                        ? 'bg-gold/20 text-gold border border-gold/30'
                        : 'bg-white/5 text-white/80 border border-gold/10 hover:border-gold/30'
                        }`}
                    >
                      <span>{themes[t].emoji}</span>
                      <span className="text-sm font-semibold">{themes[t].name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-gold/20 pt-4">
                <Link href="/auctions" className="block text-white/80 hover:text-gold transition py-2">
                  Auctions
                </Link>
                <Link href="/shop" className="block text-white/80 hover:text-gold transition py-2">
                  Shop
                </Link>
                <Link href="/about" className="block text-white/80 hover:text-gold transition py-2">
                  About
                </Link>
                <Link href="/contact" className="block text-white/80 hover:text-gold transition py-2">
                  Contact
                </Link>
                {user ? (
                  <>
                    <Link href="/dashboard" className="block text-white/80 hover:text-gold transition py-2">
                      Dashboard
                    </Link>
                    <Link href="/cart" className="block text-white/80 hover:text-gold transition py-2">
                      Cart (2)
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left text-red-400 hover:text-red-300 transition py-2"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/signin" className="block text-white/80 hover:text-gold transition py-2">
                      Sign In
                    </Link>
                    <Link href="/auth/signup" className="block text-gold hover:text-gold/80 transition py-2 font-semibold">
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Search Modal */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          onClick={() => setSearchOpen(false)}
        >
          <div className="max-w-3xl mx-auto mt-32 px-4">
            <div
              className="bg-gradient-to-br from-royal-blue/40 to-black border border-gold/30 rounded-lg p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-serif text-white">Search KIT GEMS</h2>
                <button
                  onClick={() => setSearchOpen(false)}
                  className="text-white/60 hover:text-white transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for gemstones, auctions..."
                  className="w-full px-6 py-4 bg-white/10 backdrop-blur border border-gold/20 rounded-lg focus:outline-none focus:border-gold text-white text-lg placeholder-white/40"
                  autoFocus
                />
              </form>

              {searchResults.length > 0 && (
                <div className="mt-6 space-y-2">
                  {searchResults.map((result, i) => (
                    <Link
                      key={i}
                      href={result.type === 'gem' ? `/shop/${result.id}` : `/auctions/${result.id}`}
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="block p-4 bg-white/5 hover:bg-white/10 border border-gold/10 hover:border-gold/30 rounded-lg transition"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-white font-semibold">
                            {result.type === 'gem' ? result.name : result.gem?.name}
                          </h3>
                          <p className="text-white/60 text-sm">
                            {result.type === 'gem'
                              ? `${result.carat} ct • ${result.origin}`
                              : `${result.gem?.carat} ct • Live Auction`
                            }
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${result.type === 'auction'
                          ? 'bg-gold text-black'
                          : 'bg-white/10 text-white'
                          }`}>
                          {result.type === 'auction' ? 'LIVE' : 'Shop'}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {searchQuery.length > 0 && searchResults.length === 0 && (
                <div className="mt-6 text-center py-8">
                  <p className="text-white/60">No results found for "{searchQuery}"</p>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gold/20">
                <p className="text-white/60 text-sm mb-3">Quick Links</p>
                <div className="flex flex-wrap gap-2">
                  {['Sapphire', 'Ruby', 'Emerald', 'Diamond'].map(type => (
                    <Link
                      key={type}
                      href={`/shop?type=${type.toLowerCase()}`}
                      onClick={() => setSearchOpen(false)}
                      className="px-4 py-2 bg-white/10 hover:bg-gold/20 border border-gold/20 hover:border-gold rounded-full text-white text-sm transition"
                    >
                      {type}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
