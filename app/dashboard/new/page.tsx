"use client";

import { useState } from "react";
import {
  Loader2,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  MessageSquare,
  ClipboardList,
  Copy,
  Check,
  RefreshCw,
} from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import type { AnalyzeNoteResponse, InteractionType, RiskLevel } from "@/lib/types";

const interactionTypes: InteractionType[] = [
  "New Order",
  "Payment Follow-up",
  "Complaint",
  "General",
];

function RiskIndicator({ risk }: { risk: RiskLevel }) {
  const config = {
    LOW: {
      variant: "low" as const,
      icon: CheckCircle,
      color: "text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
      label: "Low Risk",
      desc: "This customer appears in good standing.",
    },
    MEDIUM: {
      variant: "medium" as const,
      icon: AlertTriangle,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      label: "Medium Risk",
      desc: "Monitor this account closely.",
    },
    HIGH: {
      variant: "high" as const,
      icon: AlertTriangle,
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      label: "High Risk",
      desc: "Immediate attention required.",
    },
  };
  const c = config[risk];
  return (
    <div className={`flex items-center gap-3 rounded-xl ${c.bg} border ${c.border} p-4`}>
      <c.icon className={`h-8 w-8 ${c.color} shrink-0`} />
      <div>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-semibold ${c.color}`}>{c.label}</span>
          <Badge variant={c.variant}>{risk}</Badge>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">{c.desc}</p>
      </div>
    </div>
  );
}

export default function NewInteractionPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<AnalyzeNoteResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    company: "",
    type: "" as InteractionType | "",
    notes: "",
  });

  const handleAnalyze = async () => {
    if (!form.customerName || !form.notes || !form.type) {
      toast({
        title: "Missing required fields",
        description: "Please fill in customer name, interaction type, and notes.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/analyze-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.customerName,
          note: form.notes,
          type: form.type,
          phone: form.phone,
          company: form.company,
        }),
      });

      if (!response.ok) throw new Error("Analysis failed");

      const data: AnalyzeNoteResponse = await response.json();
      setResult(data);
      toast({
        title: "Analysis complete",
        description: "AI has processed your interaction notes.",
      });
    } catch {
      toast({
        title: "Analysis failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyMessage = async () => {
    if (!result?.draftMessage) return;
    await navigator.clipboard.writeText(result.draftMessage);
    setCopied(true);
    toast({ title: "Copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    if (!result || !user) return;
    setSaving(true);
    setSaveError(null);
    try {
      await addDoc(collection(db, "users", user.uid, "interactions"), {
        customerName: form.customerName,
        phone: form.phone,
        company: form.company,
        type: form.type,
        notes: form.notes,
        summary: result.summary,
        risk: result.risk,
        followUps: result.followUps,
        draftMessage: result.draftMessage,
        createdAt: serverTimestamp(),
      });
      setSaved(true);
      toast({ title: "Interaction saved", description: "Added to your history.", variant: "success" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not save interaction.";
      setSaveError(msg);
      toast({ title: "Save failed", description: "Could not save interaction.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setForm({ customerName: "", phone: "", company: "", type: "", notes: "" });
    setResult(null);
    setSaved(false);
    setSaveError(null);
  };

  return (
    <div>
      <TopBar title="New Interaction" subtitle="Log and analyze a customer interaction" />

      <div className="p-6 max-w-5xl animate-fade-in">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <div className="space-y-5">
            <Card className="border-[#1e2d40]">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-amber-500" size={18} />
                  Customer Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="customerName">Customer Name *</Label>
                  <Input
                    id="customerName"
                    placeholder="e.g. Ahmad Karimi"
                    value={form.customerName}
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      placeholder="+1 234 567 8900"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      placeholder="Company name"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Interaction Type *</Label>
                  <Select
                    value={form.type}
                    onValueChange={(v) => setForm({ ...form, type: v as InteractionType })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type..." />
                    </SelectTrigger>
                    <SelectContent>
                      {interactionTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#1e2d40]">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-amber-500" size={18} />
                  Interaction Notes *
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Paste your raw notes here... e.g. 'Called Ahmed about invoice #2041, he said he needs 2 more weeks, mentioned cash flow issues...'"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="min-h-45 resize-none"
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    {form.notes.length} characters
                  </span>
                  <Button
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Analyze with AI
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            {loading && (
              <Card className="border-[#1e2d40]">
                <CardContent className="p-8 flex flex-col items-center justify-center text-center gap-4">
                  <div className="relative">
                    <div className="h-14 w-14 rounded-full border-2 border-amber-500/20 border-t-amber-500 animate-spin" />
                    <Sparkles className="absolute inset-0 m-auto h-6 w-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-200">Analyzing your notes...</p>
                    <p className="text-xs text-slate-500 mt-1">AI is processing and extracting insights</p>
                  </div>
                  <div className="flex gap-2">
                    {["Summarizing", "Detecting risk", "Generating follow-ups"].map(
                      (step, i) => (
                        <span
                          key={step}
                          className="text-[10px] rounded-full border border-amber-500/20 bg-amber-500/5 px-2.5 py-1 text-amber-400 animate-pulse"
                          style={{ animationDelay: `${i * 200}ms` }}
                        >
                          {step}
                        </span>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {!loading && !result && (
              <Card className="border-[#1e2d40] border-dashed">
                <CardContent className="p-10 flex flex-col items-center justify-center text-center gap-3">
                  <div className="h-14 w-14 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-center justify-center">
                    <Sparkles className="h-7 w-7 text-amber-500/40" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-400">AI Results will appear here</p>
                    <p className="text-xs text-slate-600 mt-1">
                      Fill in the form and click &ldquo;Analyze with AI&rdquo;
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {result && !loading && (
              <div className="space-y-4 animate-slide-up">
                {/* Risk Level */}
                <RiskIndicator risk={result.risk} />

                {/* Summary */}
                <Card className="border-[#1e2d40]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-slate-300">AI Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-300 leading-relaxed">{result.summary}</p>
                  </CardContent>
                </Card>

                {/* Follow-ups */}
                <Card className="border-[#1e2d40]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-slate-300">
                      Suggested Follow-ups ({result.followUps.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {result.followUps.map((fu, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-semibold text-amber-400">
                          {i + 1}
                        </span>
                        <p className="text-sm text-slate-300 leading-relaxed">{fu}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Draft Message — copy only, no email sending */}
                <Card className="border-[#1e2d40]">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm text-slate-300">Draft Message</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopyMessage}
                        className="gap-1.5 text-xs h-7"
                      >
                        {copied ? (
                          <>
                            <Check size={12} className="text-green-400" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-xl bg-[#0f172a] border border-[#1e2d40] p-3 text-sm text-slate-300 leading-relaxed">
                      {result.draftMessage}
                    </div>
                  </CardContent>
                </Card>

                {/* Save error */}
                {saveError && (
                  <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                    <span className="font-medium">Save failed:</span> {saveError}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleSave}
                    disabled={saved || saving}
                    className="flex-1 gap-2"
                    variant={saved ? "success" : "default"}
                  >
                    {saving ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Saving...
                      </>
                    ) : saved ? (
                      <>
                        <Check size={16} />
                        Saved to History
                      </>
                    ) : (
                      <>
                        <Check size={16} />
                        Save Interaction
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={handleReset} className="gap-2">
                    <RefreshCw size={14} />
                    New
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
