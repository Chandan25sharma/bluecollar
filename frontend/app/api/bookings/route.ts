import { NextResponse } from "next/server";

export async function GET() {
  const bookings = [
    { id: "b1", service: "Electrician", status: "pending" },
    { id: "b2", service: "Plumber", status: "completed" },
  ];
  return NextResponse.json(bookings);
}

export async function POST(req: Request) {
  const body = await req.json();
  return NextResponse.json({ success: true, booking: { id: "b3", ...body } });
}
