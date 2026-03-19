"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Clock,
  MessageSquare,
  Copy,
  Check,
  SlidersHorizontal,
  Loader2,
} from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { formatDate, formatRelativeDate } from "@/lib/utils";
import type { Interaction, RiskLevel } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

type RiskFilter = "ALL" | RiskLevel;

const riskConfig: Record<RiskLevel, { variant: "low" | "medium" | "high"; dot: string }> = {
  LOW: { variant: "low", dot: "bg-green-500" },
  MEDIUM: { variant: "medium", dot: "bg-amber-500" },
  HIGH: { variant: "high", dot: "bg-red-500" },
};

function InteractionDetailDialog({
  interaction,
  open,
  onClose,
}: {
  interaction: Interaction | null;
  open: boolean;
  onClose: () => void;
}) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!interaction) return null;

  const cfg = riskConfig[interaction.risk];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(interaction.draftMessage);
    setCopied(true);
    toast({ title: "Message copied!" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-slate-700 to-slate-800 border border-slate-600 text-sm font-semibold text-slate-200">
              {interaction.customerName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-lg">{interaction.customerName}</DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                {interaction.company && (
                  <span className="text-xs text-slate-400">{interaction.company}</span>
                )}
                <Badge variant={cfg.variant}>
                  <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                  {interaction.risk} RISK
                </Badge>
                <Badge variant="secondary">{interaction.type}</Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Original Note</p>
            <div className="rounded-xl bg-[#0f172a] border border-[#1e2d40] p-3 text-sm text-slate-400 leading-relaxed">
              {interaction.notes}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">AI Summary</p>
            <div className="rounded-xl bg-[#0f172a] border border-[#1e2d40] p-3 text-sm text-slate-300 leading-relaxed">
              {interaction.summary}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Follow-ups ({interaction.followUps.length})
            </p>
            <div className="space-y-1.5">
              {interaction.followUps.map((fu, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-semibold text-amber-400">
                    {i + 1}
                  </span>
                  <p className="text-sm text-slate-300">{fu}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Draft Message — copy only, no email sending */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Draft Message
              </p>
              <Button variant="ghost" size="sm" onClick={handleCopy} className="h-7 gap-1.5 text-xs">
                {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
            <div className="rounded-xl bg-[#0f172a] border border-[#1e2d40] p-3 text-sm text-slate-300 leading-relaxed">
              {interaction.draftMessage}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#1e2d40]">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Clock size={12} />
              {formatDate(interaction.createdAt)}
            </div>
            {interaction.phone && (
              <span className="text-xs text-slate-500">{interaction.phone}</span>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function HistoryPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState<RiskFilter>("ALL");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [dialogInteraction, setDialogInteraction] = useState<Interaction | null>(null);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "users", user.uid, "interactions"),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
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
        setLoadingData(false);
      },
      (err) => {
        console.error("History listener failed:", err);
        setLoadingData(false);
        toast({
          title: "Could not load history",
          description: "Firestore requests are blocked by your browser (ad blocker/privacy shield). Disable it for this site and refresh.",
          variant: "destructive",
        });
      }
    );
    return unsub;
  }, [user, toast]);

  const filtered = interactions.filter((i) => {
    const matchesSearch =
      search === "" ||
      i.customerName.toLowerCase().includes(search.toLowerCase()) ||
      i.company?.toLowerCase().includes(search.toLowerCase());
    const matchesRisk = riskFilter === "ALL" || i.risk === riskFilter;
    return matchesSearch && matchesRisk;
  });

  return (
    <div>
      <TopBar title="Interaction History" subtitle="All customer interactions and AI analysis" />

      <div className="p-6 animate-fade-in">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Search by customer name or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            {(["ALL", "LOW", "MEDIUM", "HIGH"] as RiskFilter[]).map((risk) => (
              <Button
                key={risk}
                variant={riskFilter === risk ? "default" : "outline"}
                size="sm"
                onClick={() => setRiskFilter(risk)}
                className={`text-xs ${
                  riskFilter === risk
                    ? ""
                    : risk === "HIGH"
                    ? "text-red-400 border-red-500/30 hover:border-red-500/50"
                    : risk === "MEDIUM"
                    ? "text-amber-400 border-amber-500/30 hover:border-amber-500/50"
                    : risk === "LOW"
                    ? "text-green-400 border-green-500/30 hover:border-green-500/50"
                    : ""
                }`}
              >
                {risk === "ALL" ? (
                  <>
                    <SlidersHorizontal size={12} />
                    All
                  </>
                ) : (
                  <>
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        risk === "HIGH"
                          ? "bg-red-500"
                          : risk === "MEDIUM"
                          ? "bg-amber-500"
                          : "bg-green-500"
                      }`}
                    />
                    {risk}
                  </>
                )}
              </Button>
            ))}
          </div>
        </div>

        {loadingData ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
          </div>
        ) : (
          <>
            <p className="text-xs text-slate-500 mb-4">
              Showing{" "}
              <span className="text-slate-300 font-medium">{filtered.length}</span> of{" "}
              {interactions.length} interactions
            </p>

            <Card className="border-[#1e2d40] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#1e2d40] bg-[#0a1020]">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Summary</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Risk</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Date</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e2d40]">
                    {filtered.map((interaction) => {
                      const isExpanded = expandedRow === interaction.id;
                      const cfg = riskConfig[interaction.risk];
                      return (
                        <>
                          <tr
                            key={interaction.id}
                            className="hover:bg-[#1a2234] transition-colors duration-150 cursor-pointer"
                            onClick={() => setExpandedRow(isExpanded ? null : interaction.id)}
                          >
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300">
                                  {interaction.customerName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-slate-200">{interaction.customerName}</p>
                                  {interaction.company && (
                                    <p className="text-xs text-slate-500">{interaction.company}</p>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3.5 hidden md:table-cell">
                              <Badge variant="secondary" className="text-xs">{interaction.type}</Badge>
                            </td>
                            <td className="px-4 py-3.5">
                              <p className="text-sm text-slate-400 line-clamp-1 max-w-65">{interaction.summary}</p>
                            </td>
                            <td className="px-4 py-3.5">
                              <Badge variant={cfg.variant}>
                                <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                                {interaction.risk}
                              </Badge>
                            </td>
                            <td className="px-4 py-3.5 hidden sm:table-cell">
                              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                <Clock size={11} />
                                {formatRelativeDate(interaction.createdAt)}
                              </div>
                            </td>
                            <td className="px-4 py-3.5 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 text-xs gap-1 text-amber-500 hover:text-amber-400"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDialogInteraction(interaction);
                                  }}
                                >
                                  <MessageSquare size={12} />
                                  View
                                </Button>
                                <button className="text-slate-500 hover:text-slate-300 transition-colors">
                                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                </button>
                              </div>
                            </td>
                          </tr>
                          {isExpanded && (
                            <tr key={`${interaction.id}-expanded`} className="bg-[#0a1020]">
                              <td colSpan={6} className="px-6 py-4 animate-fade-in">
                                <div className="grid sm:grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Notes</p>
                                    <p className="text-sm text-slate-400 leading-relaxed">{interaction.notes}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Follow-ups</p>
                                    <ul className="space-y-1.5">
                                      {interaction.followUps.map((fu, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                                          <span className="text-amber-500 mt-0.5">·</span>
                                          {fu}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      );
                    })}
                  </tbody>
                </table>

                {filtered.length === 0 && !loadingData && (
                  <div className="text-center py-16">
                    <Filter className="h-8 w-8 text-slate-700 mx-auto mb-3" />
                    <p className="text-sm font-medium text-slate-500">
                      {interactions.length === 0 ? "No interactions yet" : "No interactions found"}
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      {interactions.length === 0
                        ? "Create your first interaction from New Interaction"
                        : "Try adjusting your search or filter"}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </>
        )}
      </div>

      <InteractionDetailDialog
        interaction={dialogInteraction}
        open={!!dialogInteraction}
        onClose={() => setDialogInteraction(null)}
      />
    </div>
  );
}
