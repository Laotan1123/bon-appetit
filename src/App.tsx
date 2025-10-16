import { useState } from 'react';
import Hero from './components/Hero';
import WhatToExpect from './components/WhatToExpect';
import Gallery3D from './components/Gallery3D';
import TicketPricing from './components/TicketPricing';
import BookingForm from './components/BookingForm';
import Footer from './components/Footer';

function App() {
  const [showBookingForm, setShowBookingForm] = useState(false);

  return (
    <div className="min-h-screen bg-brand-brown">
      <Hero onBookNowClick={() => setShowBookingForm(true)} />
      <WhatToExpect />
      <Gallery3D />
      
      {/* Ticket Pricing Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <TicketPricing variant="full" />
        </div>
      </section>
      
      <BookingForm isVisible={showBookingForm} onClose={() => setShowBookingForm(false)} />
      <Footer />
    </div>
  );
}

export default App;