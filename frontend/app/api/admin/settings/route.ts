import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ platformFee: 10, currency: "USD" });
}
