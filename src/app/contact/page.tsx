export default function ContactPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-serif text-white mb-8">
          Contact Us
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="bg-gradient-to-br from-royal-blue/20 to-black border border-gold/20 rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-serif text-gold mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-white font-semibold mb-2">Email</h3>
                  <a href="mailto:hello@kitgems.com" className="text-white/70 hover:text-gold transition">
                    hello@kitgems.com
                  </a>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-2">Phone</h3>
                  <a href="tel:+1234567890" className="text-white/70 hover:text-gold transition">
                    +1 (234) 567-890
                  </a>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-2">Address</h3>
                  <p className="text-white/70">
                    123 Gem Street<br />
                    New York, NY 10001<br />
                    United States
                  </p>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-2">Hours</h3>
                  <p className="text-white/70">
                    Monday - Friday: 9am - 6pm EST<br />
                    Saturday: 10am - 4pm EST<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <form className="bg-gradient-to-br from-royal-blue/20 to-black border border-gold/20 rounded-lg p-8">
              <h2 className="text-2xl font-serif text-gold mb-6">Send a Message</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur border border-gold/20 rounded-lg focus:outline-none focus:border-gold text-white"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur border border-gold/20 rounded-lg focus:outline-none focus:border-gold text-white"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">Subject</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur border border-gold/20 rounded-lg focus:outline-none focus:border-gold text-white"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">Message</label>
                  <textarea
                    rows={5}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur border border-gold/20 rounded-lg focus:outline-none focus:border-gold text-white resize-none"
                    placeholder="Your message..."
                  />
                </div>

                <button className="w-full px-6 py-3 bg-gold text-black font-semibold rounded-lg hover:bg-gold/90 transition">
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
