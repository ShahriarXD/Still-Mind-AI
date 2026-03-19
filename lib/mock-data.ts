import type { Interaction, DashboardStats, ChartDataPoint } from "./types";

export const mockInteractions: Interaction[] = [
  {
    id: "1",
    customerName: "Ahmad Karimi",
    phone: "+98 912 345 6789",
    company: "Karimi Steel Co.",
    type: "Payment Follow-up",
    notes:
      "Called Ahmad about outstanding invoice #2041 of $12,400. He mentioned cash flow issues this month and asked for 2 more weeks. His last 3 payments were late. Seems stressed. Business may be slowing down.",
    summary:
      "Customer requested 2-week payment extension on invoice #2041 ($12,400). Third consecutive late payment. Potential financial distress.",
    risk: "HIGH",
    followUps: [
      "Call back in 14 days for payment confirmation",
      "Send formal payment reminder via email",
      "Review credit limit — consider reducing",
      "Check if order backlog has changed",
    ],
    draftMessage:
      "Hi Ahmad, following up on our conversation today regarding invoice #2041. As discussed, we've extended the payment deadline by 14 days. Please confirm payment by [DATE]. Let me know if you need to discuss further. – SteelMind",
    createdAt: "2026-03-17T09:30:00Z",
  },
  {
    id: "2",
    customerName: "Sara Hosseini",
    phone: "+98 901 234 5678",
    company: "Hosseini Trading",
    type: "New Order",
    notes:
      "Sara placed a new order for 200 units of flat bar steel, 20mm x 6m. Requested delivery within 5 days. She paid last order on time. Wants a bulk discount for future orders. Very professional tone.",
    summary:
      "New order placed: 200 units flat bar steel (20mm x 6m), 5-day delivery. Customer requests bulk discount discussion. Excellent payment history.",
    risk: "LOW",
    followUps: [
      "Confirm order and dispatch schedule",
      "Prepare bulk discount proposal for next interaction",
      "Send order confirmation via WhatsApp",
    ],
    draftMessage:
      "Hi Sara! Your order for 200 units of flat bar steel has been confirmed. Expected delivery within 5 business days. We'll prepare a bulk discount proposal for our next discussion. Thank you for your continued business! – SteelMind",
    createdAt: "2026-03-16T14:15:00Z",
  },
  {
    id: "3",
    customerName: "Mohammed Al-Rashid",
    phone: "+971 50 987 6543",
    company: "Al-Rashid Constructions",
    type: "Complaint",
    notes:
      "Mohammed called upset about last delivery. Said the steel rods were 3mm shorter than spec. Wants replacement or discount. Threatening to switch suppliers. Has been a customer for 3 years. Large account.",
    summary:
      "Quality complaint: steel rods undersized by 3mm. Customer threatening supplier switch. Long-term, high-value account at risk.",
    risk: "HIGH",
    followUps: [
      "Investigate production batch #B-4421",
      "Offer 15% discount or free replacement within 48 hours",
      "Schedule call with quality control team",
      "Send formal apology and resolution plan",
    ],
    draftMessage:
      "Dear Mohammed, we sincerely apologize for the quality issue with your recent delivery. This does not meet our standards. We are investigating immediately and will offer you either a full replacement or a 15% discount. We value your 3-year partnership greatly. Can we schedule a call tomorrow? – SteelMind",
    createdAt: "2026-03-15T11:00:00Z",
  },
  {
    id: "4",
    customerName: "Leila Rezaei",
    phone: "+98 935 111 2222",
    company: "Rezaei Fabrication",
    type: "General",
    notes:
      "Leila called to check on new product availability. Interested in galvanized sheets for a new project. Mentioned competitor is offering lower prices. No immediate order. Healthy account, pays on time.",
    summary:
      "Customer inquiry about galvanized sheets for upcoming project. Price sensitivity noted — competitor pressure. No immediate order.",
    risk: "MEDIUM",
    followUps: [
      "Send galvanized sheet catalog and pricing",
      "Follow up in 1 week about project status",
      "Prepare competitive pricing comparison",
    ],
    draftMessage:
      "Hi Leila, great speaking with you! I've attached our latest catalog for galvanized sheets with updated pricing. We'd love to support your new project. Let's connect next week to discuss specifics — I'm confident we can offer a competitive deal. – SteelMind",
    createdAt: "2026-03-14T16:45:00Z",
  },
  {
    id: "5",
    customerName: "David Chen",
    phone: "+65 9123 4567",
    company: "Chen Metal Works",
    type: "Payment Follow-up",
    notes:
      "Sent 2nd reminder for invoice #1987 ($8,200). No response to emails. Phone call went to voicemail. Overdue by 45 days. Previously reliable customer who went quiet 2 months ago.",
    summary:
      "Second payment reminder sent for $8,200 (45 days overdue). No customer response to emails or calls. Account may be inactive.",
    risk: "HIGH",
    followUps: [
      "Escalate to formal collections process",
      "Send registered letter with final notice",
      "Pause new orders until resolved",
      "Attempt WhatsApp contact",
    ],
    draftMessage:
      "Dear David, this is a final notice regarding invoice #1987 for $8,200, now 45 days overdue. Please contact us urgently at your earliest convenience to arrange payment or discuss a payment plan. Failure to respond within 7 days may require us to engage our collections process. – SteelMind",
    createdAt: "2026-03-13T09:00:00Z",
  },
];

export const mockStats: DashboardStats = {
  totalCustomers: 47,
  totalInteractions: 183,
  highRiskCustomers: 8,
  followUpsDue: 12,
};

export const mockChartData: ChartDataPoint[] = [
  { date: "Feb 17", interactions: 4 },
  { date: "Feb 22", interactions: 7 },
  { date: "Feb 27", interactions: 5 },
  { date: "Mar 3", interactions: 9 },
  { date: "Mar 8", interactions: 6 },
  { date: "Mar 13", interactions: 11 },
  { date: "Mar 17", interactions: 8 },
  { date: "Mar 19", interactions: 14 },
];

export const mockUsage = {
  used: 12,
  limit: 20,
  resetTime: "midnight UTC",
};
