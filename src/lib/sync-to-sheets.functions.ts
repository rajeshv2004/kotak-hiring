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
  // Strip any surrounding quotes and whitespace
  const trimmed = pem.trim().replace(/^"|"$/g, "").trim();
  console.log("PEM begins with:", trimmed.substring(0, 40));
  console.log("PEM ends with:", trimmed.substring(trimmed.length - 40));

  const cleaned = trimmed
    .replace(/-----BEGIN [^-]+-----/g, "")
    .replace(/-----END [^-]+-----/g, "")
    .replace(/\s+/g, "");

  console.log("Cleaned base64 length:", cleaned.length);
  try {
    const bin = atob(cleaned);
    const der = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) der[i] = bin.charCodeAt(i);
    return der;
  } catch (err) {
    console.error("Failed to decode base64 PEM in pemToDer:", err);
    throw err;
  }
}

async function getGoogleAccessToken(): Promise<string> {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;
  
  console.log("AUDIT - GOOGLE_SERVICE_ACCOUNT_EMAIL:", email);
  console.log("AUDIT - GOOGLE_PRIVATE_KEY exists:", !!rawKey);
  if (rawKey) {
    console.log("AUDIT - GOOGLE_PRIVATE_KEY raw prefix:", rawKey.substring(0, 40));
  }

  if (!email || !rawKey) {
    throw new Error("Google service account credentials are not configured.");
  }

  // Clean the PEM key
  const privateKeyPem = rawKey.replace(/^"|"$/g, "").replace(/\\n/g, "\n");
  console.log("AUDIT - privateKeyPem starts with RSA?", privateKeyPem.includes("BEGIN RSA PRIVATE KEY"));
  console.log("AUDIT - privateKeyPem starts with standard PRIVATE KEY?", privateKeyPem.includes("BEGIN PRIVATE KEY"));

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
  console.log("AUDIT - JWT signingInput:", signingInput);

  let der: Uint8Array;
  try {
    der = pemToDer(privateKeyPem);
    console.log("AUDIT - DER byte length:", der.byteLength);
  } catch (err) {
    console.error("AUDIT - Failed to convert PEM to DER:", err);
    throw err;
  }

  let cryptoKey: CryptoKey;
  try {
    cryptoKey = await crypto.subtle.importKey(
      "pkcs8",
      der.buffer.slice(der.byteOffset, der.byteOffset + der.byteLength) as ArrayBuffer,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["sign"],
    );
    console.log("AUDIT - CryptoKey imported successfully");
  } catch (err) {
    console.error("AUDIT - CryptoKey import failed (crypto.subtle.importKey):", err);
    throw err;
  }

  let signature: ArrayBuffer;
  try {
    signature = await crypto.subtle.sign(
      "RSASSA-PKCS1-v1_5",
      cryptoKey,
      new TextEncoder().encode(signingInput),
    );
    console.log("AUDIT - Signature generated successfully");
  } catch (err) {
    console.error("AUDIT - Signing failed:", err);
    throw err;
  }

  const jwt = `${signingInput}.${base64url(signature)}`;
  console.log("AUDIT - JWT created: length =", jwt.length);

  console.log("AUDIT - Fetching Google token...");
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`AUDIT - Google token exchange response error: ${res.status} ${text}`);
    throw new Error(`Google token exchange failed: ${res.status} ${text}`);
  }

  const json = (await res.json()) as { access_token?: string };
  if (!json.access_token) {
    console.error("AUDIT - Google token response missing access_token", json);
    throw new Error("Google token response missing access_token");
  }

  console.log("AUDIT - Google token exchange response success, access token obtained.");
  return json.access_token;
}

export const syncToSheets = createServerFn({ method: "POST" })
  .validator(ApplicationSchema)
  .handler(async ({ data }) => {
    console.log("AUDIT - syncToSheets starting");
    console.log("AUDIT - GOOGLE_SERVICE_ACCOUNT_EMAIL:", process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
    const sheetId = process.env.GOOGLE_SHEET_ID;
    console.log("AUDIT - GOOGLE_SHEET_ID:", sheetId);
    console.log("AUDIT - Form Data:", data);

    if (!sheetId) throw new Error("GOOGLE_SHEET_ID is not configured.");

    let token: string;
    try {
      token = await getGoogleAccessToken();
    } catch (err) {
      console.error("AUDIT - getGoogleAccessToken failed:", err);
      throw err;
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
    console.log("AUDIT - Access Token received:", token.substring(0, 15) + "...");
    console.log("AUDIT - Target spreadsheet ID:", sheetId);
    console.log("AUDIT - Target range:", range);

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?valueInputOption=USER_ENTERED`;
    console.log("AUDIT - Appending to Sheets: URL =", url);

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values: [row] }),
    });

    console.log("AUDIT - Sheets API response status:", res.status);
    if (!res.ok) {
      const text = await res.text();
      console.error(`AUDIT - Sheets append response error: ${res.status} ${text}`);
      throw new Error(`Sheets append failed: ${res.status} ${text}`);
    }

    const resJson = await res.json();
    console.log("AUDIT - Sheets append response success:", resJson);

    return { ok: true };
  });

