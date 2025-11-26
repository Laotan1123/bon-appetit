import { useState, useEffect } from 'react';
import { Ticket, CreditCard, Banknote } from 'lucide-react';

interface TicketPricingProps {
  variant?: 'full' | 'compact';
  className?: string;
  onRegularTicketClick?: () => void;
}

export default function TicketPricing({ variant = 'full', className = '', onRegularTicketClick }: TicketPricingProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const ticketCategories = [
    {
      name: 'Paystack Ticket',
      price: 65000,
      description: 'Online card payment via Paystack (NGN 65,000 per guest).',
      icon: CreditCard,
      tag: 'Card Payment',
      tagColor: 'bg-brand-cream/20 text-brand-cream border-brand-cream/40',
      isPopular: true,
      isSoldOut: false
    },
    {
      name: 'Bank Transfer Ticket',
      price: 60500,
      description: 'Pay via bank transfer and upload proof (NGN 60,500 per guest).',
      icon: Banknote,
      tag: 'Bank Transfer',
      tagColor: 'bg-brand-cream/10 text-brand-cream/90 border-brand-cream/30',
      isPopular: false,
      isSoldOut: false
    }
  ];

  const containerClasses = variant === 'compact' 
    ? 'space-y-3' 
    : 'grid grid-cols-1 md:grid-cols-2 gap-6';

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
          <div className="flex items-center justify-center gap-3 mb-3">
            <Ticket className="w-8 h-8 text-brand-cream" />
            <h2 className="text-3xl font-serif text-brand-cream uppercase tracking-wide">Ticket Options</h2>
          </div>
          <p className="text-brand-cream/80 text-lg">
            Choose your preferred payment method for Pastry &amp; Grills
          </p>
        </div>
      )}

      <div className={containerClasses}>
        {ticketCategories.map((ticket, index) => {
          const IconComponent = ticket.icon;
          const isClickable = onRegularTicketClick && !ticket.isSoldOut;
          return (
            <div
              key={ticket.name}
              onClick={isClickable ? onRegularTicketClick : undefined}
              className={`
                relative p-6 rounded-2xl border transition-all duration-300 ease-out
                ${ticket.isSoldOut 
                  ? 'border-brand-cream/20 bg-brand-maroonDark/30 opacity-60 cursor-not-allowed'
                  : ticket.isPopular 
                    ? 'border-brand-cream bg-brand-maroonDark/60 shadow-lg shadow-black/30 cursor-pointer' 
                    : 'border-brand-cream/40 bg-brand-maroonDark/50 hover:border-brand-cream hover:bg-brand-maroonDark/70 cursor-pointer'
                }
                ${!ticket.isSoldOut && 'hover:shadow-xl hover:shadow-black/30 hover:-translate-y-1'}
                ${isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-4'
                }
              `}
              style={{
                transitionDelay: `${index * 150}ms`
              }}
            >
              {ticket.isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-brand-cream text-brand-maroon px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              <div className={`flex items-center justify-center w-12 h-12 rounded-full mb-4 mx-auto ${
                ticket.isSoldOut ? 'bg-brand-cream/10' : 'bg-brand-cream/20'
              }`}>
                <IconComponent className={`w-6 h-6 ${
                  ticket.isSoldOut ? 'text-brand-cream/60' : 'text-brand-cream'
                }`} />
              </div>

              <h3 className={`text-xl font-serif text-center mb-2 ${
                ticket.isSoldOut ? 'text-brand-cream/60' : 'text-brand-cream'
              }`}>
                {ticket.name}
              </h3>

              <div className="text-center mb-3">
                <span className={`text-3xl font-bold ${
                  ticket.isSoldOut ? 'text-brand-cream/60' : 'text-brand-cream'
                }`}>
                  NGN {ticket.price.toLocaleString()}
                </span>
              </div>

              <p className={`text-center text-sm mb-4 leading-relaxed ${
                ticket.isSoldOut ? 'text-brand-cream/50' : 'text-brand-cream/80'
              }`}>
                {ticket.description}
              </p>

              <div className="flex justify-center">
                <span className={`
                  inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border
                  ${ticket.tagColor}
                `}>
                  {ticket.tag}
                </span>
              </div>

              {ticket.isPopular && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-brand-cream/10 via-transparent to-brand-cream/10 pointer-events-none" />
              )}
            </div>
          );
        })}
      </div>

      {variant === 'full' && (
        <div className="text-center mt-8">
          <p className="text-brand-cream/70 text-sm">
            Paystack: NGN 65,000 per guest. Bank transfer: NGN 60,500 per guest.
          </p>
        </div>
      )}
    </div>
  );
}
