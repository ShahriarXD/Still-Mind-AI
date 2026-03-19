"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paymentID = searchParams.get("paymentID");
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [trxID, setTrxID] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function verify() {
      if (!paymentID) {
        setStatus("failed");
        setError("No payment ID provided");
        return;
      }
      try {
        const r = await fetch("/api/bkash/execute-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentID }),
        });
        const data = await r.json();
        if (data.transactionStatus === "Completed") {
          setTrxID(data.trxID);
          setStatus("success");
        } else {
          setError(data.statusMessage || "Payment not completed");
          setStatus("failed");
        }
      } catch {
        setError("Failed to verify payment");
        setStatus("failed");
      }
    }
    verify();
  }, [paymentID]);

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-[#1e2d40]">
        <CardContent className="p-8 text-center">
          {status === "loading" && (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 text-amber-500 animate-spin" />
              <p className="text-slate-300 font-medium">Verifying your payment...</p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 border border-green-500/30">
                <CheckCircle className="h-9 w-9 text-green-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-100">Payment Successful!</h1>
                <p className="text-slate-400 text-sm mt-2">
                  Your SteelMind subscription is now active.
                </p>
              </div>
              {trxID && (
                <div className="rounded-xl bg-[#0f172a] border border-[#1e2d40] p-3 w-full text-left">
                  <p className="text-xs text-slate-500 mb-1">Transaction ID</p>
                  <p className="text-sm font-mono text-slate-200">{trxID}</p>
                </div>
              )}
              <Button onClick={() => router.push("/dashboard")} className="w-full">
                Go to Dashboard
              </Button>
            </div>
          )}

          {status === "failed" && (
            <div className="flex flex-col items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 border border-red-500/30">
                <XCircle className="h-9 w-9 text-red-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-100">Payment Failed</h1>
                <p className="text-slate-400 text-sm mt-2">{error}</p>
              </div>
              <div className="flex gap-3 w-full">
                <Button
                  variant="outline"
                  onClick={() => router.push("/dashboard")}
                  className="flex-1"
                >
                  Back to Dashboard
                </Button>
                <Button
                  onClick={() => router.push("/dashboard/billing")}
                  className="flex-1"
                >
                  Try Again
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-amber-500 animate-spin" />
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
