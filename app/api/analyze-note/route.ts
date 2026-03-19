import { NextRequest, NextResponse } from "next/server";
import type { AnalyzeNoteRequest, AnalyzeNoteResponse, RiskLevel } from "@/lib/types";

const riskKeywords: Record<RiskLevel, string[]> = {
  HIGH: [
    "overdue", "late payment", "no response", "threatening", "switch supplier",
    "collections", "stop order", "cancel", "complaint", "dispute", "urgent",
    "unpaid", "defaulted", "angry", "upset", "escalate",
  ],
  MEDIUM: [
    "delayed", "extension", "slow", "concerned", "competitor", "lower price",
    "considering", "maybe", "waiting", "pending", "unclear", "price sensitive",
  ],
  LOW: [
    "paid on time", "excellent", "reliable", "professional", "new order",
    "satisfied", "happy", "confirmed", "great", "smooth", "on schedule",
  ],
};

function detectRisk(note: string, type: string): RiskLevel {
  const lowerNote = note.toLowerCase();

  let highScore = 0;
  let mediumScore = 0;
  let lowScore = 0;

  riskKeywords.HIGH.forEach((kw) => { if (lowerNote.includes(kw)) highScore += 2; });
  riskKeywords.MEDIUM.forEach((kw) => { if (lowerNote.includes(kw)) mediumScore += 1; });
  riskKeywords.LOW.forEach((kw) => { if (lowerNote.includes(kw)) lowScore += 1; });

  if (type === "Complaint") highScore += 3;
  if (type === "Payment Follow-up") mediumScore += 2;
  if (type === "New Order") lowScore += 2;

  if (highScore > 2 || highScore >= mediumScore) return "HIGH";
  if (mediumScore > lowScore) return "MEDIUM";
  return "LOW";
}

function generateSummary(
  customerName: string,
  note: string,
  type: string
): string {
  const sentences = note.split(/[.!?]/).filter((s) => s.trim().length > 10);
  const keyPoints = sentences.slice(0, 2).map((s) => s.trim()).join(". ");

  const typeIntro: Record<string, string> = {
    "New Order": "Order interaction with",
    "Payment Follow-up": "Payment follow-up for",
    Complaint: "Customer complaint from",
    General: "General inquiry from",
  };

  const intro = typeIntro[type] || "Interaction with";
  return `${intro} ${customerName}. ${keyPoints}${keyPoints.endsWith(".") ? "" : "."}`;
}

function generateFollowUps(risk: RiskLevel, type: string): string[] {
  const baseFollowUps: Record<string, string[]> = {
    "New Order": [
      "Send order confirmation within 2 hours",
      "Confirm delivery timeline with logistics",
      "Follow up after delivery to ensure satisfaction",
    ],
    "Payment Follow-up": [
      "Send formal payment reminder email",
      "Follow up via phone in 3 business days",
      "Review account credit limit",
    ],
    Complaint: [
      "Escalate to quality control team immediately",
      "Contact customer within 24 hours with resolution plan",
      "Offer compensation: discount or replacement",
    ],
    General: [
      "Send relevant product catalog",
      "Follow up in 1 week",
      "Add to priority contact list",
    ],
  };

  const riskFollowUps: Record<RiskLevel, string[]> = {
    HIGH: [
      "Flag account for senior review",
      "Document all communications",
    ],
    MEDIUM: ["Schedule a check-in call next week"],
    LOW: ["Explore upsell opportunities in next interaction"],
  };

  return [
    ...(baseFollowUps[type] || baseFollowUps.General),
    ...(riskFollowUps[risk] || []),
  ];
}

function generateDraftMessage(
  customerName: string,
  risk: RiskLevel,
  type: string,
  _note: string
): string {
  const firstName = customerName.split(" ")[0];

  const templates: Record<string, string> = {
    "New Order": `Hi ${firstName}, thank you for your order! We've confirmed your request and our team is processing it now. You'll receive a dispatch notification shortly. We appreciate your business and are always here if you need anything. – SteelMind Team`,
    "Payment Follow-up":
      risk === "HIGH"
        ? `Dear ${firstName}, this is a follow-up regarding your outstanding balance. We'd appreciate your urgent attention to settle this matter. Please contact us at your earliest convenience to arrange payment or discuss a plan. – SteelMind Team`
        : `Hi ${firstName}, just a friendly reminder about your upcoming payment. Please let us know if you need any assistance or flexibility. We're happy to help. – SteelMind Team`,
    Complaint: `Dear ${firstName}, we sincerely apologize for the issue you experienced. This is not the standard we hold ourselves to, and we take this very seriously. Our team is investigating immediately and we will have a resolution for you within 24 hours. Thank you for your patience. – SteelMind Team`,
    General: `Hi ${firstName}, great connecting with you! I'm following up on our recent conversation. Please find the relevant information attached. Don't hesitate to reach out if you have any questions — we're always happy to help. – SteelMind Team`,
  };

  return templates[type] || templates.General;
}

export async function POST(req: NextRequest) {
  try {
    const body: AnalyzeNoteRequest = await req.json();
    const { customerName, note, type } = body;

    if (!customerName || !note || !type) {
      return NextResponse.json(
        { error: "Missing required fields: customerName, note, type" },
        { status: 400 }
      );
    }

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const risk = detectRisk(note, type);
    const summary = generateSummary(customerName, note, type);
    const followUps = generateFollowUps(risk, type);
    const draftMessage = generateDraftMessage(customerName, risk, type, note);

    const response: AnalyzeNoteResponse = {
      summary,
      risk,
      followUps,
      draftMessage,
    };

    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { error: "Failed to analyze note. Please try again." },
      { status: 500 }
    );
  }
}
