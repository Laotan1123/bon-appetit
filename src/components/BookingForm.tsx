import { useState, useEffect } from 'react';
import { X, Loader2, Check } from 'lucide-react';
import emailjs from 'emailjs-com';

interface BookingFormProps {
  isVisible: boolean;
  onClose: () => void;
}

const TICKET_PRICE = 60500;
const EVENT_NAME = 'Pastry & Grills';
const EVENT_DATE = 'Saturday, November 29th';
const EVENT_TIME = '5:00PM - 12:00AM';
const EVENT_VENUE = 'Godaif Village, Casa Asmarina, Turnbull Road, Ikoyi, Lagos';

export default function BookingForm({ isVisible, onClose }: BookingFormProps) {
  useEffect(() => {
    const publicKey =
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY || import.meta.env.REACT_APP_EMAILJS_PUBLIC_KEY;
    if (publicKey) {
      try {
        emailjs.init(publicKey);
      } catch (err) {
        console.warn('EmailJS init failed:', err);
      }
    }
  }, []);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
  const [proofOfPayment, setProofOfPayment] = useState<File | null>(null);

  const baseAmount = TICKET_PRICE * numTickets;
  const totalAmount = baseAmount;

  const updateGuestNames = (count: number) => {
    const newGuestNames = Array(count).fill('').map((_, i) => guestNames[i] || '');
    setGuestNames(newGuestNames);
  };

  const handleNumTicketsChange = (value: number) => {
    setNumTickets(value);
    updateGuestNames(value);
  };

  const generateTicketCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'BA-';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
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

      let proofData: ProofData = '';
      if (proofOfPayment) {
        try {
          proofData = await fileToBase64(proofOfPayment);
        } catch (err) {
          console.error('Failed to read proof of payment file:', err);
          alert('Could not read the uploaded proof of payment. Please try again.');
          setLoading(false);
          return;
        }
      }

      try {
        alert('Uploading your transfer proof...');
        await saveBooking('pending', ticketCode, proofData);
        alert('Booking received - pending payment confirmation.');
      } catch (err: any) {
        console.error('Bank transfer submission failed:', err);
        alert(
          `We could not submit your bank transfer booking. Please try again.

Details: ${
            err?.message || 'Unknown error'
          }`
        );
        throw err;
      }

      try {
        const serviceId =
          import.meta.env.VITE_EMAILJS_SERVICE_ID || import.meta.env.REACT_APP_EMAILJS_SERVICE_ID;
        const templateId =
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID || import.meta.env.REACT_APP_EMAILJS_TEMPLATE_ID;
        const publicKey =
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY || import.meta.env.REACT_APP_EMAILJS_PUBLIC_KEY;

        const templateParams = {
          full_name: fullName,
          event_name: EVENT_NAME,
          num_tickets: String(numTickets),
          amount: `NGN ${totalAmount.toLocaleString()}`,
          event_date: EVENT_DATE,
          event_time: EVENT_TIME,
          venue: EVENT_VENUE,
          email: email,
          ticket_code: ticketCode,
          payment_reference: typeof proofData === 'string' ? proofData : (proofData as any).name || '',
          to_email: email,
        };

        if (serviceId && templateId && publicKey) {
          emailjs
            .send(serviceId, templateId, templateParams, publicKey)
            .then(() => {
              console.log('EmailJS: bank-transfer confirmation queued');
              alert('Booking received - a confirmation email was sent to ' + email);
            })
            .catch((err) => {
              console.error('EmailJS send error (bank transfer):', err);
              alert('Booking received but we could not send a confirmation email. Please check your inbox or contact support.');
            });
        } else {
          console.warn('EmailJS service/template not configured in env vars (bank transfer)');
        }
      } catch (err) {
        console.error('Error sending confirmation email (bank transfer):', err);
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  const fileToBase64 = (file: File): Promise<{ name: string; mime: string; base64: string }> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.onload = () => {
      const result = reader.result as string;
      const parts = result.split(',');
      const base64 = parts[1] || '';
      const mimeMatch = (parts[0] || '').match(/data:(.*);base64/);
      const mime = mimeMatch ? mimeMatch[1] : file.type || 'application/octet-stream';
      resolve({ name: file.name, mime, base64 });
    };
    reader.readAsDataURL(file);
  });

  type ProofData = { name: string; mime: string; base64: string } | string;

  const saveBooking = async (paymentStatus: string, ticketCode: string, paymentRef: ProofData) => {
    try {
      const sheetUrl = import.meta.env.VITE_SHEET_WEBAPP_URL;
      const clientSecret = import.meta.env.VITE_SHEET_SECRET;

      if (!sheetUrl) throw new Error('VITE_SHEET_WEBAPP_URL not set in .env');
      if (!clientSecret) throw new Error('VITE_SHEET_SECRET not set in .env');

      const payload: any = {
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
        paymentMethod: 'bank_transfer',
        paymentStatus,
        paymentReference: paymentRef,
        ticketCode,
        ticketType: `${EVENT_NAME} Ticket`,
        ticketPrice: TICKET_PRICE,
        baseAmount,
        processingFee: 0,
        totalAmount,
        amountPaid: totalAmount,
      };
      if (paymentRef && typeof paymentRef !== 'string') {
        payload.proofName = paymentRef.name;
        payload.proofMime = paymentRef.mime;
        payload.proofData = paymentRef.base64;
      }

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
    setProofOfPayment(null);
    setSubmitted(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

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
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-brand-maroon border border-brand-cream/30 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-2xl font-serif text-brand-cream mb-4">Booking Received!</h3>
          <p className="text-brand-cream/90 mb-6">
            Your booking has been received. Please complete the bank transfer and we will verify your payment shortly.
          </p>
          <p className="text-sm text-brand-cream/80 mb-6">
            A confirmation email with your ticket code has been sent to {email}
          </p>
          <button
            onClick={handleClose}
            className="w-full px-6 py-3 bg-brand-cream text-brand-maroon font-semibold rounded-lg hover:bg-brand-cream/90 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={handleOverlayClick}
      data-booking-form
    >
      <button
        aria-label="Close booking form"
        onClick={handleClose}
        className="absolute top-4 right-4 z-60 w-10 h-10 rounded-full bg-black/40 flex items-center justify-center text-brand-cream hover:bg-black/60"
      >
        <X className="w-5 h-5" />
      </button>

      <div
        className="bg-brand-maroon border border-brand-cream/30 rounded-2xl w-full max-w-3xl my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-brand-cream/30 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif text-brand-cream">Book Your Tickets</h2>
            <p className="text-brand-cream/90 text-sm mt-1">Step {step} of 2</p>
          </div>
          <button
            onClick={handleClose}
            className="text-brand-cream hover:text-brand-cream transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="px-6 py-4 bg-brand-maroonDark/50 border-b border-brand-cream/30">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <p className="text-brand-cream/80 text-sm">
              Pastry & Grills at Godaif Village. Bank transfer ticket: NGN 60,500. Please arrive by 5pm so service flows accordingly. Prices include processing fees.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-8 max-h-[80vh] overflow-y-auto"
          role="form"
          aria-label="Booking form"
        >
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label htmlFor="fullName" className="block text-brand-cream mb-2 font-medium">
                  Full Name <span className="text-sm text-brand-cream/80" aria-hidden="true">*</span>
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
                  className="w-full px-4 py-3 sm:py-3 text-base bg-brand-maroonDark/40 border border-brand-cream/30 rounded-lg text-brand-cream focus:border-brand-cream focus:outline-none focus:ring-2 focus:ring-brand-cream/30 transition"
                  placeholder="Enter your full name"
                />
                <p className="mt-2 text-sm text-brand-cream/80">This name will appear on the booking confirmation and ticket.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-brand-cream mb-2 font-medium">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-brand-maroonDark/40 border border-brand-cream/30 rounded-lg text-brand-cream focus:border-brand-cream focus:outline-none"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-brand-cream mb-2 font-medium">Phone (WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-brand-maroonDark/40 border border-brand-cream/30 rounded-lg text-brand-cream focus:border-brand-cream focus:outline-none"
                    placeholder="+234 xxx xxx xxxx"
                  />
                </div>
              </div>

              <div>
                <label className="block text-brand-cream mb-2 font-medium">Number of Tickets *</label>
                <select
                  value={numTickets}
                  onChange={(e) => handleNumTicketsChange(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-brand-maroonDark/40 border border-brand-cream/30 rounded-lg text-brand-cream focus:border-brand-cream focus:outline-none"
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num} Ticket{num > 1 ? 's' : ''} - NGN {(num * TICKET_PRICE).toLocaleString()} (Bank transfer)</option>
                  ))}
                </select>
                <p className="mt-2 text-sm text-brand-cream/80">Bank transfer: NGN 60,500 each. Prices include processing fees.</p>
              </div>

              <div>
                <label className="block text-brand-cream mb-2 font-medium">Guest Names *</label>
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
                      className="w-full px-4 py-3 bg-brand-maroonDark/40 border border-brand-cream/30 rounded-lg text-brand-cream focus:border-brand-cream focus:outline-none"
                      placeholder={`Guest ${index + 1} name`}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-brand-cream mb-2 font-medium">Emergency Contact Name *</label>
                  <input
                    type="text"
                    required
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    className="w-full px-4 py-3 bg-brand-maroonDark/40 border border-brand-cream/30 rounded-lg text-brand-cream focus:border-brand-cream focus:outline-none"
                    placeholder="Emergency contact name"
                  />
                </div>

                <div>
                  <label className="block text-brand-cream mb-2 font-medium">Emergency Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-brand-maroonDark/40 border border-brand-cream/30 rounded-lg text-brand-cream focus:border-brand-cream focus:outline-none"
                    placeholder="+234 xxx xxx xxxx"
                  />
                </div>
              </div>

              <div>
                <label className="block text-brand-cream mb-2 font-medium">Dietary Preferences / Allergies</label>
                <textarea
                  value={dietary}
                  onChange={(e) => setDietary(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-brand-maroonDark/40 border border-brand-cream/30 rounded-lg text-brand-cream focus:border-brand-cream focus:outline-none resize-none"
                  placeholder="Any dietary restrictions or allergies we should know about?"
                />
              </div>

              <div>
                <label className="block text-brand-cream mb-2 font-medium">Special Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-brand-maroonDark/40 border border-brand-cream/30 rounded-lg text-brand-cream focus:border-brand-cream focus:outline-none resize-none"
                  placeholder="Anniversary, birthday celebration, VIP requests, etc."
                />
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-brand-cream"
                />
                <label htmlFor="terms" className="text-brand-cream text-sm">
                  I agree to the event terms and conditions including dress code requirements and the no refund policy. *
                </label>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-brand-maroonDark/60 border border-brand-cream/30 rounded-lg p-6">
                <h3 className="text-brand-cream font-semibold mb-4">Bank Transfer Details</h3>
                <div className="space-y-2 text-brand-cream/90">
                  <div className="flex justify-between">
                    <span>Bank Name:</span>
                    <span className="font-semibold text-brand-cream">GTBank</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Account Number:</span>
                    <span className="font-semibold text-brand-cream">0489704166</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Account Name:</span>
                    <span className="font-semibold text-brand-cream">Thabolwethu Dube</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-brand-cream/30">
                    <span>Total to Pay:</span>
                    <span className="font-bold text-brand-cream text-xl">NGN {baseAmount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-brand-cream mb-2 font-medium">Upload Proof of Payment *</label>
                  <input
                    type="file"
                    required
                    accept="image/*,.pdf"
                    onChange={(e) => setProofOfPayment(e.target.files?.[0] || null)}
                    className="w-full px-4 py-3 bg-brand-maroonDark/30 border border-brand-cream/30 rounded-lg text-brand-cream focus:border-brand-cream focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-brand-cream file:text-brand-maroon file:font-semibold"
                  />
                  <p className="text-brand-cream/80 text-sm mt-2">Please upload a screenshot or receipt of your transfer. Prices include processing fees.</p>
                </div>
              </div>

              <div className="bg-brand-cream/10 border border-brand-cream/40 rounded-lg p-6">
                <h3 className="text-brand-cream font-semibold mb-4">Order Summary</h3>
                <div className="space-y-2 text-brand-cream/90">
                  <div className="flex justify-between">
                    <span>Bank Transfer Tickets ({numTickets})</span>
                    <span>NGN {baseAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-brand-cream/40 text-brand-cream font-bold text-lg">
                    <span>Total</span>
                    <span className="text-brand-cream">NGN {totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="text-xs text-brand-cream/70 text-center mt-2">
                    All prices include processing fees. Bank transfer: NGN {TICKET_PRICE.toLocaleString()} per guest.
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4 mt-8">
            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 px-6 py-3 border border-brand-cream/30 text-brand-cream rounded-lg hover:bg-white/5 transition-colors"
              >
                Back
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-brand-cream text-brand-maroon font-semibold rounded-lg hover:bg-brand-cream/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
