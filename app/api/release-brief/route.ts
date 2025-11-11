import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { callN8N } from "@/lib/n8n";

const Release = z.object({ title: z.string().min(1), assets: z.string().optional(), date: z.string().optional() });

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = Release.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid release brief" }, { status: 400 });

  try {
    const res = await callN8N("/webhook/release-brief", parsed.data);
    return NextResponse.json(res);
  } catch (err: any) {
    return NextResponse.json({ error: String(err.message ?? err) }, { status: 502 });
  }
}