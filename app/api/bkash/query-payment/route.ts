import { NextRequest, NextResponse } from "next/server";
import { queryBkashPayment } from "@/lib/bkash";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const paymentID = searchParams.get("paymentID");

  if (!paymentID) {
    return NextResponse.json(
      { error: "paymentID query param is required" },
      { status: 400 }
    );
  }

  if (!process.env.BKASH_APP_KEY) {
    return NextResponse.json(
      { error: "bKash is not configured" },
      { status: 503 }
    );
  }

  try {
    const result = await queryBkashPayment(paymentID);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Query failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
