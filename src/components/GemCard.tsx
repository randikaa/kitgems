import Link from 'next/link';
import { Gem } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import GemImage from './GemImage';

interface GemCardProps {
  gem: Gem;
}

export default function GemCard({ gem }: GemCardProps) {
  return (
    <Link href={`/shop/${gem.id}`} className="group">
      <div className="bg-gradient-to-br from-royal-blue/20 to-black border border-gold/20 rounded-lg overflow-hidden hover:border-gold/60 transition-all duration-300 hover:shadow-lg hover:shadow-gold/20">
        <div className="aspect-square bg-gradient-to-br from-royal-blue/10 to-black relative overflow-hidden">
          <GemImage 
            images={gem.images} 
            name={gem.name}
            className="w-full h-full group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-serif text-white mb-1 group-hover:text-gold transition">
            {gem.name}
          </h3>
          <p className="text-sm text-white/60 mb-2">
            {gem.carat} ct • {gem.origin}
          </p>
          <div className="flex justify-between items-center">
            <span className="text-xl font-semibold text-gold">
              {formatPrice(gem.price)}
            </span>
            {gem.certification && (
              <span className="text-xs text-white/40">Certified</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
