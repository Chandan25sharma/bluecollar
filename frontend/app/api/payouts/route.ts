import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Mock payouts data for now
    const payouts = [
      {
        id: "payout_1",
        providerId: "provider_1",
        amount: 150.00,
        status: "PENDING",
        createdAt: new Date().toISOString()
      }
    ];

    return NextResponse.json(payouts);
  } catch (error) {
    console.error("Error fetching payouts:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
