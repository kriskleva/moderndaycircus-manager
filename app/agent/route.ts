// app/api/agent/route.ts
import { callN8N } from "@/lib/n8n";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const res = await callN8N("/webhook/agent", body);
  return NextResponse.json(res);
}
