import { Resend } from "resend";

// Lazy Resend client - only instantiated when an email is actually sent
function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  return new Resend(key);
}

interface ContactData {
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  message: string;
}

/**
 * Send notification email to the villa owner/manager
 */
export async function sendClientNotification(data: ContactData) {
  const { name, email, phone, preferredDate, message } = data;

  return getResend().emails.send({
    // CONFIGURE: Set your verified "from" address in .env.local
    from: process.env.FROM_EMAIL || "Villa Serena <info@villa-serena.nl>",
    to: process.env.CONTACT_EMAIL || "info@villa-serena.nl",
    subject: `New Villa Serena Inquiry - ${name}`,
    html: `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background: #FAF8F5; padding: 40px;">
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="font-size: 28px; font-weight: 300; color: #2C2824; margin: 0;">Villa Serena</h1>
          <div style="width: 40px; height: 1px; background: #B8975A; margin: 16px auto;"></div>
          <p style="font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #B8975A; margin: 0;">New Inquiry</p>
        </div>
        
        <div style="background: white; padding: 32px; border: 1px solid rgba(44,40,36,0.08);">
          <table style="width: 100%; border-collapse: collapse; font-size: 15px; color: #2C2824;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #F5F0EB; font-weight: 500; width: 140px; vertical-align: top;">Name</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #F5F0EB;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #F5F0EB; font-weight: 500; vertical-align: top;">Email</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #F5F0EB;"><a href="mailto:${email}" style="color: #B8975A;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #F5F0EB; font-weight: 500; vertical-align: top;">Phone</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #F5F0EB;">${phone || "Not provided"}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #F5F0EB; font-weight: 500; vertical-align: top;">Preferred Dates</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #F5F0EB;">${preferredDate || "Not specified"}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; font-weight: 500; vertical-align: top;">Message</td>
              <td style="padding: 12px 0;">${message || "No message"}</td>
            </tr>
          </table>
        </div>
        
        <p style="font-size: 12px; color: #8C8279; text-align: center; margin-top: 24px;">
          Received via villa-serena.nl contact form
        </p>
      </div>
    `,
  });
}

/**
 * Send confirmation email to the guest
 */
export async function sendGuestConfirmation(data: ContactData) {
  const { name, email } = data;

  return getResend().emails.send({
    from: process.env.FROM_EMAIL || "Villa Serena <info@villa-serena.nl>",
    to: email,
    subject: "Thank you for your inquiry - Villa Serena",
    html: `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background: #FAF8F5; padding: 40px;">
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="font-size: 28px; font-weight: 300; color: #2C2824; margin: 0;">Villa Serena</h1>
          <div style="width: 40px; height: 1px; background: #B8975A; margin: 16px auto;"></div>
        </div>
        
        <div style="background: white; padding: 32px; border: 1px solid rgba(44,40,36,0.08);">
          <p style="font-size: 16px; color: #2C2824; line-height: 1.8; margin: 0 0 20px 0;">
            Dear ${name},
          </p>
          
          <p style="font-size: 15px; color: #4A4540; line-height: 1.8; margin: 0 0 20px 0;">
            Thank you for your interest in Villa Serena. We&rsquo;ve received your inquiry and are delighted 
            that you&rsquo;re considering our estate for your stay in Italy.
          </p>
          
          <p style="font-size: 15px; color: #4A4540; line-height: 1.8; margin: 0 0 20px 0;">
            We will review your request carefully and respond within 24 hours with a tailored proposal 
            that fits your group and your preferred season.
          </p>
          
          <p style="font-size: 15px; color: #4A4540; line-height: 1.8; margin: 0 0 20px 0;">
            In the meantime, should you have any questions, please don&rsquo;t hesitate to reach out.
          </p>
          
          <div style="width: 40px; height: 1px; background: #B8975A; margin: 30px 0;"></div>
          
          <p style="font-size: 15px; color: #2C2824; line-height: 1.8; margin: 0; font-style: italic;">
            With warm regards,<br>
            The Villa Serena Team
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <p style="font-size: 12px; color: #8C8279; margin: 0;">
            Villa Serena &middot; Umbria&ndash;Tuscany, Italy
          </p>
          <p style="font-size: 11px; color: #8C8279; margin: 4px 0 0 0;">
            A private Italian estate between Rome &amp; Florence
          </p>
        </div>
      </div>
    `,
  });
}
