import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-gold/20 text-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-serif text-gold mb-4">KIT GEMS</h3>
            <p className="text-sm">
              The world's premier marketplace for rare and certified gemstones.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/shop?type=sapphire" className="hover:text-gold transition">Sapphires</Link></li>
              <li><Link href="/shop?type=ruby" className="hover:text-gold transition">Rubies</Link></li>
              <li><Link href="/shop?type=emerald" className="hover:text-gold transition">Emeralds</Link></li>
              <li><Link href="/shop?type=diamond" className="hover:text-gold transition">Diamonds</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-gold transition">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-gold transition">Contact</Link></li>
              <li><Link href="/terms" className="hover:text-gold transition">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-gold transition">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-sm mb-4">Stay updated on new arrivals and exclusive auctions.</p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 bg-white/10 border border-gold/20 rounded-l focus:outline-none focus:border-gold"
              />
              <button className="px-4 py-2 bg-gold text-black font-semibold rounded-r hover:bg-gold/90 transition">
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gold/20 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>&copy; 2025 KIT GEMS. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-gold transition">Instagram</a>
            <a href="#" className="hover:text-gold transition">Facebook</a>
            <a href="#" className="hover:text-gold transition">Twitter</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
