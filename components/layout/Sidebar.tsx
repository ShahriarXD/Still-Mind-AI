"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Plus,
  History,
  Settings,
  Zap,
  LogOut,
  ChevronRight,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/new", label: "New Interaction", icon: Plus },
  { href: "/dashboard/history", label: "History", icon: History },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  const initials = profile?.name
    ? profile.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "??";

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 flex flex-col border-r border-[#1e2d40] bg-[#0a1020]">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-[#1e2d40]">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30">
          <Zap className="h-5 w-5 text-amber-500" />
        </div>
        <div>
          <span className="text-base font-bold text-slate-100">SteelMind</span>
          <span className="ml-1 text-base font-bold text-amber-500">AI</span>
          <p className="text-[10px] text-slate-500 -mt-0.5">Wholesale Assistant</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              )}
            >
              <Icon
                className={cn(
                  "shrink-0 transition-colors",
                  isActive ? "text-amber-500" : "text-slate-500 group-hover:text-slate-300"
                )}
                size={18}
              />
              <span className="flex-1">{label}</span>
              {isActive && (
                <ChevronRight className="h-3.5 w-3.5 text-amber-500/60" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-[#1e2d40] p-3 space-y-1">
        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-xs font-bold text-slate-900 shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">
              {profile?.name || "Loading..."}
            </p>
            <p className="text-xs text-slate-500 truncate">
              {profile?.email || ""}
            </p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 transition-all duration-200"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
