"use client";

import { useState } from "react";
import {
  Check,
  Zap,
  Crown,
  Building2,
  CreditCard,
  Shield,
  ArrowRight,
  CheckCircle,
  X,
} from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PRICING_PLANS } from "@/lib/bkash";
import { useToast } from "@/hooks/use-toast";
import { BkashCheckoutModal } from "@/components/payment/BkashCheckoutModal";

const planIcons: Record<string, React.ElementType> = {
  starter: Zap,
  pro: Crown,
  business: Building2,
};

const planColors: Record<string, { badge: string; icon: string; ring: string }> = {
  starter: {
    badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    icon: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    ring: "hover:border-blue-500/30",
  },
  pro: {
    badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    icon: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    ring: "border-amber-500/30 hover:border-amber-500/50",
  },
  business: {
    badge: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    icon: "bg-purple-500/10 border-purple-500/20 text-purple-400",
    ring: "hover:border-purple-500/30",
  },
};

export default function BillingPage() {
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [currentPlan] = useState("free"); // In real app, fetch from DB

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    setCheckoutOpen(true);
  };

  const handlePaymentSuccess = (trxID: string, planId: string) => {
    setCheckoutOpen(false);
    const plan = PRICING_PLANS.find((p) => p.id === planId);
    toast({
      title: "Payment successful!",
      description: `Welcome to SteelMind ${plan?.name}! Transaction: ${trxID}`,
    });
  };

  const handlePaymentFailure = (error: string) => {
    setCheckoutOpen(false);
    toast({
      title: "Payment failed",
      description: error,
      variant: "destructive",
    });
  };

  return (
    <div>
      <TopBar title="Billing & Plans" subtitle="Upgrade to unlock more AI power" />

      <div className="p-6 max-w-5xl animate-fade-in">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-4 py-1.5 text-xs font-medium text-amber-400 mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            Pay with bKash
          </div>
          <h2 className="text-2xl font-bold text-slate-100 mb-2">
            Choose your plan
          </h2>
          <p className="text-slate-400 text-sm">
            Secure payments via bKash — Bangladesh&apos;s #1 mobile financial service
          </p>
        </div>

        {/* Plan Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {PRICING_PLANS.map((plan) => {
            const Icon = planIcons[plan.id];
            const colors = planColors[plan.id];
            const isCurrentPlan = currentPlan === plan.id;

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl border bg-[#111827] transition-all duration-200 ${
                  plan.popular
                    ? "border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.1)]"
                    : `border-[#1e2d40] ${colors.ring}`
                } ${plan.popular ? "scale-[1.02]" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-amber-500 px-3 py-0.5 text-xs font-semibold text-slate-900">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="p-6">
                  {/* Icon + Name */}
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl border ${colors.icon}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-slate-100">
                        {plan.name}
                      </h3>
                      {isCurrentPlan && (
                        <Badge variant="secondary" className="text-[10px] mt-0.5">
                          Current Plan
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-bold text-slate-100">
                        ৳{plan.price}
                      </span>
                      <span className="text-sm text-slate-500">
                        / {plan.period}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">Billed monthly in BDT</p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2.5 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="h-4 w-4 shrink-0 mt-0.5 text-green-400" />
                        <span className="text-sm text-slate-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Button
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={isCurrentPlan}
                    variant={plan.popular ? "default" : "outline"}
                    className="w-full gap-2"
                  >
                    {isCurrentPlan ? (
                      <>
                        <CheckCircle size={16} />
                        Active Plan
                      </>
                    ) : (
                      <>
                        <CreditCard size={16} />
                        Pay with bKash
                      </>
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Free Plan */}
        <Card className="border-[#1e2d40] mb-6">
          <CardContent className="flex items-center justify-between p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-700/50 border border-slate-700">
                <Zap className="h-5 w-5 text-slate-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">Free Plan</p>
                <p className="text-xs text-slate-500">20 AI analyses per day — forever free</p>
              </div>
            </div>
            {currentPlan === "free" && (
              <Badge variant="secondary">
                <CheckCircle size={12} className="text-green-400" />
                Active
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* Trust Badges */}
        <div className="rounded-2xl border border-[#1e2d40] bg-[#111827] p-5">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Shield className="h-4 w-4 text-green-400" />
              Secured by bKash
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Check className="h-4 w-4 text-amber-400" />
              No hidden fees
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <ArrowRight className="h-4 w-4 text-blue-400" />
              Cancel anytime
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <X className="h-4 w-4 text-slate-500" />
              No credit card required
            </div>
          </div>

          {/* bKash Logo Banner */}
          <div className="mt-4 flex items-center justify-center gap-3 rounded-xl bg-[#e2136e]/5 border border-[#e2136e]/20 p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e2136e] text-white font-bold text-xs shrink-0">
              bK
            </div>
            <div>
              <p className="text-xs font-semibold text-[#e2136e]">
                Pay securely with bKash
              </p>
              <p className="text-xs text-slate-500">
                Bangladesh&apos;s leading mobile financial service · Trusted by 70M+ users
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* bKash Checkout Modal */}
      {selectedPlan && (
        <BkashCheckoutModal
          open={checkoutOpen}
          planId={selectedPlan}
          onSuccess={handlePaymentSuccess}
          onFailure={handlePaymentFailure}
          onClose={() => setCheckoutOpen(false)}
        />
      )}
    </div>
  );
}
