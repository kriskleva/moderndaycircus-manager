import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { callN8N } from "@/lib/n8n";

const Booking = z.object({ name: z.string().min(1), email: z.string().email(), when: z.string().optional() });

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = Booking.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid booking" }, { status: 400 });

  try {
    const res = await callN8N("/webhook/booking", parsed.data);
    return NextResponse.json(res);
  } catch (err: any) {
    return NextResponse.json({ error: String(err.message ?? err) }, { status: 502 });
  }
}