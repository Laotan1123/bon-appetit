import { useState, useEffect } from 'react';
import { Ticket, ShoppingCart, MapPin } from 'lucide-react';

interface TicketPricingProps {
  variant?: 'full' | 'compact';
  className?: string;
  onRegularTicketClick?: () => void;
}

export default function TicketPricing({ variant = 'full', className = '', onRegularTicketClick }: TicketPricingProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const ticketCategories = [
    {
      name: 'Early Bird',
      price: 85000,
      description: 'Limited slots available',
      icon: ShoppingCart,
      tag: 'Sold Out',
      tagColor: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      isPopular: false,
      isSoldOut: true
    },
    {
      name: 'Regular Ticket',
      price: 100000,
      description: 'Standard price for general purchase',
      icon: ShoppingCart,
      tag: 'Now Selling',
      tagColor: 'bg-green-500/20 text-green-400 border-green-500/30',
      isPopular: true
    },
    {
      name: 'Event Day Ticket',
      price: 150000,
      description: 'Available only at the event venue',
      icon: MapPin,
      tag: 'At the Venue Only',
      tagColor: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      isPopular: false
    }
  ];

  const containerClasses = variant === 'compact' 
    ? 'space-y-3' 
    : 'grid grid-cols-1 md:grid-cols-3 gap-6';

  return (
    <div 
      className={`${className} ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-4'
      } transition-all duration-700 ease-out`}
    >
      {variant === 'full' && (
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Ticket className="w-8 h-8 text-brand-gold" />
            <h2 className="text-3xl font-serif text-brand-ivory">Ticket Pricing</h2>
          </div>
          <p className="text-brand-beige/80 text-lg">
            Choose the perfect ticket option for your Bon Appétit experience
          </p>
        </div>
      )}

      <div className={containerClasses}>
        {ticketCategories.map((ticket, index) => {
          const IconComponent = ticket.icon;
          const isRegularTicket = ticket.name === 'Regular Ticket';
          
          return (
            <div
              key={ticket.name}
              onClick={isRegularTicket && onRegularTicketClick ? onRegularTicketClick : undefined}
              className={`
                relative p-6 rounded-2xl border transition-all duration-300 ease-out
                ${ticket.isSoldOut 
                  ? 'border-gray-500/30 bg-gray-900/20 opacity-60 cursor-not-allowed'
                  : ticket.isPopular 
                    ? 'border-brand-gold bg-brand-gold/10 shadow-lg shadow-brand-gold/20 cursor-pointer' 
                    : 'border-brand-beige/30 bg-black/20 hover:border-brand-gold/50 hover:bg-black/30'
                }
                ${!ticket.isSoldOut && 'hover:shadow-xl hover:shadow-brand-gold/10 hover:-translate-y-1'}
                ${isRegularTicket && 'hover:ring-2 hover:ring-brand-gold/30 hover:ring-opacity-50'}
                ${isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-4'
                }
              `}
              style={{
                transitionDelay: `${index * 150}ms`
              }}
            >
              {/* Popular Badge */}
              {ticket.isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-brand-gold text-brand-brown px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Icon */}
              <div className={`flex items-center justify-center w-12 h-12 rounded-full mb-4 mx-auto ${
                ticket.isSoldOut ? 'bg-gray-500/20' : 'bg-brand-gold/20'
              }`}>
                <IconComponent className={`w-6 h-6 ${
                  ticket.isSoldOut ? 'text-gray-500' : 'text-brand-gold'
                }`} />
              </div>

              {/* Ticket Name */}
              <h3 className={`text-xl font-serif text-center mb-2 ${
                ticket.isSoldOut ? 'text-gray-400' : 'text-brand-ivory'
              }`}>
                {ticket.name}
              </h3>

              {/* Price */}
              <div className="text-center mb-4">
                <span className={`text-3xl font-bold ${
                  ticket.isSoldOut ? 'text-gray-500' : 'text-brand-gold'
                }`}>
                  ₦{ticket.price.toLocaleString()}
                </span>
              </div>

              {/* Description */}
              <p className={`text-center text-sm mb-4 leading-relaxed ${
                ticket.isSoldOut ? 'text-gray-500/60' : 'text-brand-beige/80'
              }`}>
                {ticket.description}
              </p>

              {/* Tag */}
              <div className="flex justify-center">
                <span className={`
                  inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border
                  ${ticket.tagColor}
                `}>
                  {ticket.tag}
                </span>
              </div>

              {/* Subtle glow effect for popular ticket */}
              {ticket.isPopular && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-brand-gold/5 via-transparent to-brand-gold/5 pointer-events-none" />
              )}
            </div>
          );
        })}
      </div>

      {variant === 'full' && (
        <div className="text-center mt-8">
          <p className="text-brand-beige/60 text-sm">
            All prices include access to the full dining experience and entertainment
          </p>
        </div>
      )}
    </div>
  );
}
