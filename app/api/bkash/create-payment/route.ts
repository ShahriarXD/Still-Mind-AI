import { NextRequest, NextResponse } from "next/server";
import { createBkashPayment, generateInvoiceNumber, PRICING_PLANS } from "@/lib/bkash";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { planId, userId } = body;

    if (!planId) {
      return NextResponse.json(
        { error: "Plan ID is required" },
        { status: 400 }
      );
    }

    const plan = PRICING_PLANS.find((p) => p.id === planId);
    if (!plan) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // Check bKash credentials are configured
    if (!process.env.BKASH_APP_KEY) {
      // Return mock response for development/demo
      return NextResponse.json({
        paymentID: `mock_${Date.now()}`,
        bkashURL: null,
        merchantInvoiceNumber: generateInvoiceNumber(),
        amount: plan.price,
        currency: plan.currency,
        demo: true,
      });
    }

    const invoiceNumber = generateInvoiceNumber(`SM-${planId.toUpperCase()}`);

    const payment = await createBkashPayment({
      amount: plan.price,
      currency: "BDT",
      intent: "sale",
      merchantInvoiceNumber: invoiceNumber,
      merchantAssociationInfo: `SteelMind ${plan.name} Plan - User: ${userId || "guest"}`,
    });

    return NextResponse.json({
      paymentID: payment.paymentID,
      amount: payment.amount,
      currency: payment.currency,
      merchantInvoiceNumber: payment.merchantInvoiceNumber,
      transactionStatus: payment.transactionStatus,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Payment creation failed";
    console.error("bKash create payment error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
