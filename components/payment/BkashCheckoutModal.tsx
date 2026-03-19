"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Phone,
  ArrowRight,
  Shield,
  RefreshCw,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PRICING_PLANS } from "@/lib/bkash";

type PaymentStep = "confirm" | "processing" | "pin_entry" | "success" | "failed";

interface BkashCheckoutModalProps {
  open: boolean;
  planId: string;
  onSuccess: (trxID: string, planId: string) => void;
  onClose: () => void;
}

export function BkashCheckoutModal({
  open,
  planId,
  onSuccess,
  onClose,
}: BkashCheckoutModalProps) {
  const [step, setStep] = useState<PaymentStep>("confirm");
  const [paymentID, setPaymentID] = useState<string>("");
  const [trxID, setTrxID] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isDemoMode, setIsDemoMode] = useState(false);

  const plan = PRICING_PLANS.find((p) => p.id === planId);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setStep("confirm");
      setPaymentID("");
      setTrxID("");
      setError("");
      setIsDemoMode(false);
    }
  }, [open]);

  const handleInitiatePayment = async () => {
    setStep("processing");

    try {
      // Step 1: Create payment
      const createRes = await fetch("/api/bkash/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, userId: "user_demo" }),
      });

      const createData = await createRes.json();

      if (!createRes.ok) {
        throw new Error(createData.error || "Failed to create payment");
      }

      setPaymentID(createData.paymentID);

      if (createData.demo) {
        setIsDemoMode(true);
        // In demo mode, simulate PIN entry step
        setStep("pin_entry");
        return;
      }

      // In production: redirect to bKash checkout URL
      // For now, simulate the PIN entry flow
      setStep("pin_entry");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Payment initiation failed";
      setError(msg);
      setStep("failed");
    }
  };

  const handleExecutePayment = async () => {
    setStep("processing");

    try {
      // Step 2: Execute payment (after user enters PIN on bKash)
      const execRes = await fetch("/api/bkash/execute-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentID }),
      });

      const execData = await execRes.json();

      if (!execRes.ok) {
        throw new Error(execData.error || "Payment execution failed");
      }

      if (execData.transactionStatus === "Completed") {
        setTrxID(execData.trxID);
        setStep("success");
      } else {
        throw new Error(`Payment status: ${execData.transactionStatus}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Payment execution failed";
      setError(msg);
      setStep("failed");
    }
  };

  const handleSuccess = () => {
    onSuccess(trxID, planId);
  };

  if (!plan) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2.5">
            {/* bKash branding */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e2136e] text-white font-bold text-sm shrink-0">
              bK
            </div>
            <span>bKash Payment</span>
          </DialogTitle>
          <DialogDescription>
            {step === "confirm" && `Upgrade to ${plan.name} — ৳${plan.price}/month`}
            {step === "processing" && "Processing your payment..."}
            {step === "pin_entry" && "Confirm payment with your bKash PIN"}
            {step === "success" && "Payment completed successfully"}
            {step === "failed" && "Payment could not be completed"}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2">
          {/* STEP: Confirm */}
          {step === "confirm" && (
            <div className="space-y-5">
              {/* Order Summary */}
              <div className="rounded-xl bg-[#0f172a] border border-[#1e2d40] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Plan</span>
                  <span className="text-sm font-semibold text-slate-200">
                    SteelMind {plan.name}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Period</span>
                  <span className="text-sm text-slate-200">Monthly</span>
                </div>
                <div className="border-t border-[#1e2d40] pt-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-200">Total</span>
                  <span className="text-xl font-bold text-amber-400">৳{plan.price} BDT</span>
                </div>
              </div>

              {/* bKash info */}
              <div className="rounded-xl bg-[#e2136e]/5 border border-[#e2136e]/20 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e2136e] text-white font-bold text-sm shrink-0">
                    bK
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">
                      Pay with bKash
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      You&apos;ll enter your 5-digit bKash PIN to complete the payment securely.
                      No bKash wallet info is stored on our servers.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Shield className="h-3.5 w-3.5 text-green-400 shrink-0" />
                Secured by bKash · TLS 1.2 encrypted
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button
                  onClick={handleInitiatePayment}
                  className="flex-1 gap-2 bg-[#e2136e] hover:bg-[#c0115c] text-white border-0"
                >
                  Pay ৳{plan.price}
                  <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          )}

          {/* STEP: Processing */}
          {step === "processing" && (
            <div className="flex flex-col items-center justify-center py-10 gap-4">
              <div className="relative">
                <div className="h-16 w-16 rounded-full border-2 border-[#e2136e]/20 border-t-[#e2136e] animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-8 w-8 rounded-full bg-[#e2136e]/10 flex items-center justify-center">
                    <span className="text-[#e2136e] font-bold text-xs">bK</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-slate-200">Connecting to bKash...</p>
                <p className="text-xs text-slate-500 mt-1">Please wait, this takes a moment</p>
              </div>
            </div>
          )}

          {/* STEP: PIN Entry (Simulated) */}
          {step === "pin_entry" && (
            <div className="space-y-5">
              {isDemoMode && (
                <div className="rounded-xl bg-amber-500/5 border border-amber-500/20 p-3 flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-amber-400">Demo Mode</p>
                    <p className="text-xs text-slate-500">
                      bKash credentials not configured. This is a simulated checkout.
                      In production, users are redirected to bKash&apos;s hosted checkout page.
                    </p>
                  </div>
                </div>
              )}

              {/* Simulated bKash PIN UI */}
              <div className="rounded-xl border border-[#e2136e]/30 bg-linear-to-br from-[#e2136e]/5 to-transparent p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e2136e] text-white font-bold text-xs">
                    bK
                  </div>
                  <span className="text-sm font-semibold text-slate-200">bKash Checkout</span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Phone size={14} className="text-slate-500" />
                    <span>01X-XXXXXXXXX</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-[#0f172a] border border-[#1e2d40] p-3">
                    <span className="text-xs text-slate-400">Amount</span>
                    <span className="text-sm font-bold text-[#e2136e]">৳{plan.price}</span>
                  </div>

                  {/* PIN dots */}
                  <div>
                    <p className="text-xs text-slate-500 mb-2">Enter your 5-digit bKash PIN</p>
                    <div className="flex gap-2">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="flex-1 h-10 rounded-lg border border-[#e2136e]/30 bg-[#0f172a] flex items-center justify-center"
                        >
                          <span className="text-[#e2136e] text-lg">●</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep("confirm")}
                  className="flex-1 gap-2"
                >
                  Back
                </Button>
                <Button
                  onClick={handleExecutePayment}
                  className="flex-1 gap-2 bg-[#e2136e] hover:bg-[#c0115c] text-white border-0"
                >
                  {isDemoMode ? "Simulate Payment" : "Confirm PIN"}
                  <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          )}

          {/* STEP: Success */}
          {step === "success" && (
            <div className="space-y-5">
              <div className="flex flex-col items-center justify-center py-6 gap-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 border border-green-500/30">
                  <CheckCircle className="h-9 w-9 text-green-400" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-slate-100">
                    Payment Successful!
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    Welcome to SteelMind {plan.name}
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-[#0f172a] border border-[#1e2d40] p-4 space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Transaction ID</span>
                  <span className="text-slate-200 font-mono text-xs">{trxID}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Plan</span>
                  <span className="text-slate-200">SteelMind {plan.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Amount Paid</span>
                  <span className="text-green-400 font-semibold">৳{plan.price} BDT</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Payment Method</span>
                  <span className="text-[#e2136e] font-medium">bKash</span>
                </div>
              </div>

              <Button onClick={handleSuccess} className="w-full gap-2">
                <CheckCircle size={16} />
                Go to Dashboard
              </Button>
            </div>
          )}

          {/* STEP: Failed */}
          {step === "failed" && (
            <div className="space-y-5">
              <div className="flex flex-col items-center justify-center py-6 gap-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 border border-red-500/30">
                  <XCircle className="h-9 w-9 text-red-400" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-slate-100">
                    Payment Failed
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    {error || "Something went wrong. Please try again."}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button
                  onClick={() => setStep("confirm")}
                  className="flex-1 gap-2"
                  variant="secondary"
                >
                  <RefreshCw size={14} />
                  Try Again
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
