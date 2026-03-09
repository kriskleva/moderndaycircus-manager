// app/api/agent/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { callN8N } from "@/lib/n8n";

const AgentSchema = z.object({ message: z.string().min(1), context: z.any().optional() });

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = AgentSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  try {
    const res = await callN8N("/webhook-test/cbc9181b-15d6-4d8c-81d0-351755810ad6", parsed.data);
    return NextResponse.json(res);
  } catch (err: any) {
    return NextResponse.json({ error: String(err.message ?? err) }, { status: 502 });
  }
}
