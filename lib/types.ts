export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export type InteractionType =
  | "New Order"
  | "Payment Follow-up"
  | "Complaint"
  | "General";

export interface Interaction {
  id: string;
  customerName: string;
  phone?: string;
  company?: string;
  type: InteractionType;
  notes: string;
  summary: string;
  risk: RiskLevel;
  followUps: string[];
  draftMessage: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  company?: string;
  risk: RiskLevel;
  totalInteractions: number;
  lastContact: string;
}

export interface AnalyzeNoteRequest {
  customerName: string;
  note: string;
  type: InteractionType;
  phone?: string;
  company?: string;
}

export interface AnalyzeNoteResponse {
  summary: string;
  risk: RiskLevel;
  followUps: string[];
  draftMessage: string;
}

export interface DashboardStats {
  totalCustomers: number;
  totalInteractions: number;
  highRiskCustomers: number;
  followUpsDue: number;
}

export interface ChartDataPoint {
  date: string;
  interactions: number;
}

// Prisma-ready model structures (for future DB integration)
export interface UserModel {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  interactions: Interaction[];
  usageLimit: UsageLimitModel;
}

export interface UsageLimitModel {
  id: string;
  userId: string;
  dailyCount: number;
  dailyLimit: number;
  lastReset: Date;
}
