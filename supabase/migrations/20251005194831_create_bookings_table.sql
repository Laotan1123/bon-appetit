/*
  # Create Bookings Table for Bon Appétit Event

  1. New Tables
    - `bookings`
      - `id` (uuid, primary key) - Unique booking identifier
      - `created_at` (timestamptz) - Booking timestamp
      - `full_name` (text) - Primary guest name
      - `email` (text) - Contact email
      - `phone` (text) - WhatsApp contact number
      - `num_tickets` (integer) - Number of tickets (1-5)
      - `guest_names` (text array) - Names of all guests
      - `emergency_contact_name` (text) - Emergency contact person
      - `emergency_contact_phone` (text) - Emergency contact number
      - `dietary_preferences` (text) - Dietary restrictions/allergies
      - `notes` (text) - Special notes (anniversary, birthday, VIP)
      - `payment_method` (text) - 'paystack' or 'bank_transfer'
      - `payment_status` (text) - 'paid', 'pending', 'verified'
      - `payment_reference` (text) - Paystack reference or upload URL
      - `terms_accepted` (boolean) - Confirmation of terms acceptance
      - `ticket_code` (text, unique) - Unique ticket QR code
      - `reminder_sent_week` (boolean) - Track week reminder
      - `reminder_sent_day` (boolean) - Track day reminder
      - `thank_you_sent` (boolean) - Track thank you email

  2. Security
    - Enable RLS on `bookings` table
    - Add policy for public to insert bookings
    - Add policy for authenticated users to read all bookings (for admin)
*/

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  num_tickets integer NOT NULL CHECK (num_tickets >= 1 AND num_tickets <= 5),
  guest_names text[] NOT NULL,
  emergency_contact_name text NOT NULL,
  emergency_contact_phone text NOT NULL,
  dietary_preferences text DEFAULT '',
  notes text DEFAULT '',
  payment_method text NOT NULL CHECK (payment_method IN ('paystack', 'bank_transfer')),
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('paid', 'pending', 'verified')),
  payment_reference text,
  terms_accepted boolean DEFAULT true,
  ticket_code text UNIQUE DEFAULT substring(md5(random()::text || clock_timestamp()::text) from 1 for 10),
  reminder_sent_week boolean DEFAULT false,
  reminder_sent_day boolean DEFAULT false,
  thank_you_sent boolean DEFAULT false
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create bookings"
  ON bookings
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read all bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);