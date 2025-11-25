import { Camera, UtensilsCrossed, Music, Wine } from 'lucide-react';

export default function WhatToExpect() {
  const timeline = [
    {
      time: '5:00PM - 6:30PM',
      title: 'Art, Champagne & Appetizers',
      description: 'Welcome hour with art, bubbles, and light bites to open the evening.',
      icon: Camera,
      accent: 'from-brand-cream/80 via-brand-cream/60 to-brand-cream/40'
    },
    {
      time: '6:30PM - 7:30PM',
      title: 'Main Dish: Grills & Sides',
      description: 'Southern African style BBQ mains with signature sides, hot off the grill.',
      icon: UtensilsCrossed,
      accent: 'from-brand-cream/90 via-brand-cream/60 to-brand-cream/30'
    },
    {
      time: '7:30PM - 8:30PM',
      title: 'Pastries',
      description: 'French-inspired pastries and desserts to close the service.',
      icon: Wine,
      accent: 'from-brand-cream/80 via-brand-cream/50 to-brand-cream/20'
    },
    {
      time: '8:30PM - 12:00AM',
      title: 'After Party & Live Performance',
      description: 'Music-led after party; arrive on time so service flows smoothly.',
      icon: Music,
      accent: 'from-brand-cream/70 via-brand-cream/40 to-brand-cream/10'
    }
  ];

  return (
    <section className="relative py-16 px-4 bg-brand-maroon pattern-bg">
      <div className="absolute inset-0 bg-brand-maroon/80" />
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-3">
            <Wine className="w-9 h-9 text-brand-cream" />
          </div>
          <h2 className="text-3xl md:text-4xl text-brand-cream uppercase tracking-wide">Evening Flow</h2>
          <p className="text-brand-cream/80 text-lg mt-2">Pastry &amp; Grills ? Godaif Village ? 5pm - 12am</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {timeline.map((item, index) => (
            <div
              key={item.title}
              className="relative overflow-hidden rounded-2xl border border-brand-cream/25 bg-brand-maroonDark/70 p-5 shadow-lg shadow-black/20"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.accent} opacity-10`} />
              <div className="relative flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-cream/10 border border-brand-cream/30 flex items-center justify-center text-brand-cream">
                  <item.icon className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="text-sm uppercase tracking-wide text-brand-cream/70">{item.time}</div>
                  <h3 className="text-xl text-brand-cream font-serif">{item.title}</h3>
                  <p className="text-brand-cream/80 text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="rounded-2xl border border-brand-cream/20 bg-brand-maroonDark/60 p-4 text-brand-cream">
            <div className="text-2xl font-semibold">5pm</div>
            <div className="text-brand-cream/75 text-sm">Arrival time ? please be punctual</div>
          </div>
          <div className="rounded-2xl border border-brand-cream/20 bg-brand-maroonDark/60 p-4 text-brand-cream">
            <div className="text-2xl font-semibold">BBQ + Pastry</div>
            <div className="text-brand-cream/75 text-sm">Grills, sides, and French desserts</div>
          </div>
          <div className="rounded-2xl border border-brand-cream/20 bg-brand-maroonDark/60 p-4 text-brand-cream">
            <div className="text-2xl font-semibold">Live</div>
            <div className="text-brand-cream/75 text-sm">After party &amp; performance</div>
          </div>
        </div>
      </div>
    </section>
  );
}
