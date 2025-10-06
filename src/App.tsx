import { useState } from 'react';
import Hero from './components/Hero';
import WhatToExpect from './components/WhatToExpect';
import BookingForm from './components/BookingForm';
import Footer from './components/Footer';

function App() {
  const [showBookingForm, setShowBookingForm] = useState(false);

  return (
    <div className="min-h-screen bg-brand-brown">
      <Hero onBookNowClick={() => setShowBookingForm(true)} />
      <WhatToExpect />
      <BookingForm isVisible={showBookingForm} onClose={() => setShowBookingForm(false)} />
      <Footer />
    </div>
  );
}

export default App;