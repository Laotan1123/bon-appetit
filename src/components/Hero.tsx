import { Calendar, Clock, MapPin, Sparkles } from 'lucide-react';

interface HeroProps {
  onBookNowClick: () => void;
}

export default function Hero({ onBookNowClick }: HeroProps) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-brownDark via-brand-brown to-brand-brownDark">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Decorative element */}
        <div className="flex justify-center mb-6">
          <Sparkles className="w-8 h-8 text-brand-gold" />
        </div>

        {/* Main Title */}
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-brand-ivory mb-4 tracking-wide">
          Bon Appétit
        </h1>

        <div className="w-32 h-px bg-gradient-to-r from-transparent via-brand-beige to-transparent mx-auto mb-4"></div>

        <p className="text-xl md:text-2xl text-brand-beige font-light tracking-widest mb-8">
          A FINE DINING BUFFET
        </p>

        {/* Event Details Card */}
        <div className="bg-white/5 backdrop-blur-sm border border-brand-beige/30 rounded-lg p-8 md:p-10 mb-8 max-w-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex flex-col items-center text-brand-ivory">
              <Calendar className="w-6 h-6 text-brand-gold mb-2" />
              <p className="text-sm text-brand-beige/80 mb-1">DATE</p>
              <p className="font-medium">Friday, October 31st</p>
            </div>

            <div className="flex flex-col items-center text-brand-ivory">
              <Clock className="w-6 h-6 text-brand-gold mb-2" />
              <p className="text-sm text-brand-beige/80 mb-1">TIME</p>
              <p className="font-medium">5:00PM - 12:00AM</p>
            </div>

            <div className="flex flex-col items-center text-brand-ivory">
              <MapPin className="w-6 h-6 text-brand-gold mb-2" />
              <p className="text-sm text-brand-beige/80 mb-1">VENUE</p>
              <p className="font-medium text-center">Eterniti by Amber, 4b Michelle Okocha Crescent, Parkview Estate, Ikoyi</p>
            </div>
          </div>

          {/* Price */}
          <div className="border-t border-brand-beige/30 pt-6">
            <p className="text-4xl md:text-5xl font-bold text-brand-gold mb-2">₦85,000</p>
            <p className="text-brand-beige text-sm">per ticket</p>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={onBookNowClick}
          className="group relative inline-flex items-center justify-center px-12 py-4 text-lg font-semibold text-brand-brown bg-brand-gold rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-brand-gold/30"
        >
          <span className="relative z-10">BOOK YOUR TICKETS</span>
          <div className="absolute inset-0 bg-gradient-to-r from-brand-beige to-brand-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>

        {/* Subtle note */}
        <p className="text-brand-beige/80 text-sm mt-6">
          An exclusive evening of culinary excellenceee
        </p>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brand-brownDark to-transparent"></div>
    </div>
  );
}