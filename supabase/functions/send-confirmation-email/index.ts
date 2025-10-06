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
    const { email, fullName, ticketCode, numTickets, paymentStatus } = await req.json();

    // Email content
    const subject = "Booking Confirmation - Bon Appétit";
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); color: #d4af37; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .ticket-code { background: #d4af37; color: #000; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; border-radius: 5px; margin: 20px 0; letter-spacing: 2px; }
          .details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .warning { background: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #d4af37; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 36px;">Bon Appétit</h1>
            <p style="margin: 10px 0 0 0; font-size: 18px; letter-spacing: 2px;">A FINE DINING BUFFET</p>
          </div>
          <div class="content">
            <h2>Dear ${fullName},</h2>
            <p>${paymentStatus === 'paid' 
              ? 'Thank you for your booking! Your payment has been confirmed and your tickets are secured.' 
              : 'Thank you for your booking! We have received your reservation.'}</p>
            
            <div class="ticket-code">
              ${ticketCode}
            </div>
            <p style="text-align: center; color: #666; font-size: 14px;">Your Unique Ticket Code</p>
            
            <div class="details">
              <h3 style="margin-top: 0; color: #d4af37;">Event Details</h3>
              <p><strong>Event:</strong> Bon Appétit - A Fine Dining Buffet</p>
              <p><strong>Date:</strong> December 20, 2025</p>
              <p><strong>Time:</strong> 5:00 PM - 12:00 AM</p>
              <p><strong>Venue:</strong> The Grand Pavilion</p>
              <p><strong>Number of Tickets:</strong> ${numTickets}</p>
              <p><strong>Total Amount:</strong> ₦${(numTickets * 85000).toLocaleString()}</p>
            </div>
            
            ${paymentStatus !== 'paid' ? `
            <div class="warning">
              <strong>⚠️ Payment Pending</strong><br>
              Please complete your bank transfer to:<br><br>
              <strong>Bank:</strong> GTBank<br>
              <strong>Account Number:</strong> 0489704166<br>
              <strong>Account Name:</strong> Thabolwethu Dube<br><br>
              Your tickets will be confirmed once payment is verified.
            </div>
            ` : ''}
            
            <h3>What to Bring</h3>
            <ul>
              <li>This email or your ticket code: <strong>${ticketCode}</strong></li>
              <li>Valid photo ID</li>
              <li>Your best formal attire</li>
            </ul>
            
            <h3>Event Schedule</h3>
            <ul>
              <li><strong>5:00 PM - 6:00 PM:</strong> Red Carpet Reception with champagne</li>
              <li><strong>6:30 PM - 10:00 PM:</strong> Fine Dining Buffet with premium cuisine</li>
              <li><strong>10:00 PM - 12:00 AM:</strong> After Party with drinks, BBQ & live music</li>
            </ul>
            
            <div class="details">
              <h3 style="margin-top: 0; color: #d4af37;">Important Reminders</h3>
              <p><strong>Dress Code:</strong> Formal attire required</p>
              <p><strong>Entry:</strong> Present your ticket code and valid ID</p>
              <p><strong>Age Limit:</strong> 18+ only</p>
              <p><strong>Arrival:</strong> Please arrive by 5:30 PM for the red carpet</p>
            </div>
            
            <p style="margin-top: 30px;">We look forward to hosting you at this exclusive culinary experience!</p>
            <p><strong>For inquiries:</strong><br>
            Email: events@bonappetit.com<br>
            Phone: +234 801 234 5678</p>
          </div>
          <div class="footer">
            <p>© 2025 Bon Appétit. All rights reserved.</p>
            <p>This is an automated confirmation email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Log the email (in production, integrate with email service like SendGrid, Resend, etc.)
    console.log('=== EMAIL NOTIFICATION ===');
    console.log('To:', email);
    console.log('Subject:', subject);
    console.log('Ticket Code:', ticketCode);
    console.log('Payment Status:', paymentStatus);
    console.log('========================');
    
    // Note: To actually send emails, integrate with an email service provider
    // Example with Resend:
    // const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    // const emailResponse = await fetch('https://api.resend.com/emails', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${RESEND_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     from: 'Bon Appétit <noreply@bonappetit.com>',
    //     to: email,
    //     subject: subject,
    //     html: htmlContent,
    //   }),
    // });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Confirmation email sent',
        email: email,
        ticketCode: ticketCode,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error sending email:', error);
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