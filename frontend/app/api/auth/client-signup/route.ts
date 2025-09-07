import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  console.log("New client signup:", body);

  return NextResponse.json({ success: true, message: "Client registered!", user: body });
}
