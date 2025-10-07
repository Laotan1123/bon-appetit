import { Camera, UtensilsCrossed, Music, Wine } from 'lucide-react';

export default function WhatToExpect() {
  const timeline = [
    {
      time: '5:00PM – 6:00PM',
      title: 'Red Carpet Reception',
      description: 'Exclusive red carpet welcome with professional photography and a champagne reception.',
      icon: Camera,
      gradient: 'from-brand-beige to-brand-gold'
    },
    {
      time: '6:30PM – 10:00PM',
      title: 'Fine Dining Buffet',
      description: 'An exquisite spread of continental and local dishes with a signature dessert showcase.',
      icon: UtensilsCrossed,
      gradient: 'from-brand-gold to-brand-brown'
    },
    {
      time: '10:00PM – 12:00AM',
      title: 'After Party',
      description: 'Networking and celebration with premium drinks and live entertainment.',
      icon: Music,
      gradient: 'from-brand-brown to-brand-brownDark'
    }
  ];

  return (
    <section className="relative py-20 px-4 bg-brand-brown">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23D4C2A6' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <Wine className="w-10 h-10 text-brand-gold" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl text-brand-ivory mb-4">
            What to Expect
          </h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-brand-beige to-transparent mx-auto mb-4"></div>
          <p className="text-brand-beige/90 text-lg max-w-2xl mx-auto">
            An unforgettable evening crafted to perfection, from arrival to the final toast
          </p>
        </div>

        {/* Timeline */}
        <div className="space-y-8">
          {timeline.map((item, index) => (
            <div
              key={index}
              className="group relative bg-white/5 backdrop-blur-sm border border-brand-beige/30 rounded-xl p-8 hover:border-brand-gold/50 transition-all duration-300 hover:transform hover:scale-[1.02]"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${item.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="w-8 h-8 text-brand-ivory" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-grow">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3">
                    <h3 className="font-serif text-2xl text-brand-ivory mb-2 md:mb-0">
                      {item.title}
                    </h3>
                    <span className="inline-block px-4 py-1 bg-brand-beige/10 border border-brand-beige/40 rounded-full text-brand-beige text-sm font-medium whitespace-nowrap">
                      {item.time}
                    </span>
                  </div>
                  <p className="text-brand-ivory/90 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} rounded-bl-full`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional highlights */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-6">
            <div className="text-3xl font-bold text-brand-gold mb-2">20+</div>
            <div className="text-brand-beige">Gourmet Dishes</div>
          </div>
          <div className="p-6">
            <div className="text-3xl font-bold text-brand-gold mb-2">Premium</div>
            <div className="text-brand-beige">Drink Selection</div>
          </div>
          <div className="p-6">
            <div className="text-3xl font-bold text-brand-gold mb-2">Live</div>
            <div className="text-brand-beige">Entertainment</div>
          </div>
        </div>
      </div>
    </section>
  );
}