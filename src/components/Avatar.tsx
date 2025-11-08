import { getAvatarUrl, generateAvatar } from '@/lib/avatar';

interface AvatarProps {
  src?: string | null;
  email: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
}

export default function Avatar({ 
  src, 
  email,
  alt = 'Avatar', 
  size = 'md',
  className = '',
  onClick
}: AvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 min-w-8 min-h-8',
    md: 'w-12 h-12 min-w-12 min-h-12',
    lg: 'w-16 h-16 min-w-16 min-h-16',
    xl: 'w-24 h-24 min-w-24 min-h-24',
  };

  const sizePixels = {
    sm: 32,
    md: 48,
    lg: 64,
    xl: 96,
  };

  const avatarUrl = getAvatarUrl(src, email, email, sizePixels[size]);

  return (
    <div 
      className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gradient-to-br from-gold to-gold/60 flex items-center justify-center flex-shrink-0 ${onClick ? 'cursor-pointer hover:opacity-80 transition' : ''} ${className}`}
      onClick={onClick}
      style={{ aspectRatio: '1 / 1' }}
    >
      <img 
        src={avatarUrl} 
        alt={alt}
        className="w-full h-full object-cover"
        style={{ aspectRatio: '1 / 1' }}
        onError={(e) => {
          // Fallback to generated avatar if image fails to load
          const target = e.target as HTMLImageElement;
          target.src = generateAvatar(email, 'initials');
        }}
      />
    </div>
  );
}
