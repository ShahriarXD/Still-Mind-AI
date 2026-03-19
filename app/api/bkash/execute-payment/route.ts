import { NextRequest, NextResponse } from "next/server";
import { executeBkashPayment } from "@/lib/bkash";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { paymentID } = body;

    if (!paymentID) {
      return NextResponse.json(
        { error: "paymentID is required" },
        { status: 400 }
      );
    }

    // Handle mock payment in demo mode
    if (paymentID.startsWith("mock_")) {
      return NextResponse.json({
        paymentID,
        trxID: `DEMO_TRX_${Date.now()}`,
        transactionStatus: "Completed",
        amount: "0",
        currency: "BDT",
        demo: true,
      });
    }

    // Check bKash credentials
    if (!process.env.BKASH_APP_KEY) {
      return NextResponse.json(
        { error: "bKash is not configured" },
        { status: 503 }
      );
    }

    const result = await executeBkashPayment(paymentID);

    // TODO: Save successful transaction to database
    // await prisma.payment.create({ data: { ... } })

    return NextResponse.json({
      paymentID: result.paymentID,
      trxID: result.trxID,
      transactionStatus: result.transactionStatus,
      amount: result.amount,
      currency: result.currency,
      customerMsisdn: result.customerMsisdn,
      merchantInvoiceNumber: result.merchantInvoiceNumber,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Payment execution failed";
    console.error("bKash execute payment error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
