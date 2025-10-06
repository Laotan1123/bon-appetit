import { Mail, Phone, Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-brand-brown border-t border-brand-beige/30 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-2xl text-brand-gold mb-3">Bon Appétit</h3>
            <p className="text-brand-beige text-sm leading-relaxed">
              An exclusive fine dining experience celebrating culinary excellence and sophisticated entertainment.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-brand-ivory font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <a href="mailto:bythabo@gmail.com" className="flex items-center gap-3 text-brand-beige hover:text-brand-gold transition-colors">
                <Mail className="w-4 h-4" />
                <span className="text-sm">bythabo@gmail.com</span>
              </a>
              <a href="tel:+2349162768788" className="flex items-center gap-3 text-brand-beige hover:text-brand-gold transition-colors">
                <Phone className="w-4 h-4" />
                <span className="text-sm">Psych Entertainment.</span>
              </a>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-brand-ivory font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 border border-brand-beige/30 flex items-center justify-center text-brand-beige hover:text-brand-gold hover:border-brand-gold transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 border border-brand-beige/30 flex items-center justify-center text-brand-beige hover:text-brand-gold hover:border-brand-gold transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 border border-brand-beige/30 flex items-center justify-center text-brand-beige hover:text-brand-gold hover:border-brand-gold transition-all"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Venue + Date quick ref */}
        <div className="border-t border-brand-beige/30 pt-6 mb-8 text-sm text-brand-beige">
          Friday, October 31st • Eterniti by Amber, 4b Michelle Okocha Crescent, Parkview Estate, Ikoyi • ₦85,000 per ticket
        </div>

        {/* Copyright */}
        <div className="border-t border-brand-beige/30 pt-6 text-center">
          <p className="text-brand-beige/80 text-sm">
            © 2025 Bon Appétit. All rights reserved. | Brought to you by Psych Entertainment.
          </p>
        </div>
      </div>
    </footer>
  );
}