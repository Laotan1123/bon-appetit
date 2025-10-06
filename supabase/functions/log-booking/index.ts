import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface BookingData {
  fullName: string;
  email: string;
  phone: string;
  numTickets: number;
  guestNames: string[];
  emergencyName: string;
  emergencyPhone: string;
  dietary: string;
  notes: string;
  paymentMethod: string;
  paymentStatus: string;
  ticketCode: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const bookingData: BookingData = await req.json();

    // Get Google Sheets credentials from environment
    const GOOGLE_SHEETS_API_KEY = Deno.env.get('GOOGLE_SHEETS_API_KEY');
    const GOOGLE_SHEET_ID = Deno.env.get('GOOGLE_SHEET_ID');
    const GOOGLE_SERVICE_ACCOUNT_EMAIL = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_EMAIL');
    const GOOGLE_PRIVATE_KEY = Deno.env.get('GOOGLE_PRIVATE_KEY');

    if (!GOOGLE_SHEET_ID) {
      throw new Error('Google Sheets configuration missing');
    }

    // Generate JWT for Google API authentication
    const createJWT = async () => {
      const header = {
        alg: 'RS256',
        typ: 'JWT',
      };

      const now = Math.floor(Date.now() / 1000);
      const payload = {
        iss: GOOGLE_SERVICE_ACCOUNT_EMAIL,
        scope: 'https://www.googleapis.com/auth/spreadsheets',
        aud: 'https://oauth2.googleapis.com/token',
        exp: now + 3600,
        iat: now,
      };

      const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
      const encodedPayload = btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

      const signatureInput = `${encodedHeader}.${encodedPayload}`;
      
      // Import private key
      const pemKey = GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '';
      const pemContents = pemKey
        .replace('-----BEGIN PRIVATE KEY-----', '')
        .replace('-----END PRIVATE KEY-----', '')
        .replace(/\s/g, '');
      
      const binaryKey = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));
      
      const cryptoKey = await crypto.subtle.importKey(
        'pkcs8',
        binaryKey,
        {
          name: 'RSASSA-PKCS1-v1_5',
          hash: 'SHA-256',
        },
        false,
        ['sign']
      );

      const signature = await crypto.subtle.sign(
        'RSASSA-PKCS1-v1_5',
        cryptoKey,
        new TextEncoder().encode(signatureInput)
      );

      const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

      return `${signatureInput}.${encodedSignature}`;
    };

    // Get access token
    const getAccessToken = async () => {
      const jwt = await createJWT();
      
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
          assertion: jwt,
        }),
      });

      const data = await response.json();
      return data.access_token;
    };

    // Prepare row data
    const timestamp = new Date().toISOString();
    const guestNamesString = bookingData.guestNames.join(', ');
    const emergencyContact = `${bookingData.emergencyName} - ${bookingData.emergencyPhone}`;

    const rowData = [
      timestamp,
      bookingData.fullName,
      bookingData.email,
      bookingData.phone,
      bookingData.numTickets,
      guestNamesString,
      emergencyContact,
      bookingData.dietary || 'None',
      bookingData.notes || 'None',
      bookingData.paymentMethod === 'paystack' ? 'Paystack' : 'Bank Transfer',
      bookingData.paymentStatus === 'paid' ? 'Paid' : 'Pending',
      bookingData.ticketCode,
    ];

    // Append to Google Sheets
    const accessToken = await getAccessToken();
    
    const sheetsResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/Sheet1:append?valueInputOption=RAW`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [rowData],
        }),
      }
    );

    if (!sheetsResponse.ok) {
      const errorText = await sheetsResponse.text();
      throw new Error(`Google Sheets API error: ${errorText}`);
    }

    const result = await sheetsResponse.json();

    // Send confirmation email
    const emailResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-confirmation-email`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Booking logged to Google Sheets successfully',
        ticketCode: bookingData.ticketCode,
        sheetsResult: result,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error logging to Google Sheets:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Unknown error occurred',
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});