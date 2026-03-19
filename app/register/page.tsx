"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, Eye, EyeOff, ArrowRight, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const perks = [
  "AI-powered note analysis",
  "Smart follow-up generation",
  "Risk detection & alerts",
  "20 free analyses per day",
];

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast({ title: "Missing fields", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    if (form.password.length < 6) {
      toast({ title: "Password too short", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await signUp(form.email, form.password, form.name, form.company);
      toast({ title: "Account created!", description: "Check your email to verify your address." });
      router.push("/verify-email");
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      const msg =
        code === "auth/email-already-in-use"
          ? "An account with this email already exists."
          : code === "auth/invalid-email"
          ? "Please enter a valid email address."
          : code === "auth/weak-password"
          ? "Password must be at least 6 characters."
          : "Registration failed. Please try again.";
      toast({ title: "Registration failed", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-100 bg-amber-500/4 rounded-full blur-[130px] pointer-events-none" />

      <div className="relative w-full max-w-4xl animate-fade-in">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Panel */}
          <div className="hidden md:block space-y-6 pr-4">
            <Link href="/" className="flex items-center gap-2.5 mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30">
                <Zap className="h-5 w-5 text-amber-500" />
              </div>
              <span className="text-xl font-bold text-slate-100">
                SteelMind<span className="text-amber-500">AI</span>
              </span>
            </Link>
            <h2 className="text-3xl font-bold text-slate-100 leading-tight">
              Your wholesale business,{" "}
              <span className="text-amber-500">supercharged</span>
            </h2>
            <p className="text-slate-400 leading-relaxed">
              Join hundreds of small wholesalers who use SteelMind AI to manage customer relationships and never miss a follow-up.
            </p>
            <div className="space-y-3 pt-2">
              {perks.map((perk) => (
                <div key={perk} className="flex items-center gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/20">
                    <Check className="h-3 w-3 text-amber-400" />
                  </div>
                  <span className="text-sm text-slate-300">{perk}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel – Form */}
          <div>
            <div className="flex justify-center mb-6 md:hidden">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <Zap className="h-4 w-4 text-amber-500" />
                </div>
                <span className="text-lg font-bold text-slate-100">
                  SteelMind<span className="text-amber-500">AI</span>
                </span>
              </Link>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <h1 className="text-xl font-bold text-slate-100">Create account</h1>
                <p className="text-sm text-slate-400">Free — no credit card needed</p>
              </CardHeader>
              <CardContent className="pt-5">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        placeholder="Ahmad Karimi"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        placeholder="My Steel Co."
                        value={form.company}
                        onChange={(e) => setForm({ ...form, company: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Min. 6 characters"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full mt-2"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-slate-500 text-center leading-relaxed">
                    By creating an account you agree to our{" "}
                    <span className="text-amber-500 cursor-pointer">Terms of Service</span>{" "}
                    and{" "}
                    <span className="text-amber-500 cursor-pointer">Privacy Policy</span>
                  </p>
                </form>

                <p className="text-center text-sm text-slate-500 mt-5">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-amber-500 hover:text-amber-400 font-medium transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
