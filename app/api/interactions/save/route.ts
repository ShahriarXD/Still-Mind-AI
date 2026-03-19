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

function decodeProjectIdFromIdToken(idToken: string): string | null {
  try {
    const parts = idToken.split(".");
    if (parts.length !== 3) return null;

    const payloadPart = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = payloadPart.padEnd(payloadPart.length + ((4 - (payloadPart.length % 4)) % 4), "=");
    const payload = JSON.parse(Buffer.from(padded, "base64").toString("utf8")) as {
      aud?: string;
      iss?: string;
    };

    if (payload.aud) return payload.aud;
    if (payload.iss?.includes("https://securetoken.google.com/")) {
      return payload.iss.split("https://securetoken.google.com/")[1] || null;
    }

    return null;
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

    const projectId =
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
      decodeProjectIdFromIdToken(idToken) ||
      "simple-prac-72cd7";

    const apiKey =
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
      "AIzaSyCcovDbWew5iwahusJ7B0v7yqkreh_h-RE";

    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${uid}/interactions?key=${encodeURIComponent(apiKey)}`;

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
      const lower = errorText.toLowerCase();
      const isServiceDisabled =
        lower.includes("service_disabled") ||
        lower.includes("cloud firestore api has not been used") ||
        lower.includes("firestore.googleapis.com");
      const isDatabaseMissing =
        lower.includes("database (default) does not exist") ||
        lower.includes("please visit https://console.cloud.google.com/datastore/setup");

      if (firestoreRes.status === 403 && isServiceDisabled) {
        const activationUrl = `https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=${projectId}`;
        return NextResponse.json(
          {
            error: "Cloud Firestore API is disabled for this Firebase project.",
            code: "FIRESTORE_API_DISABLED",
            status: firestoreRes.status,
            activationUrl,
            projectId,
          },
          { status: firestoreRes.status }
        );
      }

      if (firestoreRes.status === 404 && isDatabaseMissing) {
        const setupUrl = `https://console.cloud.google.com/datastore/setup?project=${projectId}`;
        return NextResponse.json(
          {
            error: "Cloud Firestore database is not created for this project.",
            code: "FIRESTORE_DATABASE_MISSING",
            status: firestoreRes.status,
            setupUrl,
            projectId,
          },
          { status: firestoreRes.status }
        );
      }

      return NextResponse.json(
        {
          error: "Firestore write failed",
          code: "FIRESTORE_WRITE_FAILED",
          status: firestoreRes.status,
          details: errorText,
          projectId,
        },
        { status: firestoreRes.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to save interaction.";
    return NextResponse.json({ error: "Failed to save interaction.", details: message }, { status: 500 });
  }
}
