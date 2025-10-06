import Resend from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * POST /api/send-confirmation
 * Body: { fullName, email, numTickets, amount, paymentReference }
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { fullName, email, numTickets, amount, paymentReference } = req.body || {};

    if (!fullName || !email || !numTickets || !amount || !paymentReference) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const subject = "Your Bon Appétit Reservation is Confirmed";

    const html = `
      <div style="font-family:system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color:#111;">
        <h2 style="color:#b45309">Your Bon Appétit Reservation is Confirmed</h2>
        <p>Hi ${escapeHtml(fullName)},</p>

        <p>Thank you for your reservation. Below are your booking details:</p>

        <ul>
          <li><strong>Number of tickets:</strong> ${escapeHtml(String(numTickets))}</li>
          <li><strong>Amount paid:</strong> ₦${escapeHtml(String(amount))}</li>
          <li><strong>Payment reference:</strong> ${escapeHtml(paymentReference)}</li>
        </ul>

        <h3>Event details</h3>
        <p>
          <strong>Friday, October 31st</strong><br/>
          Eterniti by Amber, 4b Michelle Okocha Crescent, Parkview Estate, Ikoyi
        </p>
        <p>
          5:00PM – 6:00PM Red Carpet<br/>
          6:30PM – 10:00PM Dinner<br/>
          10:00PM – 12:00AM After Party
        </p>

        <p>If you have questions, reply to this email or contact events@bonappetit.com.</p>

        <p>Cheers,<br/>Bon Appétit Events Team</p>
      </div>
    `;

    // send email
    await resend.emails.send({
      from: "Bon Appétit <no-reply@yourdomain.com>", // replace with a verified sender in Resend
      to: email,
      subject,
      html,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Resend send error:", err);
    // Do not leak internal error details to the client
    return res.status(500).json({ success: false });
  }
}

// minimal HTML-escaping helper to avoid accidental HTML injection
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}