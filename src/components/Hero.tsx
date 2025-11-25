import { Calendar, Clock, MapPin, Sparkles } from 'lucide-react';

interface HeroProps {
  onBookNowClick: () => void;
}

export default function Hero({ onBookNowClick }: HeroProps) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden pattern-bg bg-brand-maroonDark">
      <div className="absolute inset-0 bg-brand-maroon/80 mix-blend-multiply" />

      <div className="relative z-10 px-4 w-full max-w-5xl">
        <div className="framed-card px-8 py-10 md:px-10 md:py-12 text-center">
          <div className="flex justify-center mb-4">
            <Sparkles className="w-10 h-10 text-brand-cream" />
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl text-brand-cream font-serif uppercase tracking-wide mb-2">
            Pastries &amp; Grills
          </h1>
          <p className="text-brand-cream/80 text-lg md:text-xl mb-8">
            Brought to you by Chef Thabo &amp; Chef Susshi with the Godaif Village
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-brand-cream/10 rounded-2xl p-4 border border-brand-cream/20">
              <Calendar className="w-6 h-6 text-brand-cream mx-auto mb-2" />
              <p className="text-sm text-brand-cream/80">Saturday</p>
              <p className="text-lg font-semibold text-brand-cream">November 29th</p>
            </div>
            <div className="bg-brand-cream/10 rounded-2xl p-4 border border-brand-cream/20">
              <Clock className="w-6 h-6 text-brand-cream mx-auto mb-2" />
              <p className="text-sm text-brand-cream/80">Time</p>
              <p className="text-lg font-semibold text-brand-cream">5:00PM - 12:00AM</p>
            </div>
            <div className="bg-brand-cream/10 rounded-2xl p-4 border border-brand-cream/20">
              <MapPin className="w-6 h-6 text-brand-cream mx-auto mb-2" />
              <p className="text-sm text-brand-cream/80">Venue</p>
              <p className="text-lg font-semibold text-brand-cream">Godaif Village, Ikoyi</p>
            </div>
          </div>

          <div className="bg-brand-cream text-brand-maroon rounded-2xl px-6 py-4 inline-flex items-center gap-3 text-lg font-semibold uppercase tracking-wide mb-6">
            <span>Paystack: NGN 65,000</span>
            <span className="w-1 h-1 rounded-full bg-brand-maroon" />
            <span>Transfer: NGN 60,000</span>
          </div>

          <p className="text-brand-cream/80 max-w-3xl mx-auto text-base md:text-lg mb-8">
            An evening where art and food merge seamlessly ? Southern African style BBQ and food experience with French pastries and desserts to delight your palate.
          </p>

          <button
            onClick={onBookNowClick}
            className="inline-flex items-center justify-center px-10 py-3 bg-brand-cream text-brand-maroon font-semibold rounded-full uppercase tracking-wide shadow-lg shadow-black/20 hover:translate-y-[-2px] transition-transform"
          >
            RSVP / Book Tickets
          </button>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/40 to-transparent" />
    </div>
  );
}
