import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const ApplicationSchema = z.object({
  full_name: z.string().min(1).max(120),
  email: z.string().email().max(200),
  phone: z.string().regex(/^[6-9]\d{9}$/),
  city: z.string().min(1).max(100),
  position: z.string().min(1).max(120),
  experience: z.string().max(40).optional().default(""),
  education: z.string().max(40).optional().default(""),
  message: z.string().max(300).optional().default(""),
});

function base64url(input: ArrayBuffer | Uint8Array | string): string {
  let bytes: Uint8Array;
  if (typeof input === "string") {
    bytes = new TextEncoder().encode(input);
  } else if (input instanceof Uint8Array) {
    bytes = input;
  } else {
    bytes = new Uint8Array(input);
  }
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function pemToDer(pem: string): Uint8Array {
  const trimmed = pem.trim().replace(/^"|"$/g, "").trim();
  const cleaned = trimmed
    .replace(/-----BEGIN [^-]+-----/g, "")
    .replace(/-----END [^-]+-----/g, "")
    .replace(/\s+/g, "");

  try {
    const bin = atob(cleaned);
    const der = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) der[i] = bin.charCodeAt(i);
    return der;
  } catch (err: any) {
    console.error("JWT signing failed at pemToDer (atob decoding):", err);
    throw new Error(`[JWT signing] Failed to decode private key base64. Underlying error: ${err?.message || err}`);
  }
}

async function getGoogleAccessToken(): Promise<string> {
  // 1. ENV loading check
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;
  
  if (!email || !rawKey) {
    console.error("DIAGNOSTIC - [ENV loading] GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_PRIVATE_KEY is missing.");
    throw new Error("[ENV loading] GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_PRIVATE_KEY is missing from environment variables.");
  }

  // 2. JWT signing
  let jwt: string;
  try {
    const privateKeyPem = rawKey.replace(/^"|"$/g, "").replace(/\\n/g, "\n");
    const now = Math.floor(Date.now() / 1000);
    const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
    const payload = base64url(
      JSON.stringify({
        iss: email,
        scope: "https://www.googleapis.com/auth/spreadsheets",
        aud: "https://oauth2.googleapis.com/token",
        exp: now + 3600,
        iat: now,
      }),
    );
    const signingInput = `${header}.${payload}`;

    const der = pemToDer(privateKeyPem);
    const cryptoKey = await crypto.subtle.importKey(
      "pkcs8",
      der.buffer.slice(der.byteOffset, der.byteOffset + der.byteLength) as ArrayBuffer,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const signature = await crypto.subtle.sign(
      "RSASSA-PKCS1-v1_5",
      cryptoKey,
      new TextEncoder().encode(signingInput),
    );
    jwt = `${signingInput}.${base64url(signature)}`;
    console.log("DIAGNOSTIC - [JWT signing] JWT successfully generated.");
  } catch (err: any) {
    console.error("DIAGNOSTIC - [JWT signing] Error:", err);
    throw new Error(`[JWT signing] failed: ${err?.message || err}`);
  }

  // 3. Token exchange
  console.log("DIAGNOSTIC - Starting [Token exchange] fetch...");
  let res: Response;
  try {
    res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
    });
  } catch (err: any) {
    console.error("DIAGNOSTIC - [Token exchange] Network/fetch error:", err);
    throw new Error(`[Token exchange] Network fetch failed: ${err?.message || err}`);
  }

  const responseText = await res.text();
  console.log("DIAGNOSTIC - [Token exchange] HTTP status:", res.status);
  console.log("DIAGNOSTIC - [Token exchange] response body:", responseText);

  if (!res.ok) {
    let failingStep = "[Token exchange] error";
    if (res.status === 400 || res.status === 401) {
      failingStep = "[Invalid credentials]";
    }
    throw new Error(`${failingStep}: HTTP ${res.status} - Response: ${responseText}`);
  }

  let json: { access_token?: string };
  try {
    json = JSON.parse(responseText);
  } catch (err: any) {
    throw new Error(`[Token exchange] failed to parse JSON response. Text: ${responseText}`);
  }

  if (!json.access_token) {
    throw new Error(`[Token exchange] missing access_token in JSON response: ${responseText}`);
  }

  console.log("DIAGNOSTIC - [Token exchange] Success.");
  return json.access_token;
}

export const syncToSheets = createServerFn({ method: "POST" })
  .validator(ApplicationSchema)
  .handler(async ({ data }) => {
    console.log("DIAGNOSTIC - syncToSheets starting");
    
    // Check sheet ID env
    const sheetId = process.env.GOOGLE_SHEET_ID;
    if (!sheetId) {
      console.error("DIAGNOSTIC - [ENV loading] GOOGLE_SHEET_ID is missing.");
      throw new Error("[ENV loading] GOOGLE_SHEET_ID is missing from environment variables.");
    }

    // Wrap token generation in try/catch to expose structured details
    let token: string;
    try {
      token = await getGoogleAccessToken();
      console.log("DIAGNOSTIC - token generation success");
    } catch (err: any) {
      console.error("DIAGNOSTIC - token generation failure:", err);
      // Return structured error
      throw new Error(`Token Generation Failed: ${err?.message || err}`);
    }

    const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    const row = [
      data.full_name,
      data.email,
      data.phone,
      data.city,
      data.position,
      data.experience ?? "",
      data.education ?? "",
      data.message ?? "",
      timestamp,
    ];

    const range = "Sheet1!A1:append";
    console.log("DIAGNOSTIC - Target range:", range);
    console.log("DIAGNOSTIC - Target spreadsheet ID:", sheetId);

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?valueInputOption=USER_ENTERED`;
    console.log("DIAGNOSTIC - Starting [Sheets append] fetch...");

    let res: Response;
    try {
      res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ values: [row] }),
      });
    } catch (err: any) {
      console.error("DIAGNOSTIC - [Sheets append] fetch/network error:", err);
      throw new Error(`[Sheets append] Network fetch failed: ${err?.message || err}`);
    }

    const resText = await res.text();
    console.log("DIAGNOSTIC - [Sheets append] HTTP status:", res.status);
    console.log("DIAGNOSTIC - [Sheets append] response body:", resText);

    if (!res.ok) {
      let failingStep = "[Sheets append]";
      if (res.status === 403) {
        failingStep = "[Permission denied]";
      } else if (res.status === 404) {
        failingStep = "[Spreadsheet not found]";
      }
      throw new Error(`${failingStep}: HTTP ${res.status} - Response: ${resText}`);
    }

    let resJson;
    try {
      resJson = JSON.parse(resText);
    } catch (err: any) {
      console.error("DIAGNOSTIC - [Sheets append] Failed to parse success JSON:", err);
    }

    console.log("DIAGNOSTIC - [Sheets append] response success:", resJson);
    return { ok: true };
  });

