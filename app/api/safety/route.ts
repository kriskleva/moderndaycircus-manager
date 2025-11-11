import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { callN8N } from "@/lib/n8n";

const Safety = z.object({ site: z.string().min(1), type: z.string().min(1), notes: z.string().optional() });

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = Safety.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid safety check" }, { status: 400 });

  try {
    const res = await callN8N("/webhook/safety", parsed.data);
    return NextResponse.json(res);
  } catch (err: any) {
    return NextResponse.json({ error: String(err.message ?? err) }, { status: 502 });
  }
}