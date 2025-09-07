import { NextResponse } from "next/server";

export async function GET() {
  const mockServices = [
    { id: "1", title: "Electrician", price: 50 },
    { id: "2", title: "Plumber", price: 40 },
  ];
  return NextResponse.json(mockServices);
}
