import Link from "next/link";
import {
  Zap,
  Brain,
  MessageSquare,
  AlertTriangle,
  ArrowRight,
  Check,
  BarChart3,
  Users,
  Clock,
  ChevronRight,
  Shield,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Brain,
    title: "AI Note Analysis",
    description:
      "Paste raw call notes or order details. SteelMind reads them instantly, extracts key info, and delivers a clean summary.",
    color: "amber",
    gradient: "from-amber-500/20 to-amber-600/5",
    border: "border-amber-500/20",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-500",
  },
  {
    icon: MessageSquare,
    title: "Smart Follow-ups",
    description:
      "Never forget a follow-up again. Get AI-drafted WhatsApp and email messages ready to send in one click.",
    color: "green",
    gradient: "from-green-500/20 to-green-600/5",
    border: "border-green-500/20",
    iconBg: "bg-green-500/10",
    iconColor: "text-green-500",
  },
  {
    icon: AlertTriangle,
    title: "Risk Detection",
    description:
      "Automatically flag late payments, inactive customers, and complaints before they become real problems.",
    color: "red",
    gradient: "from-red-500/20 to-red-600/5",
    border: "border-red-500/20",
    iconBg: "bg-red-500/10",
    iconColor: "text-red-400",
  },
];

const stats = [
  { value: "2s", label: "Average analysis time" },
  { value: "93%", label: "Follow-up accuracy" },
  { value: "10x", label: "Faster than manual notes" },
];

const benefits = [
  "No more lost notes or forgotten calls",
  "Detect risky accounts before they go silent",
  "Draft professional messages in seconds",
  "Track every customer interaction in one place",
  "Plug in OpenAI API for real AI power",
  "Deploy to Vercel in minutes",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-[#1e2d40]/60 bg-[#0f172a]/80 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/30">
            <Zap className="h-4 w-4 text-amber-500" />
          </div>
          <span className="text-base font-bold text-slate-100">
            SteelMind
            <span className="text-amber-500">AI</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-200">
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm">
              Get Started
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6">
        {/* Background glows */}
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-150 h-100 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-48 left-1/4 w-75 h-75 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

        {/* 3D floating orbs */}
        <div className="absolute top-36 right-[8%] w-24 h-24 rounded-full bg-amber-500/8 border border-amber-500/15 blur-sm animate-orbit-3d pointer-events-none hidden lg:block" style={{ animationDelay: "0s" }} />
        <div className="absolute top-64 left-[6%] w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/15 blur-sm animate-orbit-3d pointer-events-none hidden lg:block" style={{ animationDelay: "-4s" }} />
        <div className="absolute bottom-24 right-[12%] w-10 h-10 rounded-full bg-green-500/10 border border-green-500/15 blur-sm animate-orbit-3d pointer-events-none hidden lg:block" style={{ animationDelay: "-8s" }} />

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-4 py-1.5 text-xs font-medium text-amber-400 mb-8 animate-float-3d">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            AI-Powered Wholesale Management
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-100 mb-6 leading-[1.1]">
            AI Assistant for{" "}
            <span className="bg-linear-to-r from-amber-400 via-amber-500 to-orange-500 bg-clip-text text-transparent">
              Small Wholesalers
            </span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Turn messy customer notes into clear actions, follow-ups, and insights.
            Built for the realities of wholesale — not enterprise.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/register">
              <Button size="xl" className="w-full sm:w-auto gap-2 shadow-lg shadow-amber-500/20">
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="xl" className="w-full sm:w-auto gap-2">
                View Demo
                <ChevronRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap justify-center gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-amber-500">{stat.value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mock Dashboard Preview */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="animate-card-float-3d">
          <div className="relative rounded-2xl border border-[#1e2d40] bg-[#111827] overflow-hidden shadow-2xl shadow-black/40">
            {/* Mock browser bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-[#0a1020] border-b border-[#1e2d40]">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-500/60" />
                <span className="h-3 w-3 rounded-full bg-amber-500/60" />
                <span className="h-3 w-3 rounded-full bg-green-500/60" />
              </div>
              <div className="flex-1 mx-4 h-6 rounded-md bg-[#111827] border border-[#1e2d40] flex items-center px-3">
                <span className="text-xs text-slate-500">app.steelmind.ai/dashboard</span>
              </div>
            </div>

            {/* Mock Dashboard Content */}
            <div className="flex h-72 overflow-hidden">
              {/* Mock Sidebar */}
              <div className="w-48 border-r border-[#1e2d40] bg-[#0a1020] p-3 hidden sm:block">
                <div className="flex items-center gap-2 px-2 py-2 mb-4">
                  <div className="h-5 w-5 rounded bg-amber-500/20" />
                  <div className="h-3 w-20 rounded bg-slate-700 skeleton" />
                </div>
                {["Dashboard", "New Interaction", "History", "Settings"].map(
                  (item, i) => (
                    <div
                      key={item}
                      className={`flex items-center gap-2 px-2 py-2 rounded-lg mb-1 ${
                        i === 0
                          ? "bg-amber-500/10 border border-amber-500/20"
                          : ""
                      }`}
                    >
                      <div
                        className={`h-3 w-3 rounded ${
                          i === 0 ? "bg-amber-500" : "bg-slate-700"
                        }`}
                      />
                      <span className="text-xs text-slate-400">{item}</span>
                    </div>
                  )
                )}
              </div>

              {/* Mock Main Content */}
              <div className="flex-1 p-4 overflow-hidden">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  {[
                    { label: "Customers", value: "47", color: "amber" },
                    { label: "Interactions", value: "183", color: "blue" },
                    { label: "High Risk", value: "8", color: "red" },
                    { label: "Follow-ups", value: "12", color: "green" },
                  ].map((card) => (
                    <div
                      key={card.label}
                      className="rounded-xl bg-[#0a1020] border border-[#1e2d40] p-3"
                    >
                      <div className="text-xs text-slate-500 mb-1">{card.label}</div>
                      <div className={`text-xl font-bold text-${card.color}-400`}>
                        {card.value}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl bg-[#0a1020] border border-[#1e2d40] p-3">
                  <div className="h-3 w-32 rounded bg-slate-700 mb-3 skeleton" />
                  <div className="flex items-end gap-1 h-16">
                    {[40, 65, 50, 80, 60, 90, 70, 100].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-amber-500/30 rounded-sm"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Gradient overlay at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-linear-to-t from-[#111827] to-transparent pointer-events-none" />
          </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4">Core Features</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-4">
              Everything a wholesaler needs
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Built specifically for B2B wholesale, not generic enterprise CRM.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className={`card-3d relative rounded-2xl border ${feature.border} bg-linear-to-br ${feature.gradient} p-6`}
              >
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.iconBg} mb-5`}
                >
                  <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
                </div>
                <h3 className="text-lg font-semibold text-slate-100 mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl border border-[#1e2d40] bg-[#111827] p-8 sm:p-12">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <Badge variant="secondary" className="mb-4">Why SteelMind</Badge>
                <h2 className="text-3xl font-bold text-slate-100 mb-4">
                  Built for real wholesale businesses
                </h2>
                <p className="text-slate-400 mb-8">
                  Not another over-engineered CRM. SteelMind fits how small wholesalers actually work — fast, messy, and relationship-driven.
                </p>
                <Link href="/register">
                  <Button className="gap-2">
                    Start Free Today
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="space-y-3">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500/10 border border-green-500/20">
                      <Check className="h-3 w-3 text-green-400" />
                    </div>
                    <span className="text-sm text-slate-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional features row */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-6">
          {[
            {
              icon: BarChart3,
              title: "Analytics Dashboard",
              desc: "Visual charts for interaction trends and risk distribution.",
            },
            {
              icon: Users,
              title: "Customer Profiles",
              desc: "Every interaction, note, and follow-up in one place per customer.",
            },
            {
              icon: Clock,
              title: "Follow-up Tracking",
              desc: "Never drop the ball on a follow-up with smart reminders.",
            },
            {
              icon: Shield,
              title: "Risk Management",
              desc: "Proactively catch high-risk accounts before losses occur.",
            },
            {
              icon: MessageSquare,
              title: "Message Drafts",
              desc: "AI-generated professional messages ready for WhatsApp or email.",
            },
            {
              icon: TrendingUp,
              title: "Growth Insights",
              desc: "Track business health and customer engagement over time.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-[#1e2d40] bg-[#111827] p-5 hover:border-amber-500/20 hover:bg-[#1a2234] transition-all duration-200"
            >
              <item.icon className="h-5 w-5 text-amber-500 mb-3" />
              <h3 className="text-sm font-semibold text-slate-200 mb-1.5">{item.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 pb-24">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative rounded-2xl border border-amber-500/20 bg-linear-to-br from-amber-500/10 via-[#111827] to-[#111827] p-12">
            <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-amber-500/5 to-transparent pointer-events-none" />
            <Zap className="h-10 w-10 text-amber-500 mx-auto mb-5" />
            <h2 className="text-3xl font-bold text-slate-100 mb-4">
              Ready to get smarter about your customers?
            </h2>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto">
              Join wholesalers who use SteelMind AI to stay on top of every customer relationship, every day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto gap-2 shadow-lg shadow-amber-500/25">
                  Create Free Account
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  View Live Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1e2d40] px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/30">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
            </div>
            <span className="text-sm font-bold text-slate-300">
              SteelMind<span className="text-amber-500">AI</span>
            </span>
          </div>
          <p className="text-xs text-slate-600">
            © 2026 SteelMind AI. Built for small wholesalers worldwide.
          </p>
          <div className="flex gap-4">
            <Link href="/login" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Login</Link>
            <Link href="/register" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Register</Link>
            <Link href="/dashboard" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Demo</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
