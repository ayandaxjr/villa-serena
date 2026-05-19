import { NextResponse } from "next/server";
import { sendClientNotification, sendGuestConfirmation } from "@/lib/email";
import { isRateLimited, getIp, sanitize } from "@/lib/rateLimit";

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

    // Honeypot: bots fill hidden fields, humans don't
    if (body._trap) {
      return NextResponse.json({ success: true }); // silent discard
    }

    const name = sanitize(body.name, 120);
    const email = sanitize(body.email, 254);
    const phone = sanitize(body.phone, 30);
    const preferredDate = sanitize(body.preferredDate, 120);
    const message = sanitize(body.message, 2000);

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required." },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }

    const contactData = { name, email, phone, preferredDate, message };

    // Send both emails in parallel
    const [clientResult, guestResult] = await Promise.allSettled([
      sendClientNotification(contactData),
      sendGuestConfirmation(contactData),
    ]);

    // Check if the client notification was sent (this is the critical one)
    if (clientResult.status === "rejected") {
      console.error("Failed to send client notification:", clientResult.reason);
      return NextResponse.json(
        { error: "Failed to send inquiry. Please try again." },
        { status: 500 }
      );
    }

    // Log if guest confirmation failed (non-critical)
    if (guestResult.status === "rejected") {
      console.error("Failed to send guest confirmation:", guestResult.reason);
    }

    return NextResponse.json(
      { success: true, message: "Inquiry sent successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
