import { Mail, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-brand-brown border-t border-brand-beige/30 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-2xl text-brand-gold mb-3">Bon Appétit</h3>
            <p className="text-brand-beige text-sm leading-relaxed">
              An exclusive fine dining experience celebrating culinary excellence and sophisticated entertainment.
            </p>
          </div>

          {/* Contact & Follow (merged) */}
          <div>
            <h4 className="text-brand-ivory font-semibold mb-4">Contact & Follow</h4>
            <div className="space-y-3">
              <a
                href="mailto:bythabo@gmail.com"
                className="flex items-center gap-3 text-brand-beige hover:text-brand-gold transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
                <span className="text-sm">bythabo@gmail.com</span>
              </a>

              <a
                href="http://wa.me/2349162768788"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-brand-beige hover:text-brand-gold transition-colors"
                aria-label="WhatsApp"
              >
                {/* Current WhatsApp-style icon (keeps existing look) */}
                <svg
                  className="w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M20.52 3.48A11.86 11.86 0 0 0 12 .5c-6.63 0-12 5.37-12 12 0 2.11.55 4.18 1.6 6.02L.5 23.5l5.1-1.33A11.91 11.91 0 0 0 12 24c6.63 0 12-5.37 12-12a11.86 11.86 0 0 0-3.48-8.52zM12 21.5c-1.5 0-2.97-.37-4.27-1.07l-.3-.17-3.03.79.81-2.93-.19-.31A9.93 9.93 0 0 1 3 12c0-5.52 4.48-10 10-10 1.74 0 3.42.45 4.9 1.29l.3.17 3.03-.79-.81 2.93.19.31A9.93 9.93 0 0 1 21 12c0 5.52-4.48 10-10 10z" />
                  <path d="M15.9 10.14c-.39 0-.77-.15-1.06-.44l-1.44-1.44a1.5 1.5 0 0 0-2.12 0l-.88.88a1.5 1.5 0 0 0 0 2.12l1.44 1.44c.29.29.67.44 1.06.44s.77-.15 1.06-.44l.88-.88a1.5 1.5 0 0 0 0-2.12l-1.44-1.44a1.5 1.5 0 0 0-2.12 0l-.88.88a1.5 1.5 0 0 0 0 2.12l1.44 1.44c.29.29.67.44 1.06.44s.77-.15 1.06-.44l.88-.88a1.5 1.5 0 0 0 0-2.12l-1.44-1.44a1.5 1.5 0 0 0-2.12 0l-.88.88a1.5 1.5 0 0 0 0 2.12l1.44 1.44c.29.29.67.44 1.06.44s.77-.15 1.06-.44l.88-.88a1.5 1.5 0 0 0 0-2.12l-1.44-1.44a1.5 1.5 0 0 0-2.12 0l-.88.88a1.5 1.5 0 0 0 0 2.12l1.44 1.44c.29.29.67.44 1.06.44s.77-.15 1.06-.44l.88-.88a1.5 1.5 0 0 0 0-2.12l-1.44-1.44a1.5 1.5 0 0 0-2.12 0l-.88.88a1.5 1.5 0 0 0 0 2.12l1.44 1.44c.29.29.67.44 1.06.44s.77-.15 1.06-.44l.88-.88a1.5 1.5 0 0 0 0-2.12l-1.44-1.44a1.5 1.5 0 0 0-2.12 0l-.88.88a1.5 1.5 0 0 0 0 2.12l1.44 1.44c.29.29.67.44 1.06.44z" />
                </svg>

                <span className="text-sm">Psych Entertainment</span>
              </a>

              <div className="pt-3">
                <span className="block text-brand-beige mb-2">Follow us</span>
                <div className="flex gap-4">
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full bg-white/5 border border-brand-beige/30 flex items-center justify-center text-brand-beige hover:text-brand-gold hover:border-brand-gold transition-all"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                </div>
              </div>
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