/**
 * bKash Payment Gateway Integration
 * Checkout URL API v1.2.0-beta
 * Docs: https://developer.bka.sh/docs/product-overview
 */

export const BKASH_CONFIG = {
  sandbox: {
    baseURL: "https://checkout.sandbox.bka.sh/v1.2.0-beta",
    appKey: process.env.BKASH_APP_KEY || "",
    appSecret: process.env.BKASH_APP_SECRET || "",
    username: process.env.BKASH_USERNAME || "",
    password: process.env.BKASH_PASSWORD || "",
  },
  production: {
    baseURL: "https://checkout.pay.bka.sh/v1.2.0-beta",
    appKey: process.env.BKASH_APP_KEY || "",
    appSecret: process.env.BKASH_APP_SECRET || "",
    username: process.env.BKASH_USERNAME || "",
    password: process.env.BKASH_PASSWORD || "",
  },
};

export const IS_PRODUCTION = process.env.NODE_ENV === "production";
export const bkashConfig = IS_PRODUCTION
  ? BKASH_CONFIG.production
  : BKASH_CONFIG.sandbox;

// Token cache (in-memory; use Redis in production)
let cachedToken: { token: string; expiresAt: number } | null = null;

export interface BkashGrantTokenResponse {
  id_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: string;
}

export interface BkashCreatePaymentRequest {
  amount: string;
  currency: "BDT";
  intent: "sale" | "authorization";
  merchantInvoiceNumber: string;
  merchantAssociationInfo?: string;
}

export interface BkashCreatePaymentResponse {
  paymentID: string;
  createTime: string;
  orgLogo: string;
  orgName: string;
  transactionStatus: string;
  amount: string;
  currency: string;
  intent: string;
  merchantInvoiceNumber: string;
  statusCode?: string;
  statusMessage?: string;
}

export interface BkashExecutePaymentResponse {
  paymentID: string;
  createTime: string;
  updateTime: string;
  trxID: string;
  transactionStatus: "Completed" | "Failed" | "Cancelled";
  amount: string;
  currency: string;
  intent: string;
  merchantInvoiceNumber: string;
  customerMsisdn?: string;
  statusCode?: string;
  statusMessage?: string;
}

/**
 * Step 1: Get or refresh bKash access token
 */
export async function getBkashToken(): Promise<string> {
  const now = Date.now();

  // Return cached token if still valid (with 60s buffer)
  if (cachedToken && cachedToken.expiresAt > now + 60_000) {
    return cachedToken.token;
  }

  const response = await fetch(
    `${bkashConfig.baseURL}/checkout/token/grant`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        username: bkashConfig.username,
        password: bkashConfig.password,
      },
      body: JSON.stringify({
        app_key: bkashConfig.appKey,
        app_secret: bkashConfig.appSecret,
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`bKash token grant failed: ${err}`);
  }

  const data: BkashGrantTokenResponse = await response.json();

  cachedToken = {
    token: data.id_token,
    expiresAt: now + parseInt(data.expires_in, 10) * 1000,
  };

  return data.id_token;
}

/**
 * Step 2: Create payment – returns paymentID
 */
export async function createBkashPayment(
  payload: BkashCreatePaymentRequest
): Promise<BkashCreatePaymentResponse> {
  const token = await getBkashToken();

  const response = await fetch(
    `${bkashConfig.baseURL}/checkout/payment/create`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-APP-Key": bkashConfig.appKey,
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();

  if (!response.ok || data.statusCode) {
    throw new Error(
      data.statusMessage || `bKash payment creation failed: ${response.status}`
    );
  }

  return data;
}

/**
 * Step 3: Execute payment – confirms the payment after user authorization
 */
export async function executeBkashPayment(
  paymentID: string
): Promise<BkashExecutePaymentResponse> {
  const token = await getBkashToken();

  const response = await fetch(
    `${bkashConfig.baseURL}/checkout/payment/execute/${paymentID}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-APP-Key": bkashConfig.appKey,
      },
    }
  );

  const data = await response.json();

  if (!response.ok || data.statusCode) {
    throw new Error(
      data.statusMessage || `bKash payment execution failed: ${response.status}`
    );
  }

  return data;
}

/**
 * Query payment status
 */
export async function queryBkashPayment(paymentID: string) {
  const token = await getBkashToken();

  const response = await fetch(
    `${bkashConfig.baseURL}/checkout/payment/query/${paymentID}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-APP-Key": bkashConfig.appKey,
      },
    }
  );

  return response.json();
}

/**
 * Generate a unique merchant invoice number
 */
export function generateInvoiceNumber(prefix = "SM"): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Pricing Plans
 */
export const PRICING_PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: "500",
    currency: "BDT",
    period: "month",
    features: [
      "50 AI analyses/day",
      "Full history access",
      "Export to CSV",
      "Email support",
    ],
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "1200",
    currency: "BDT",
    period: "month",
    features: [
      "Unlimited AI analyses",
      "Priority support",
      "Advanced risk scoring",
      "WhatsApp integration",
      "Custom message templates",
      "Team collaboration (3 seats)",
    ],
    popular: true,
  },
  {
    id: "business",
    name: "Business",
    price: "2500",
    currency: "BDT",
    period: "month",
    features: [
      "Everything in Pro",
      "Unlimited team seats",
      "API access",
      "Custom AI training",
      "Dedicated account manager",
      "SLA guarantee",
    ],
    popular: false,
  },
];
