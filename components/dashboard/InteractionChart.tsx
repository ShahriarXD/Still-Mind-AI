"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ChartDataPoint } from "@/lib/types";

interface InteractionChartProps {
  data: ChartDataPoint[];
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{value: number}>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-[#1e2d40] bg-[#111827] px-3 py-2 shadow-xl">
        <p className="text-xs text-slate-400 mb-1">{label}</p>
        <p className="text-sm font-semibold text-amber-400">
          {payload[0].value} interactions
        </p>
      </div>
    );
  }
  return null;
};

export function InteractionChart({ data }: InteractionChartProps) {
  return (
    <Card className="border-[#1e2d40]">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base text-slate-100">Interactions Over Time</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Last 30 days activity</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span className="text-xs text-slate-500">Interactions</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="colorInteractions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2d40" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#f59e0b22", strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="interactions"
              stroke="#f59e0b"
              strokeWidth={2}
              fill="url(#colorInteractions)"
              dot={{ fill: "#f59e0b", r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "#f59e0b", strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
