// app/api/agent/route.ts
import { callN8N } from "@/lib/n8n";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const res = await callN8N("/webhook/cbc9181b-15d6-4d8c-81d0-351755810ad6", body);
  return NextResponse.json(res);
}
