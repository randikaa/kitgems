// Avatar generation utilities
import crypto from 'crypto';

/**
 * Generate MD5 hash for Gravatar
 * @param email - User's email
 * @returns MD5 hash
 */
function md5Hash(email: string): string {
  if (typeof window !== 'undefined') {
    // Client-side: use a simple hash
    return Array.from(email)
      .reduce((hash, char) => {
        const chr = char.charCodeAt(0);
        hash = ((hash << 5) - hash) + chr;
        return hash & hash;
      }, 0)
      .toString(16);
  }
  // Server-side: use crypto
  return crypto.createHash('md5').update(email.toLowerCase().trim()).digest('hex');
}

/**
 * Get Gravatar URL for email
 * @param email - User's email
 * @param size - Image size (default: 200)
 * @returns Gravatar URL
 */
export function getGravatarUrl(email: string, size: number = 200): string {
  const hash = md5Hash(email.toLowerCase().trim());
  // Use DiceBear as fallback (d parameter)
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
}

/**
 * Generate a random avatar URL using DiceBear API
 * @param seed - Unique identifier (email, user ID, etc.)
 * @param style - Avatar style (default: 'avataaars')
 * @returns Avatar URL
 */
export function generateAvatar(
  seed: string,
  style: 'avataaars' | 'bottts' | 'identicon' | 'initials' | 'pixel-art' | 'lorelei' = 'avataaars'
): string {
  // Use DiceBear API for free avatar generation
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}`;
}

/**
 * Get avatar URL - returns user's avatar, Gravatar, or generates one
 * @param avatarUrl - User's custom avatar URL
 * @param email - User's email for Gravatar
 * @param fallbackSeed - Seed for generated avatar (email or ID)
 * @param size - Image size for Gravatar
 * @returns Avatar URL
 */
export function getAvatarUrl(
  avatarUrl: string | null | undefined,
  email: string,
  fallbackSeed?: string,
  size: number = 200
): string {
  // Priority 1: Custom uploaded avatar
  if (avatarUrl && avatarUrl.trim()) {
    return avatarUrl;
  }
  
  // Priority 2: Gravatar (Gmail profile photo)
  if (email) {
    return getGravatarUrl(email, size);
  }
  
  // Priority 3: Generated avatar
  return generateAvatar(fallbackSeed || email, 'avataaars');
}

/**
 * Get initials from name
 * @param name - Full name
 * @returns Initials (e.g., "John Doe" -> "JD")
 */
export function getInitials(name: string): string {
  if (!name || !name.trim()) return '?';
  
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/**
 * Generate avatar with initials style
 * @param name - User's name
 * @param email - User's email (fallback)
 * @returns Avatar URL with initials
 */
export function generateInitialsAvatar(name: string, email: string): string {
  const initials = getInitials(name || email.split('@')[0]);
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(initials)}&backgroundColor=D4AF37&textColor=0A0A0A`;
}

/**
 * Available avatar styles with descriptions
 */
export const AVATAR_STYLES = {
  avataaars: {
    name: 'Avataaars',
    description: 'Cartoon-style avatars',
    preview: 'https://api.dicebear.com/7.x/avataaars/svg?seed=preview',
  },
  bottts: {
    name: 'Bottts',
    description: 'Robot avatars',
    preview: 'https://api.dicebear.com/7.x/bottts/svg?seed=preview',
  },
  identicon: {
    name: 'Identicon',
    description: 'Geometric patterns',
    preview: 'https://api.dicebear.com/7.x/identicon/svg?seed=preview',
  },
  initials: {
    name: 'Initials',
    description: 'Letter-based avatars',
    preview: 'https://api.dicebear.com/7.x/initials/svg?seed=JD',
  },
  'pixel-art': {
    name: 'Pixel Art',
    description: '8-bit style avatars',
    preview: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=preview',
  },
  lorelei: {
    name: 'Lorelei',
    description: 'Illustrated portraits',
    preview: 'https://api.dicebear.com/7.x/lorelei/svg?seed=preview',
  },
} as const;
