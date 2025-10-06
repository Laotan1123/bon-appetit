# Bon Appétit Event Website - Setup Guide

A luxury event booking website for the Bon Appétit Fine Dining Buffet with Google Sheets integration.

## Features Implemented

### 1. Google Sheets Database
- All booking data is automatically logged to Google Sheets
- Each row contains: Timestamp, Full Name, Email, Phone, Number of Tickets, Guest Names, Emergency Contact, Dietary Preferences, Notes, Payment Method, Payment Status, Unique Ticket Code
- Secure server-side integration via Edge Functions
- No Supabase/Bolt database required

### 2. Hero Section
- Elegant black, gold, and white color scheme
- Event details prominently displayed
- Call-to-action button
- Responsive design

### 3. What to Expect Section
- Timeline of event activities
- Red Carpet (5-6 PM)
- Dinner Buffet (6:30-10 PM)
- After Party (10 PM-12 AM)

### 4. Booking Form
Multi-step form with:
- Full name, email, phone (WhatsApp)
- Number of tickets (1-5) with dynamic pricing
- Guest names for all attendees
- Emergency contact information
- Dietary preferences/allergies
- Special notes (anniversary, birthday, VIP)
- Terms and conditions checkbox

### 5. Payment Integration

#### Paystack Integration
- Secure card payments
- Real-time payment verification
- Automatic booking confirmation

#### Bank Transfer Option
- GTB account details displayed
- Account: 0489704166 (Thabolwethu Dube)
- Upload proof of payment
- Manual verification workflow

### 6. Email Notifications
Edge Function deployed for:
- Confirmation email on booking
- E-ticket with unique ticket code
- Payment status updates
- Event details and schedule

### 7. Footer
- Contact information
- Social media links
- Terms & conditions
- Dress code, refund policy, entry requirements

## Setup Instructions

### 1. Google Sheets Setup

#### Step 1: Create Your Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Bon Appétit Bookings" (or your preferred name)
4. In the first row (header row), add these column headers:
   ```
   Timestamp | Full Name | Email | Phone | Number of Tickets | Guest Names | Emergency Contact | Dietary Preferences | Notes | Payment Method | Payment Status | Ticket Code
   ```
5. Copy the Sheet ID from the URL:
   - URL format: `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`
   - The SHEET_ID is the long string between `/d/` and `/edit`

#### Step 2: Create Google Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or select existing one)
3. Enable the Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"
4. Create a service account:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "Service Account"
   - Fill in the service account details
   - Click "Create and Continue"
   - Skip the optional steps and click "Done"
5. Create and download the service account key:
   - Click on the service account you just created
   - Go to the "Keys" tab
   - Click "Add Key" > "Create new key"
   - Select "JSON" format
   - Click "Create" - this downloads a JSON file
6. Open the JSON file and find:
   - `client_email` - This is your GOOGLE_SERVICE_ACCOUNT_EMAIL
   - `private_key` - This is your GOOGLE_PRIVATE_KEY

#### Step 3: Share Your Google Sheet

1. Open your Google Sheet
2. Click the "Share" button (top right)
3. Paste the service account email (from the JSON file: `client_email`)
4. Give it "Editor" access
5. Click "Send"

#### Step 4: Configure Environment Variables

Update your `.env` file with your Google credentials:

```bash
# Google Sheets Configuration
GOOGLE_SHEET_ID=your_actual_sheet_id_here
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project-id.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYour_Actual_Private_Key_Here\n-----END PRIVATE KEY-----
```

**Important Notes:**
- For `GOOGLE_PRIVATE_KEY`, copy the entire private key from the JSON file, including the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` markers
- Replace actual newlines with `\n` in the private key
- Keep the private key secure and never commit it to version control

### 2. Paystack Configuration

To enable card payments:

1. Sign up at [Paystack](https://paystack.com)
2. Go to Settings > API Keys & Webhooks
3. Copy your **Public Key**
4. Update `.env` file:
   ```
   VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_actual_key_here
   ```
   Or for production:
   ```
   VITE_PAYSTACK_PUBLIC_KEY=pk_live_your_actual_key_here
   ```

### 3. Email Service Setup (Optional)

The Edge Function is deployed but currently logs emails to the console. To send actual emails:

1. Choose an email service (recommended: Resend, SendGrid, or Mailgun)
2. Sign up and get API key
3. Update the Edge Function at `supabase/functions/send-confirmation-email/index.ts`
4. Uncomment and configure the email service integration

Example for Resend:
```typescript
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${RESEND_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    from: 'Bon Appétit <noreply@bonappetit.com>',
    to: email,
    subject: subject,
    html: htmlContent,
  }),
});
```

## How It Works

### Booking Flow

1. **User fills out the booking form** with all required details
2. **User selects payment method**:
   - **Paystack**: Opens payment modal, processes card payment
   - **Bank Transfer**: Shows bank details, user uploads proof
3. **On successful payment/submission**:
   - A unique ticket code is generated (format: BA-XXXXXXXX)
   - Booking data is sent to the `log-booking` Edge Function
   - Edge Function authenticates with Google API using service account
   - Booking data is appended as a new row in Google Sheets
   - Confirmation email is sent via `send-confirmation-email` Edge Function
4. **User receives confirmation** with ticket code

### Accessing Your Bookings

1. Open your Google Sheet
2. All bookings appear as new rows in real-time
3. You can:
   - Filter by payment status
   - Search for specific guests
   - Export to CSV/Excel
   - Create charts and reports
   - Share with team members

## Testing

### Test Paystack:
Use Paystack test cards:
- Card: 4084084084084081
- CVV: 408
- Expiry: Any future date
- PIN: 0000
- OTP: 123456

### Test Bank Transfer:
1. Select "Bank Transfer" option
2. Upload any image as proof
3. Check Google Sheet for the new booking with "Pending" status

### Test Google Sheets Integration:
1. Fill out a test booking
2. Complete payment (or upload proof)
3. Check your Google Sheet - a new row should appear within seconds
4. Verify all data is correctly recorded

## Event Details Customization

To update event details, edit:
- `src/components/Hero.tsx` - Date, time, venue, price
- `src/components/WhatToExpect.tsx` - Timeline and activities
- `src/components/Footer.tsx` - Contact info and terms

## Security Best Practices

1. **Never commit credentials to Git**
   - Add `.env` to `.gitignore` (already configured)
   - Use environment variables for all sensitive data

2. **Protect your service account key**
   - Store securely
   - Rotate periodically
   - Limit access to "Editor" role only

3. **Use HTTPS in production**
   - Ensure all API calls use secure connections
   - Enable SSL on your domain

4. **Validate all inputs**
   - Form validation is already implemented
   - Server-side validation in Edge Functions

## Production Checklist

Before going live:
- [ ] Update Paystack key to production key (`pk_live_...`)
- [ ] Configure email service (Resend, SendGrid, etc.)
- [ ] Update event date, time, venue in Hero component
- [ ] Update contact information in Footer
- [ ] Test complete booking flow end-to-end
- [ ] Verify Google Sheets integration is working
- [ ] Set up Google Sheet sharing with team members
- [ ] Create backup/export schedule for booking data
- [ ] Test email notifications
- [ ] Update social media links in Footer
- [ ] Set up domain and SSL certificate
- [ ] Configure payment webhook (optional, for automatic verification)

## Troubleshooting

### Google Sheets Not Working?

1. **Check Sheet ID**: Make sure you copied the correct ID from the URL
2. **Verify Service Account Email**: Ensure the sheet is shared with the service account email
3. **Check Permissions**: Service account must have "Editor" access
4. **Private Key Format**: Ensure `\n` is used for newlines in the private key
5. **API Enabled**: Verify Google Sheets API is enabled in your Google Cloud project
6. **Check Edge Function Logs**: Look for error messages in the Supabase Edge Function logs

### Paystack Not Working?

1. Ensure Paystack script is loaded (check browser console)
2. Verify public key is correct in `.env`
3. Check that you're using test mode keys for testing

### Email Not Sending?

1. Email service integration is optional - set it up separately
2. Check Edge Function logs for errors
3. Verify email service API key is configured

## Support

For technical support or questions about the website:
- Check the Edge Function logs in Supabase Dashboard
- Review Google Sheets for booking data
- Contact: tech-support@example.com

For event inquiries:
- Email: events@bonappetit.com
- Phone: +234 801 234 5678
