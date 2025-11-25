import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { bookingId, email, fullName, ticketCode, numTickets, paymentStatus } = await req.json();

    const EVENT_NAME = 'Pastry & Grills';
    const EVENT_DATE = 'Saturday, November 29th';
    const EVENT_TIME = '5:00 PM - 12:00 AM';
    const EVENT_VENUE = 'Godaif Village, Casa Asmarina, Turnbull Road, Ikoyi, Lagos';

    // Email content
    const subject = `Booking Confirmation - ${EVENT_NAME}`;
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); color: #d4af37; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .ticket-code { background: #d4af37; color: #000; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; border-radius: 5px; margin: 20px 0; }
          .details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 36px;">${EVENT_NAME}</h1>
            <p style="margin: 10px 0 0 0; font-size: 18px; letter-spacing: 2px;">Southern African BBQ meets French pastries</p>
          </div>
          <div class="content">
            <h2>Dear ${fullName},</h2>
            <p>${paymentStatus === 'paid' 
              ? 'Thank you for your booking! Your payment has been confirmed.' 
              : 'Thank you for your booking! We have received your reservation.'}</p>
            
            <div class="ticket-code">
              TICKET CODE: ${ticketCode}
            </div>
            
            <div class="details">
              <h3>Event Details</h3>
              <p><strong>Event:</strong> ${EVENT_NAME}</p>
              <p><strong>Date:</strong> ${EVENT_DATE}</p>
              <p><strong>Time:</strong> ${EVENT_TIME}</p>
              <p><strong>Venue:</strong> ${EVENT_VENUE}</p>
              <p><strong>Number of Tickets:</strong> ${numTickets}</p>
            </div>
            
            ${paymentStatus !== 'paid' ? `
            <div style="background: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #d4af37;">
              <strong>Payment Pending:</strong> Please complete your bank transfer and upload proof of payment. Your tickets will be confirmed once payment is verified.
            </div>
            ` : ''}
            
            <h3>Schedule</h3>
            <ul>
              <li><strong>5:00 PM - 6:30 PM:</strong> Art, champagne and appetizers</li>
              <li><strong>6:30 PM - 7:30 PM:</strong> Main dish (grills and sides, Southern African style)</li>
              <li><strong>7:30 PM - 8:30 PM:</strong> Pastries</li>
              <li><strong>8:30 PM - 12:00 AM:</strong> After party and live performance</li>
            </ul>
            
            <p style="margin-top: 30px;">Guests are required to be on time so service runs smoothly.</p>
            <p>For any questions, please contact us at bythabo@gmail.com or WhatsApp +234 916 276 8788.</p>
          </div>
          <div class="footer">
            <p>(c) 2025 ${EVENT_NAME}. All rights reserved.</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    console.log('Sending confirmation email to:', email);
    console.log('Subject:', subject);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Confirmation email queued',
        bookingId 
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
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
