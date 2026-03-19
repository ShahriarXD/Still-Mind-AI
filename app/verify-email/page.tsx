"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, CheckCircle, Loader2, RefreshCw, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { sendEmailVerification } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function VerifyEmailPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [checking, setChecking] = useState(false);
  const [resending, setResending] = useState(false);

  const handleCheckVerification = async () => {
    if (!auth.currentUser) return;
    setChecking(true);
    try {
      await auth.currentUser.reload();
      if (auth.currentUser.emailVerified) {
        toast({ title: "Email verified!", description: "Redirecting to your dashboard.", variant: "success" });
        router.push("/dashboard");
      } else {
        toast({
          title: "Not verified yet",
          description: "Please click the link in your email first.",
          variant: "destructive",
        });
      }
    } catch {
      toast({ title: "Error", description: "Could not check verification status.", variant: "destructive" });
    } finally {
      setChecking(false);
    }
  };

  const handleResend = async () => {
    if (!auth.currentUser) return;
    setResending(true);
    try {
      await sendEmailVerification(auth.currentUser);
      toast({ title: "Email sent!", description: "Check your inbox for the verification link.", variant: "success" });
    } catch {
      toast({ title: "Could not resend", description: "Please wait a moment and try again.", variant: "destructive" });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30">
              <Zap className="h-5 w-5 text-amber-500" />
            </div>
            <span className="text-xl font-bold text-slate-100">
              SteelMind<span className="text-amber-500">AI</span>
            </span>
          </div>
        </div>

        <Card className="border-[#1e2d40]">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/30">
                <Mail className="h-8 w-8 text-amber-500" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-100">Check your email</h1>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              We sent a verification link to{" "}
              <span className="text-amber-400 font-medium">
                {user?.email || "your email"}
              </span>
              . Click the link to activate your account.
            </p>
          </CardHeader>

          <CardContent className="pt-4 space-y-3">
            {/* Steps */}
            <div className="rounded-xl bg-[#0f172a] border border-[#1e2d40] p-4 space-y-3">
              {[
                "Open the email from SteelMind AI",
                "Click the \"Verify your email\" link",
                "Come back here and click the button below",
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-semibold text-amber-400 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-slate-300">{step}</p>
                </div>
              ))}
            </div>

            <Button
              onClick={handleCheckVerification}
              disabled={checking}
              className="w-full gap-2"
            >
              {checking ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  I&apos;ve verified my email
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={handleResend}
              disabled={resending}
              className="w-full gap-2"
            >
              {resending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Resend verification email
                </>
              )}
            </Button>

            <p className="text-xs text-slate-500 text-center pt-1">
              Check your spam folder if you don&apos;t see the email.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
