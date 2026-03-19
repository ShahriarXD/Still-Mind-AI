"use client";

import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export function TopBar({ title, subtitle }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 border-b border-[#1e2d40] bg-[#0f172a]/80 backdrop-blur-md">
      <div>
        <h1 className="text-lg font-semibold text-slate-100">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Search customers..."
            className="w-52 pl-9 h-9 text-xs bg-[#111827]"
          />
        </div>
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-[#0f172a]" />
        </Button>
      </div>
    </header>
  );
}
