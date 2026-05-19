import { NextResponse } from "next/server";
import { Resend } from "resend";
import { isRateLimited, getIp, sanitize } from "@/lib/rateLimit";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  return new Resend(key);
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function nights(start: string, end: string) {
  const diff = (new Date(end).getTime() - new Date(start).getTime()) / 86_400_000;
  return Math.round(diff);
}

export async function POST(request: Request) {
  // Rate limit: 5 submissions per IP per minute
  const ip = getIp(request);
  if (isRateLimited(ip, 5, 60_000)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment and try again." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();

    // Honeypot
    if (body._trap) return NextResponse.json({ success: true });

    const rawName = sanitize(body.name, 120);
    const rawEmail = sanitize(body.email, 254);
    const rawPhone = sanitize(body.phone, 30);
    const rawGuests = sanitize(body.guests, 100);
    const rawMessage = sanitize(body.message, 2000);
    const rawCheckIn = sanitize(body.checkIn, 10);
    const rawCheckOut = sanitize(body.checkOut, 10);

    const { name, email, phone, checkIn, checkOut, guests, message } = {
      name: rawName, email: rawEmail, phone: rawPhone,
      checkIn: rawCheckIn, checkOut: rawCheckOut,
      guests: rawGuests, message: rawMessage,
    } as {
      name: string; email: string; phone?: string;
      checkIn: string; checkOut: string;
      guests?: string; message?: string;
    };

    if (!name || !email || !checkIn || !checkOut) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const n = nights(checkIn, checkOut);
    const fromEmail = process.env.FROM_EMAIL || "Villa Serena <info@villa-serena.nl>";
    const toEmail = process.env.CONTACT_EMAIL || "info@villa-serena.nl";

    const ownerHtml = `
      <div style="font-family:'Georgia',serif;max-width:600px;margin:0 auto;background:#FAF8F5;padding:40px;">
        <div style="text-align:center;margin-bottom:40px;">
          <h1 style="font-size:28px;font-weight:300;color:#2C2824;margin:0;">Villa Serena</h1>
          <div style="width:40px;height:1px;background:#B8975A;margin:16px auto;"></div>
          <p style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#B8975A;margin:0;">New Booking Inquiry</p>
        </div>
        <div style="background:#B8975A;color:white;text-align:center;padding:20px 32px;margin-bottom:2px;border-radius:4px 4px 0 0;">
          <p style="margin:0;font-size:13px;letter-spacing:2px;text-transform:uppercase;opacity:.8;">Requested Period</p>
          <h2 style="margin:8px 0 4px;font-size:22px;font-weight:300;">
            ${formatDate(checkIn)} &rarr; ${formatDate(checkOut)}
          </h2>
          <p style="margin:0;font-size:13px;opacity:.85;">${n} night${n !== 1 ? "s" : ""}</p>
        </div>
        <div style="background:white;padding:32px;border:1px solid rgba(44,40,36,0.08);border-top:none;">
          <table style="width:100%;border-collapse:collapse;font-size:15px;color:#2C2824;">
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid #F5F0EB;font-weight:500;width:140px;vertical-align:top;">Name</td>
              <td style="padding:12px 0;border-bottom:1px solid #F5F0EB;">${name}</td>
            </tr>
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid #F5F0EB;font-weight:500;vertical-align:top;">Email</td>
              <td style="padding:12px 0;border-bottom:1px solid #F5F0EB;"><a href="mailto:${email}" style="color:#B8975A;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid #F5F0EB;font-weight:500;vertical-align:top;">Phone</td>
              <td style="padding:12px 0;border-bottom:1px solid #F5F0EB;">${phone || "Not provided"}</td>
            </tr>
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid #F5F0EB;font-weight:500;vertical-align:top;">Guests</td>
              <td style="padding:12px 0;border-bottom:1px solid #F5F0EB;">${guests || "Not specified"}</td>
            </tr>
            <tr>
              <td style="padding:12px 0;font-weight:500;vertical-align:top;">Message</td>
              <td style="padding:12px 0;">${message || "-"}</td>
            </tr>
          </table>
        </div>
        <p style="font-size:12px;color:#8C8279;text-align:center;margin-top:24px;">
          Received via villa-serena.nl booking calendar
        </p>
      </div>
    `;

    const guestHtml = `
      <div style="font-family:'Georgia',serif;max-width:600px;margin:0 auto;background:#FAF8F5;padding:40px;">
        <div style="text-align:center;margin-bottom:40px;">
          <h1 style="font-size:28px;font-weight:300;color:#2C2824;margin:0;">Villa Serena</h1>
          <div style="width:40px;height:1px;background:#B8975A;margin:16px auto;"></div>
          <p style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#B8975A;margin:0;">Inquiry Received</p>
        </div>
        <div style="background:white;padding:32px;border:1px solid rgba(44,40,36,0.08);">
          <p style="font-size:17px;font-weight:300;color:#2C2824;line-height:1.7;margin:0 0 20px;">
            Dear ${name},
          </p>
          <p style="font-size:15px;color:#5a5450;font-weight:300;line-height:1.8;margin:0 0 20px;">
            Thank you for your inquiry about Villa Serena. We have received your request for 
            <strong style="color:#2C2824;">${formatDate(checkIn)}</strong> to 
            <strong style="color:#2C2824;">${formatDate(checkOut)}</strong> (${n} night${n !== 1 ? "s" : ""}).
          </p>
          <p style="font-size:15px;color:#5a5450;font-weight:300;line-height:1.8;margin:0;">
            We will review your request and get back to you within 24 hours to discuss availability and next steps.
          </p>
        </div>
        <p style="font-size:12px;color:#8C8279;text-align:center;margin-top:24px;">
          Villa Serena &middot; Umbria, Italy &middot; info@villa-serena.nl
        </p>
      </div>
    `;

    const [ownerResult, guestResult] = await Promise.allSettled([
      getResend().emails.send({
        from: fromEmail,
        to: toEmail,
        replyTo: email,
        subject: `Booking Inquiry: ${formatDate(checkIn)} → ${formatDate(checkOut)} - ${name}`,
        html: ownerHtml,
      }),
      getResend().emails.send({
        from: fromEmail,
        to: email,
        subject: "Your inquiry - Villa Serena",
        html: guestHtml,
      }),
    ]);

    if (ownerResult.status === "rejected") {
      console.error("Failed to send owner notification:", ownerResult.reason);
      return NextResponse.json({ error: "Failed to send inquiry. Please try again." }, { status: 500 });
    }
    if (guestResult.status === "rejected") {
      console.error("Failed to send guest confirmation:", guestResult.reason);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Inquire API error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
