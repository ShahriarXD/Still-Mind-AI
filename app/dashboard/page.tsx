"use client";

import { useEffect, useState } from "react";
import { Plus, Zap } from "lucide-react";
import Link from "next/link";
import { TopBar } from "@/components/layout/TopBar";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { InteractionChart } from "@/components/dashboard/InteractionChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import type { Interaction, DashboardStats, ChartDataPoint } from "@/lib/types";

function buildStats(interactions: Interaction[]): DashboardStats {
  const customerNames = new Set(interactions.map((i) => i.customerName));
  const highRisk = interactions.filter((i) => i.risk === "HIGH");
  const recentFollowUps = interactions.filter((i) => {
    const d = new Date(i.createdAt);
    const diff = Date.now() - d.getTime();
    return diff < 7 * 24 * 60 * 60 * 1000; // within last 7 days
  });
  return {
    totalCustomers: customerNames.size,
    totalInteractions: interactions.length,
    highRiskCustomers: highRisk.length,
    followUpsDue: recentFollowUps.reduce((acc, i) => acc + i.followUps.length, 0),
  };
}

function buildChartData(interactions: Interaction[]): ChartDataPoint[] {
  const counts: Record<string, number> = {};
  interactions.forEach((i) => {
    const day = new Date(i.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    counts[day] = (counts[day] || 0) + 1;
  });
  // Last 7 days
  const result: ChartDataPoint[] = [];
  for (let d = 6; d >= 0; d--) {
    const date = new Date();
    date.setDate(date.getDate() - d);
    const label = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    result.push({ date: label, interactions: counts[label] || 0 });
  }
  return result;
}

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "users", user.uid, "interactions"),
      orderBy("createdAt", "desc"),
      limit(50)
    );
    const unsub = onSnapshot(q, (snap) => {
      const docs = snap.docs.map((d) => {
        const data = d.data();
        const ts = data.createdAt as Timestamp | null;
        return {
          id: d.id,
          ...data,
          createdAt: ts ? ts.toDate().toISOString() : new Date().toISOString(),
        } as Interaction;
      });
      setInteractions(docs);
      setLoading(false);
    });
    return unsub;
  }, [user]);

  const stats = buildStats(interactions);
  const chartData = buildChartData(interactions);
  const firstName = profile?.name?.split(" ")[0] || "Wholesaler";

  return (
    <div>
      <TopBar
        title="Dashboard"
        subtitle={`${new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}`}
      />

      <div className="p-6 space-y-6 animate-fade-in">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-[#111827] to-[#111827] p-5">
          <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10">
            <Zap className="h-20 w-20 text-amber-500" />
          </div>
          <div className="relative flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-100">
                Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"},{" "}
                {firstName}
              </h2>
              <p className="text-sm text-slate-400 mt-0.5">
                {loading ? (
                  "Loading your data..."
                ) : stats.totalInteractions === 0 ? (
                  "No interactions yet — log your first one below!"
                ) : (
                  <>
                    You have{" "}
                    <span className="text-amber-400 font-medium">
                      {stats.followUpsDue} follow-up{stats.followUpsDue !== 1 ? "s" : ""}
                    </span>{" "}
                    due and{" "}
                    <span className="text-red-400 font-medium">
                      {stats.highRiskCustomers} high-risk account{stats.highRiskCustomers !== 1 ? "s" : ""}
                    </span>{" "}
                    to review.
                  </>
                )}
              </p>
            </div>
            <Link href="/dashboard/new">
              <Button size="sm" className="shrink-0 gap-2">
                <Plus size={16} />
                New Interaction
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Chart + Activity */}
        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <InteractionChart data={chartData} />
          </div>
          <div className="lg:col-span-2">
            <RecentActivity interactions={interactions.slice(0, 5)} />
          </div>
        </div>
      </div>
    </div>
  );
}
