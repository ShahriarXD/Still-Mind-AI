"use client";

import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Interaction, RiskLevel } from "@/lib/types";
import { formatRelativeDate } from "@/lib/utils";

function RiskBadge({ risk }: { risk: RiskLevel }) {
  const variants: Record<RiskLevel, "low" | "medium" | "high"> = {
    LOW: "low",
    MEDIUM: "medium",
    HIGH: "high",
  };
  const dots: Record<RiskLevel, string> = {
    LOW: "bg-green-500",
    MEDIUM: "bg-amber-500",
    HIGH: "bg-red-500",
  };

  return (
    <Badge variant={variants[risk]}>
      <span className={`h-1.5 w-1.5 rounded-full ${dots[risk]}`} />
      {risk}
    </Badge>
  );
}

interface RecentActivityProps {
  interactions: Interaction[];
}

export function RecentActivity({ interactions }: RecentActivityProps) {
  return (
    <Card className="border-[#1e2d40]">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base text-slate-100">Recent Activity</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Latest customer interactions</p>
          </div>
          <Link
            href="/dashboard/history"
            className="flex items-center gap-1 text-xs text-amber-500 hover:text-amber-400 transition-colors"
          >
            View all
            <ArrowRight size={12} />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="pt-2 space-y-1">
        {interactions.map((interaction, index) => (
          <div
            key={interaction.id}
            className="group flex items-start gap-4 rounded-xl p-3 hover:bg-[#1a2234] transition-all duration-200 cursor-pointer animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Avatar */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-700 text-xs font-semibold text-slate-300">
              {interaction.customerName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm font-medium text-slate-200 truncate">
                    {interaction.customerName}
                  </span>
                  {interaction.company && (
                    <span className="text-xs text-slate-500 truncate hidden sm:block">
                      · {interaction.company}
                    </span>
                  )}
                </div>
                <RiskBadge risk={interaction.risk} />
              </div>
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-1 leading-relaxed">
                {interaction.summary}
              </p>
              <div className="flex items-center gap-1 mt-1.5">
                <Clock size={10} className="text-slate-600" />
                <span className="text-[11px] text-slate-600">
                  {formatRelativeDate(interaction.createdAt)}
                </span>
                <span className="text-[11px] text-slate-700 ml-1">· {interaction.type}</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
