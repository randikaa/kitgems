export default function AboutPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-serif text-white mb-8">
          About KIT GEMS
        </h1>

        <div className="prose prose-invert max-w-none">
          <div className="bg-gradient-to-br from-royal-blue/20 to-black border border-gold/20 rounded-lg p-8 mb-8">
            <h2 className="text-3xl font-serif text-gold mb-4">Where Beauty Meets Rarity</h2>
            <p className="text-white/80 text-lg leading-relaxed">
              KIT GEMS is the world's premier digital marketplace for rare and certified gemstones. 
              We combine the excitement of live auctions with the convenience of direct purchases, 
              bringing exceptional gems to collectors and enthusiasts worldwide.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gradient-to-br from-royal-blue/20 to-black border border-gold/20 rounded-lg p-6">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-serif text-white mb-3">Authenticity Guaranteed</h3>
              <p className="text-white/70">
                Every gemstone is certified by leading gemological laboratories including GIA and Gübelin.
              </p>
            </div>

            <div className="bg-gradient-to-br from-royal-blue/20 to-black border border-gold/20 rounded-lg p-6">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-serif text-white mb-3">Ethically Sourced</h3>
              <p className="text-white/70">
                We partner only with suppliers who adhere to responsible mining and fair trade practices.
              </p>
            </div>

            <div className="bg-gradient-to-br from-royal-blue/20 to-black border border-gold/20 rounded-lg p-6">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-serif text-white mb-3">Real-Time Auctions</h3>
              <p className="text-white/70">
                Experience the thrill of bidding on rare gems with our live auction platform.
              </p>
            </div>

            <div className="bg-gradient-to-br from-royal-blue/20 to-black border border-gold/20 rounded-lg p-6">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-serif text-white mb-3">Secure Transactions</h3>
              <p className="text-white/70">
                Bank-level encryption and secure payment processing protect every transaction.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-royal-blue/20 to-black border border-gold/20 rounded-lg p-8">
            <h2 className="text-3xl font-serif text-gold mb-6">Our Story</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              Founded by gemologists and technology experts, KIT GEMS was born from a passion for 
              making rare gemstones accessible to collectors worldwide. We recognized that the 
              traditional gem market lacked transparency and accessibility.
            </p>
            <p className="text-white/80 leading-relaxed">
              Today, we're proud to serve thousands of collectors, offering a curated selection 
              of the world's finest gemstones with complete transparency, certification, and 
              the excitement of live auctions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
