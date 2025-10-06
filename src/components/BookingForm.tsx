import { useState, useEffect } from 'react';
import { X, Loader2, Check } from 'lucide-react';

interface BookingFormProps {
  isVisible: boolean;
  onClose: () => void;
}

type PaymentMethod = 'paystack' | 'bank_transfer';

export default function BookingForm({ isVisible, onClose }: BookingFormProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [numTickets, setNumTickets] = useState(1);
  const [guestNames, setGuestNames] = useState<string[]>(['']);
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [dietary, setDietary] = useState('');
  const [notes, setNotes] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('paystack');
  const [proofOfPayment, setProofOfPayment] = useState<File | null>(null);

  const ticketPrice = 85000;
  const totalAmount = ticketPrice * numTickets;

  const updateGuestNames = (count: number) => {
    const newGuestNames = Array(count).fill('').map((_, i) => guestNames[i] || '');
    setGuestNames(newGuestNames);
  };

  const handleNumTicketsChange = (value: number) => {
    setNumTickets(value);
    updateGuestNames(value);
  };

  // Generate unique ticket code
  const generateTicketCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'BA-';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  // Load Paystack inline script when needed
  const loadPaystack = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if ((window as any).PaystackPop) return resolve();
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Paystack script'));
      document.head.appendChild(script);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      setStep(2);
      return;
    }

    setLoading(true);

    try {
      const ticketCode = generateTicketCode();

      if (paymentMethod === 'paystack') {
        // Ensure Paystack script is loaded
        await loadPaystack();

        // Build a stable reference (you can adapt)
        const ref = 'BA' + Date.now() + Math.floor(Math.random() * 1000000);

        if (!import.meta.env.VITE_PAYSTACK_PUBLIC_KEY) {
          throw new Error('Paystack public key not configured (VITE_PAYSTACK_PUBLIC_KEY)');
        }

        // Use plain function references for Paystack callbacks
        const onPaystackSuccess = async function (response: any) {
          // keep UI responsive while we save; actual async work happens here
          setLoading(true);
          try {
            await saveBooking('paid', ticketCode, response.reference);

            // Trigger the serverless email endpoint (do not expose errors to users)
            fetch('/api/send-confirmation', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                fullName,
                email,
                numTickets,
                amount: totalAmount,
                paymentReference: response.reference,
              }),
            }).catch((err) => {
              console.error('Error sending confirmation email:', err);
            });
          } catch (err) {
            console.error('Error saving booking after Paystack success:', err);
            alert('Payment succeeded but saving booking failed. Please contact support.');
          } finally {
            setLoading(false);
          }
        };

        const onPaystackClose = function () {
          setLoading(false);
        };

        const handler = (window as any).PaystackPop.setup({
          key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
          email: email,
          amount: totalAmount * 100, // amount in kobo
          currency: 'NGN',
          ref: ref,
          metadata: {
            custom_fields: [
              { display_name: "Full Name", variable_name: "full_name", value: fullName },
              { display_name: "Phone", variable_name: "phone", value: phone },
              { display_name: "Number of Tickets", variable_name: "num_tickets", value: numTickets }
            ]
          },
          callback: onPaystackSuccess,
          onClose: onPaystackClose
        });

        handler.openIframe();
      } else {
        // Bank transfer - upload proof
        let proofUrl = '';
        if (proofOfPayment) {
          // In production, upload to cloud storage and get URL
          proofUrl = `proof_${Date.now()}_${proofOfPayment.name}`;
        }
        await saveBooking('pending', ticketCode, proofUrl);
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  const saveBooking = async (paymentStatus: string, ticketCode: string, paymentRef: string) => {
    try {
      const sheetUrl = import.meta.env.VITE_SHEET_WEBAPP_URL;
      const clientSecret = import.meta.env.VITE_SHEET_SECRET;

      if (!sheetUrl) throw new Error('VITE_SHEET_WEBAPP_URL not set in .env');
      if (!clientSecret) throw new Error('VITE_SHEET_SECRET not set in .env');

      const payload = {
        _secret: clientSecret,
        fullName,
        email,
        phone,
        numTickets,
        guestNames,
        emergencyName,
        emergencyPhone,
        dietary,
        notes,
        paymentMethod,
        paymentStatus,
        paymentReference: paymentRef,
        ticketCode,
      };

      // Use text/plain to avoid CORS preflight. Apps Script will expose the raw string at e.postData.contents.
      const resp = await fetch(sheetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const body = await resp.text().catch(() => '');
        throw new Error(`Sheet write failed (status ${resp.status}) ${body}`);
      }

      const result = await resp.json().catch(() => null);
      if (!result || !result.success) {
        const errMsg = result?.error || 'Unknown error writing to sheet';
        throw new Error(errMsg);
      }

      setSubmitted(true);
    } catch (err) {
      console.error('saveBooking error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setFullName('');
    setEmail('');
    setPhone('');
    setNumTickets(1);
    setGuestNames(['']);
    setEmergencyName('');
    setEmergencyPhone('');
    setDietary('');
    setNotes('');
    setTermsAccepted(false);
    setPaymentMethod('paystack');
    setProofOfPayment(null);
    setSubmitted(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Close when clicking outside the modal content
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Close on Escape key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  if (!isVisible) return null;

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-brand-brown border border-brand-beige/30 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-2xl font-serif text-brand-ivory mb-4">Booking Confirmed!</h3>
          <p className="text-brand-beige mb-6">
            {paymentMethod === 'paystack'
              ? 'Your payment has been received and your tickets have been confirmed.'
              : 'Your booking has been received. Please complete the bank transfer and we will verify your payment shortly.'}
          </p>
          <p className="text-sm text-brand-beige/80 mb-6">
            A confirmation email with your ticket code has been sent to {email}
          </p>
          <button
            onClick={handleClose}
            className="w-full px-6 py-3 bg-brand-gold text-brand-brown font-semibold rounded-lg hover:bg-brand-beige transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={handleOverlayClick}
    >
      {/* Floating close button (top-right) */}
      <button
        aria-label="Close booking form"
        onClick={handleClose}
        className="absolute top-4 right-4 z-60 w-10 h-10 rounded-full bg-black/40 flex items-center justify-center text-brand-beige hover:bg-black/60"
      >
        <X className="w-5 h-5" />
      </button>

      <div
        className="bg-brand-brown border border-brand-beige/30 rounded-2xl w-full max-w-3xl my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-brand-beige/30 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif text-brand-ivory">Book Your Tickets</h2>
            <p className="text-brand-beige/90 text-sm mt-1">Step {step} of 2</p>
          </div>
          <button
            onClick={handleClose}
            className="text-brand-beige hover:text-brand-ivory transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-8 max-h-[80vh] overflow-y-auto"
          role="form"
          aria-label="Booking form"
        >
          {step === 1 && (
            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <label htmlFor="fullName" className="block text-brand-ivory mb-2 font-medium">
                  Full Name <span className="text-sm text-brand-beige/80" aria-hidden="true">*</span>
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  autoComplete="name"
                  autoFocus
                  inputMode="text"
                  aria-required="true"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 sm:py-3 text-base bg-black/30 border border-brand-beige/30 rounded-lg text-brand-ivory focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20 transition"
                  placeholder="Enter your full name"
                />
                <p className="mt-2 text-sm text-brand-beige/80">This name will appear on the booking confirmation and ticket.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-brand-ivory mb-2 font-medium">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-black/30 border border-brand-beige/30 rounded-lg text-brand-ivory focus:border-brand-gold focus:outline-none"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-brand-ivory mb-2 font-medium">Phone (WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-black/30 border border-brand-beige/30 rounded-lg text-brand-ivory focus:border-brand-gold focus:outline-none"
                    placeholder="+234 xxx xxx xxxx"
                  />
                </div>
              </div>

              {/* Number of Tickets */}
              <div>
                <label className="block text-brand-ivory mb-2 font-medium">Number of Tickets *</label>
                <select
                  value={numTickets}
                  onChange={(e) => handleNumTicketsChange(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-black/30 border border-brand-beige/30 rounded-lg text-brand-ivory focus:border-brand-gold focus:outline-none"
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num} Ticket{num > 1 ? 's' : ''} - ₦{(num * ticketPrice).toLocaleString()}</option>
                  ))}
                </select>
              </div>

              {/* Guest Names */}
              <div>
                <label className="block text-brand-ivory mb-2 font-medium">Guest Names *</label>
                <div className="space-y-3">
                  {guestNames.map((name, index) => (
                    <input
                      key={index}
                      type="text"
                      required
                      value={name}
                      onChange={(e) => {
                        const newNames = [...guestNames];
                        newNames[index] = e.target.value;
                        setGuestNames(newNames);
                      }}
                      className="w-full px-4 py-3 bg-black/30 border border-brand-beige/30 rounded-lg text-brand-ivory focus:border-brand-gold focus:outline-none"
                      placeholder={`Guest ${index + 1} name`}
                    />
                  ))}
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-brand-ivory mb-2 font-medium">Emergency Contact Name *</label>
                  <input
                    type="text"
                    required
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    className="w-full px-4 py-3 bg-black/30 border border-brand-beige/30 rounded-lg text-brand-ivory focus:border-brand-gold focus:outline-none"
                    placeholder="Emergency contact name"
                  />
                </div>

                <div>
                  <label className="block text-brand-ivory mb-2 font-medium">Emergency Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-black/30 border border-brand-beige/30 rounded-lg text-brand-ivory focus:border-brand-gold focus:outline-none"
                    placeholder="+234 xxx xxx xxxx"
                  />
                </div>
              </div>

              {/* Dietary Preferences */}
              <div>
                <label className="block text-brand-ivory mb-2 font-medium">Dietary Preferences / Allergies</label>
                <textarea
                  value={dietary}
                  onChange={(e) => setDietary(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-black/30 border border-brand-beige/30 rounded-lg text-brand-ivory focus:border-brand-gold focus:outline-none resize-none"
                  placeholder="Any dietary restrictions or allergies we should know about?"
                />
              </div>

              {/* Special Notes */}
              <div>
                <label className="block text-brand-ivory mb-2 font-medium">Special Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-black/30 border border-brand-beige/30 rounded-lg text-brand-ivory focus:border-brand-gold focus:outline-none resize-none"
                  placeholder="Anniversary, birthday celebration, VIP requests, etc."
                />
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-brand-gold"
                />
                <label htmlFor="terms" className="text-brand-beige text-sm">
                  I agree to the event terms and conditions including dress code requirements and the no refund policy. *
                </label>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              {/* Payment Method Selection */}
              <div>
                <label className="block text-brand-ivory mb-4 font-medium text-lg">Select Payment Method</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paystack')}
                    className={`p-6 rounded-lg border-2 transition-all ${
                      paymentMethod === 'paystack'
                        ? 'border-brand-gold bg-brand-gold/10'
                        : 'border-brand-beige/30 bg-black/20'
                    }`}
                  >
                    <div className="text-brand-ivory font-semibold mb-2">Pay with Card</div>
                    <div className="text-brand-beige text-sm">Secure online payment via Paystack</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`p-6 rounded-lg border-2 transition-all ${
                      paymentMethod === 'bank_transfer'
                        ? 'border-brand-gold bg-brand-gold/10'
                        : 'border-brand-beige/30 bg-black/20'
                    }`}
                  >
                    <div className="text-brand-ivory font-semibold mb-2">Bank Transfer</div>
                    <div className="text-brand-beige text-sm">Transfer to our account</div>
                  </button>
                </div>
              </div>

              {/* Payment Details */}
              {paymentMethod === 'bank_transfer' && (
                <div className="bg-black/20 border border-brand-beige/30 rounded-lg p-6">
                  <h3 className="text-brand-ivory font-semibold mb-4">Bank Transfer Details</h3>
                  <div className="space-y-2 text-brand-beige">
                    <div className="flex justify-between">
                      <span>Bank Name:</span>
                      <span className="font-semibold text-brand-ivory">GTBank</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Account Number:</span>
                      <span className="font-semibold text-brand-ivory">0489704166</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Account Name:</span>
                      <span className="font-semibold text-brand-ivory">Thabolwethu Dube</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-brand-beige/30">
                      <span>Amount:</span>
                      <span className="font-bold text-brand-gold text-xl">₦{totalAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-brand-ivory mb-2 font-medium">Upload Proof of Payment *</label>
                    <input
                      type="file"
                      required={paymentMethod === 'bank_transfer'}
                      accept="image/*,.pdf"
                      onChange={(e) => setProofOfPayment(e.target.files?.[0] || null)}
                      className="w-full px-4 py-3 bg-black/20 border border-brand-beige/30 rounded-lg text-brand-ivory focus:border-brand-gold focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-brand-gold file:text-brand-brown file:font-semibold"
                    />
                    <p className="text-brand-beige text-sm mt-2">Please upload a screenshot or receipt of your transfer</p>
                  </div>
                </div>
              )}

              {/* Order Summary */}
              <div className="bg-brand-gold/10 border border-brand-gold/40 rounded-lg p-6">
                <h3 className="text-brand-ivory font-semibold mb-4">Order Summary</h3>
                <div className="space-y-2 text-brand-beige">
                  <div className="flex justify-between">
                    <span>Tickets ({numTickets})</span>
                    <span>₦{(numTickets * ticketPrice).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-brand-gold/40 text-brand-ivory font-bold text-lg">
                    <span>Total</span>
                    <span className="text-brand-gold">₦{totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 px-6 py-3 border border-brand-beige/30 text-brand-ivory rounded-lg hover:bg-white/5 transition-colors"
              >
                Back
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-brand-gold text-brand-brown font-semibold rounded-lg hover:bg-brand-beige transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                step === 1 ? 'Continue to Payment' : 'Complete Booking'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}