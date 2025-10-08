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
                {/* Clean WhatsApp icon */}
                <svg
                  className="w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
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