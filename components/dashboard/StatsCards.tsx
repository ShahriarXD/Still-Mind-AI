"use client";

import { Users, MessageSquare, AlertTriangle, Clock, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { DashboardStats } from "@/lib/types";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
  trend?: { value: number; up: boolean };
  suffix?: string;
}

function StatCard({ title, value, icon: Icon, color, bgColor, borderColor, trend, suffix }: StatCardProps) {
  return (
    <Card className={`border-[#1e2d40] hover:border-opacity-80 hover:scale-[1.01] transition-all duration-200 group`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
              {title}
            </p>
            <p className={`text-3xl font-bold ${color} tabular-nums`}>
              {value.toLocaleString()}{suffix}
            </p>
            {trend && (
              <div className={`flex items-center gap-1 mt-2 text-xs ${trend.up ? "text-green-400" : "text-red-400"}`}>
                {trend.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                <span>{trend.up ? "+" : "-"}{trend.value}% this week</span>
              </div>
            )}
          </div>
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${bgColor} border ${borderColor} group-hover:scale-110 transition-transform duration-200`}>
            <Icon className={`h-5 w-5 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Customers"
        value={stats.totalCustomers}
        icon={Users}
        color="text-blue-400"
        bgColor="bg-blue-500/10"
        borderColor="border-blue-500/20"
        trend={{ value: 8, up: true }}
      />
      <StatCard
        title="Total Interactions"
        value={stats.totalInteractions}
        icon={MessageSquare}
        color="text-amber-400"
        bgColor="bg-amber-500/10"
        borderColor="border-amber-500/20"
        trend={{ value: 12, up: true }}
      />
      <StatCard
        title="High Risk"
        value={stats.highRiskCustomers}
        icon={AlertTriangle}
        color="text-red-400"
        bgColor="bg-red-500/10"
        borderColor="border-red-500/20"
        trend={{ value: 2, up: false }}
      />
      <StatCard
        title="Follow-ups Due"
        value={stats.followUpsDue}
        icon={Clock}
        color="text-green-400"
        bgColor="bg-green-500/10"
        borderColor="border-green-500/20"
        trend={{ value: 5, up: true }}
      />
    </div>
  );
}
