"use client";

import { useState, useEffect } from "react";
import {
  User,
  Bell,
  Shield,
  Zap,
  ChevronRight,
  Check,
  ToggleLeft,
  ToggleRight,
  AlertTriangle,
  CreditCard,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { TopBar } from "@/components/layout/TopBar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

function ToggleSwitch({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button onClick={onToggle} className="focus:outline-none transition-colors">
      {enabled ? (
        <ToggleRight className="h-7 w-7 text-amber-500" />
      ) : (
        <ToggleLeft className="h-7 w-7 text-slate-600" />
      )}
    </button>
  );
}

export default function SettingsPage() {
  const { toast } = useToast();
  const { profile, updateProfile, loading: authLoading } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  const [profileForm, setProfileForm] = useState({
    name: "",
    company: "",
    phone: "",
  });

  const [notifications, setNotifications] = useState({
    emailFollowups: true,
    riskAlerts: true,
    weeklyReport: false,
    newFeatures: true,
  });

  // Sync form state when profile loads from Firestore
  useEffect(() => {
    if (!authLoading) {
      if (profile) {
        setProfileForm({
          name: profile.name || "",
          company: profile.company || "",
          phone: profile.phone || "",
        });
        setNotifications(profile.notifications || {
          emailFollowups: true,
          riskAlerts: true,
          weeklyReport: false,
          newFeatures: true,
        });
      }
      setProfileLoading(false);
    }
  }, [profile, authLoading]);

  const dailyCount = profile?.dailyCount ?? 0;
  const dailyLimit = profile?.dailyLimit ?? 20;
  const usagePct = Math.round((dailyCount / dailyLimit) * 100);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({ ...profileForm, notifications });
      setSaved(true);
      toast({ title: "Settings saved", description: "Your profile has been updated.", variant: "success" });
      setTimeout(() => setSaved(false), 2000);
    } catch {
      toast({ title: "Save failed", description: "Could not update profile.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const toggleNotification = async (key: keyof typeof notifications) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    await updateProfile({ notifications: updated });
  };

  return (
    <div>
      <TopBar title="Settings" subtitle="Manage your account and preferences" />

      <div className="p-6 max-w-3xl space-y-6 animate-fade-in">

        {/* Usage Card */}
        <Card className="border-[#1e2d40]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <Zap className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <CardTitle className="text-base">AI Usage</CardTitle>
                  <CardDescription>Daily analysis quota</CardDescription>
                </div>
              </div>
              <Badge variant={usagePct >= 90 ? "high" : usagePct >= 60 ? "medium" : "low"}>
                {usagePct}% used
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-300">
                  <span className="text-2xl font-bold text-amber-400">{dailyCount}</span>
                  <span className="text-slate-500"> / {dailyLimit} requests today</span>
                </span>
                <span className="text-xs text-slate-500">Resets at midnight</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-[#1e2d40] overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    usagePct >= 90 ? "bg-red-500" : usagePct >= 60 ? "bg-amber-500" : "bg-green-500"
                  }`}
                  style={{ width: `${usagePct}%` }}
                />
              </div>
            </div>

            {usagePct >= 80 && (
              <div className="flex items-start gap-2 rounded-xl bg-amber-500/5 border border-amber-500/20 p-3">
                <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-amber-400">Approaching daily limit</p>
                  <p className="text-xs text-slate-500 mt-0.5">Upgrade to Pro for unlimited analyses.</p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between rounded-xl border border-[#1e2d40] bg-[#0f172a] p-3">
              <div>
                <p className="text-xs font-semibold text-slate-300 capitalize">
                  {profile?.plan || "Free"} Plan
                </p>
                <p className="text-xs text-slate-500">{dailyLimit} analyses/day</p>
              </div>
              <Link href="/dashboard/billing">
                <Button size="sm" className="gap-2 text-xs">
                  <CreditCard size={12} />
                  Upgrade to Pro
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Profile Card */}
        <Card className="border-[#1e2d40]">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20">
                <User className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-base">Profile</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {profileLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
                <span className="ml-2 text-sm text-slate-400">Loading profile...</span>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Full Name</Label>
                    <Input
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      disabled={profileLoading}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Company</Label>
                    <Input
                      value={profileForm.company}
                      onChange={(e) => setProfileForm({ ...profileForm, company: e.target.value })}
                      disabled={profileLoading}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Email Address</Label>
                  <Input
                    type="email"
                    value={profile?.email || ""}
                    disabled
                    className="opacity-60 cursor-not-allowed"
                  />
                  <p className="text-xs text-slate-600">Email cannot be changed here.</p>
                </div>
                <div className="space-y-1.5">
                  <Label>Phone</Label>
                  <Input
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    disabled={profileLoading}
                  />
                </div>
                <Button onClick={handleSave} className="gap-2" disabled={saving || saved || profileLoading}>
                  {saving ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Saving...
                    </>
                  ) : saved ? (
                    <>
                      <Check size={16} />
                      Saved!
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Notifications Card */}
        <Card className="border-[#1e2d40]">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 border border-green-500/20">
                <Bell className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <CardTitle className="text-base">Notifications</CardTitle>
                <CardDescription>Control what alerts you receive</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            {[
              { key: "emailFollowups" as const, label: "Follow-up reminders", desc: "Get notified when follow-ups are due" },
              { key: "riskAlerts" as const, label: "Risk alerts", desc: "Immediate alerts for high-risk accounts" },
              { key: "weeklyReport" as const, label: "Weekly summary", desc: "Weekly digest of your activity" },
              { key: "newFeatures" as const, label: "Product updates", desc: "Learn about new SteelMind features" },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between py-3 border-b border-[#1e2d40] last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-slate-200">{item.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                </div>
                <ToggleSwitch
                  enabled={notifications[item.key]}
                  onToggle={() => toggleNotification(item.key)}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Security Card */}
        <Card className="border-[#1e2d40]">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20">
                <Shield className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <CardTitle className="text-base">Security</CardTitle>
                <CardDescription>Password and account security</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { label: "Change Password", desc: "Update your account password" },
              { label: "Two-Factor Authentication", desc: "Add an extra layer of security" },
              { label: "Active Sessions", desc: "Manage your signed-in devices" },
            ].map((item) => (
              <button
                key={item.label}
                className="flex w-full items-center justify-between rounded-xl p-3 hover:bg-[#1a2234] transition-colors duration-200 group"
              >
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-200">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
                <ChevronRight size={16} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-500/20">
          <CardHeader>
            <CardTitle className="text-base text-red-400">Danger Zone</CardTitle>
            <CardDescription>Irreversible account actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between rounded-xl border border-red-500/20 bg-red-500/5 p-4">
              <div>
                <p className="text-sm font-medium text-slate-200">Delete Account</p>
                <p className="text-xs text-slate-500">Permanently delete your account and all data</p>
              </div>
              <Button variant="destructive" size="sm">Delete</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
