import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([{ id: "p1", name: "Bob", status: "PENDING_KYC" }]);
}
