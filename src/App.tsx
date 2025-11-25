import { useState } from 'react';
import Hero from './components/Hero';
import WhatToExpect from './components/WhatToExpect';
import Gallery3D from './components/Gallery3D';
import TicketPricing from './components/TicketPricing';
import BookingForm from './components/BookingForm';
import Footer from './components/Footer';

function App() {
  const [showBookingForm, setShowBookingForm] = useState(false);

  const handleRegularTicketClick = () => {
    // Smooth scroll to booking form
    const isMobile = window.innerWidth < 768;
    const scrollDuration = isMobile ? 400 : 600;
    
    // Open the booking form
    setShowBookingForm(true);
    
    // Add a slight delay to ensure the form is rendered before highlighting
    setTimeout(() => {
      // Find the booking form and add highlight effect
      const bookingForm = document.querySelector('[data-booking-form]');
      if (bookingForm) {
        bookingForm.classList.add('animate-pulse', 'ring-2', 'ring-brand-cream', 'ring-opacity-50');
        setTimeout(() => {
          bookingForm.classList.remove('animate-pulse', 'ring-2', 'ring-brand-cream', 'ring-opacity-50');
        }, 2000);
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-brand-maroon">
      <Hero onBookNowClick={() => setShowBookingForm(true)} />
      <WhatToExpect />
      <Gallery3D />
      
      {/* Ticket Pricing Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <TicketPricing 
            variant="full" 
            onRegularTicketClick={handleRegularTicketClick}
          />
        </div>
      </section>
      
      <BookingForm 
        isVisible={showBookingForm} 
        onClose={() => setShowBookingForm(false)}
        data-booking-form
      />
      <Footer />
    </div>
  );
}

export default App;