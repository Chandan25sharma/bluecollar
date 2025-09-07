import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({ id: params.id, service: "Mock Service", status: "pending" });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  return NextResponse.json({ success: true, updated: { id: params.id, ...body } });
}
