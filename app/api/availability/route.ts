import { NextResponse } from "next/server";

export interface BookedPeriod {
  start: string;  // "YYYY-MM-DD"
  end: string;    // "YYYY-MM-DD"
  label?: string; // e.g. "Booked" or "Option" — shown to admin only, guests see "Unavailable"
}

export async function GET() {
  try {
    const raw = process.env.BOOKED_PERIODS ?? "[]";
    const periods: BookedPeriod[] = JSON.parse(raw);
    return NextResponse.json(
      { periods },
      { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } }
    );
  } catch {
    return NextResponse.json({ periods: [] });
  }
}
