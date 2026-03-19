import { NextRequest, NextResponse } from "next/server";

type SaveInteractionBody = {
  idToken: string;
  interaction: {
    customerName: string;
    phone?: string;
    company?: string;
    type: string;
    notes: string;
    summary: string;
    risk: string;
    followUps: string[];
    draftMessage: string;
    createdAt: string;
  };
};

function decodeUidFromIdToken(idToken: string): string | null {
  try {
    const parts = idToken.split(".");
    if (parts.length !== 3) return null;

    const payloadPart = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = payloadPart.padEnd(payloadPart.length + ((4 - (payloadPart.length % 4)) % 4), "=");
    const payload = JSON.parse(Buffer.from(padded, "base64").toString("utf8")) as {
      user_id?: string;
      sub?: string;
    };

    return payload.user_id ?? payload.sub ?? null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SaveInteractionBody;
    const { idToken, interaction } = body;

    if (!idToken || !interaction) {
      return NextResponse.json({ error: "Missing idToken or interaction payload." }, { status: 400 });
    }

    const uid = decodeUidFromIdToken(idToken);
    if (!uid) {
      return NextResponse.json({ error: "Invalid authentication token." }, { status: 401 });
    }

    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (!projectId) {
      return NextResponse.json({ error: "Firebase project is not configured on server." }, { status: 500 });
    }

    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${uid}/interactions`;

    const fields = {
      customerName: { stringValue: interaction.customerName || "" },
      phone: { stringValue: interaction.phone || "" },
      company: { stringValue: interaction.company || "" },
      type: { stringValue: interaction.type || "" },
      notes: { stringValue: interaction.notes || "" },
      summary: { stringValue: interaction.summary || "" },
      risk: { stringValue: interaction.risk || "LOW" },
      followUps: {
        arrayValue: {
          values: (interaction.followUps || []).map((value) => ({ stringValue: value })),
        },
      },
      draftMessage: { stringValue: interaction.draftMessage || "" },
      createdAt: { timestampValue: interaction.createdAt || new Date().toISOString() },
    };

    const firestoreRes = await fetch(firestoreUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ fields }),
    });

    if (!firestoreRes.ok) {
      const errorText = await firestoreRes.text();
      return NextResponse.json(
        { error: "Firestore write failed", details: errorText },
        { status: firestoreRes.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save interaction." }, { status: 500 });
  }
}
