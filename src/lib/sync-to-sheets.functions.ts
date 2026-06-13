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

async function logAudit(message: string, isError = false) {
  const formatted = `[${new Date().toISOString()}] ${isError ? "ERROR" : "INFO"}: ${message}\n`;
  if (isError) {
    console.error(formatted.trim());
  } else {
    console.log(formatted.trim());
  }
  if (typeof window === "undefined") {
    try {
      const fs = await import("node:fs");
      const path = await import("node:path");
      const logPath = path.resolve("c:/Users/rajes/Downloads/kotak-insurance-careers", "sync-audit.log");
      fs.appendFileSync(logPath, formatted, "utf8");
    } catch (err) {
      // ignore
    }
  }
}

async function loadEnvIfNeeded() {
  if (typeof window === "undefined") {
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      try {
        const fs = await import("node:fs");
        const path = await import("node:path");
        const envPath = path.resolve("c:/Users/rajes/Downloads/kotak-insurance-careers", ".env");
        if (fs.existsSync(envPath)) {
          const content = fs.readFileSync(envPath, "utf8");
          content.split("\n").forEach((line) => {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith("#")) return;
            const eqIdx = trimmed.indexOf("=");
            if (eqIdx === -1) return;
            const key = trimmed.substring(0, eqIdx).trim();
            let val = trimmed.substring(eqIdx + 1).trim();
            if (val.startsWith('"') && val.endsWith('"')) {
              val = val.substring(1, val.length - 1);
            } else if (val.startsWith("'") && val.endsWith("'")) {
              val = val.substring(1, val.length - 1);
            }
            val = val.replace(/\\n/g, "\n");
            process.env[key] = val;
          });
          await logAudit("Loaded environment variables from .env file successfully.");
        } else {
          await logAudit(".env file not found at " + envPath, true);
        }
      } catch (err) {
        await logAudit("Error loading .env file: " + (err as Error).message, true);
      }
    }
  }
}

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

async function pemToDer(pem: string): Promise<Uint8Array> {
  const trimmed = pem.trim().replace(/^"|"$/g, "").trim();
  await logAudit("PEM begins with: " + trimmed.substring(0, 40));
  await logAudit("PEM ends with: " + trimmed.substring(trimmed.length - 40));

  const cleaned = trimmed
    .replace(/-----BEGIN [^-]+-----/g, "")
    .replace(/-----END [^-]+-----/g, "")
    .replace(/\s+/g, "");

  await logAudit("Cleaned base64 length: " + cleaned.length);
  try {
    const bin = atob(cleaned);
    const der = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) der[i] = bin.charCodeAt(i);
    return der;
  } catch (err) {
    await logAudit("Failed to decode base64 PEM in pemToDer: " + (err as Error).message, true);
    throw err;
  }
}

async function getGoogleAccessToken(): Promise<string> {
  await loadEnvIfNeeded();
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;
  
  await logAudit("AUDIT - GOOGLE_SERVICE_ACCOUNT_EMAIL: " + email);
  await logAudit("AUDIT - GOOGLE_PRIVATE_KEY exists: " + !!rawKey);
  if (rawKey) {
    await logAudit("AUDIT - GOOGLE_PRIVATE_KEY raw prefix: " + rawKey.substring(0, 40));
  }

  if (!email || !rawKey) {
    const errMsg = "Google service account credentials are not configured. EMAIL=" + email + ", KEY_EXISTS=" + !!rawKey;
    await logAudit(errMsg, true);
    throw new Error(errMsg);
  }

  const privateKeyPem = rawKey.replace(/^"|"$/g, "").replace(/\\n/g, "\n");
  await logAudit("AUDIT - privateKeyPem starts with RSA? " + privateKeyPem.includes("BEGIN RSA PRIVATE KEY"));
  await logAudit("AUDIT - privateKeyPem starts with standard PRIVATE KEY? " + privateKeyPem.includes("BEGIN PRIVATE KEY"));

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
  await logAudit("AUDIT - JWT signingInput: " + signingInput);

  let der: Uint8Array;
  try {
    der = await pemToDer(privateKeyPem);
    await logAudit("AUDIT - DER byte length: " + der.byteLength);
  } catch (err) {
    await logAudit("AUDIT - Failed to convert PEM to DER: " + (err as Error).message, true);
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
    await logAudit("AUDIT - CryptoKey imported successfully");
  } catch (err) {
    await logAudit("AUDIT - CryptoKey import failed (crypto.subtle.importKey): " + (err as Error).message, true);
    throw err;
  }

  let signature: ArrayBuffer;
  try {
    signature = await crypto.subtle.sign(
      "RSASSA-PKCS1-v1_5",
      cryptoKey,
      new TextEncoder().encode(signingInput),
    );
    await logAudit("AUDIT - Signature generated successfully");
  } catch (err) {
    await logAudit("AUDIT - Signing failed: " + (err as Error).message, true);
    throw err;
  }

  const jwt = `${signingInput}.${base64url(signature)}`;
  await logAudit("AUDIT - JWT created: length = " + jwt.length);

  await logAudit("AUDIT - Fetching Google token...");
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
  });

  if (!res.ok) {
    const text = await res.text();
    const errMsg = `Google token exchange response error: ${res.status} ${text}`;
    await logAudit(`AUDIT - ${errMsg}`, true);
    throw new Error(errMsg);
  }

  const json = (await res.json()) as { access_token?: string };
  if (!json.access_token) {
    const errMsg = "Google token response missing access_token";
    await logAudit(`AUDIT - ${errMsg}: ` + JSON.stringify(json), true);
    throw new Error(errMsg);
  }

  await logAudit("AUDIT - Google token exchange response success, access token obtained.");
  return json.access_token;
}

export const syncToSheets = createServerFn({ method: "POST" })
  .validator(ApplicationSchema)
  .handler(async ({ data }) => {
    await loadEnvIfNeeded();
    await logAudit("AUDIT - syncToSheets starting");
    await logAudit("AUDIT - GOOGLE_SERVICE_ACCOUNT_EMAIL: " + process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
    const sheetId = process.env.GOOGLE_SHEET_ID;
    await logAudit("AUDIT - GOOGLE_SHEET_ID: " + sheetId);
    await logAudit("AUDIT - Form Data: " + JSON.stringify(data));

    if (!sheetId) {
      const errMsg = "GOOGLE_SHEET_ID is not configured.";
      await logAudit(errMsg, true);
      throw new Error(errMsg);
    }

    let token: string;
    try {
      token = await getGoogleAccessToken();
    } catch (err) {
      await logAudit("AUDIT - getGoogleAccessToken failed: " + (err as Error).message, true);
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
    await logAudit("AUDIT - Access Token received: " + token.substring(0, 15) + "...");
    await logAudit("AUDIT - Target spreadsheet ID: " + sheetId);
    await logAudit("AUDIT - Target range: " + range);

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?valueInputOption=USER_ENTERED`;
    await logAudit("AUDIT - Appending to Sheets: URL = " + url);

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
    } catch (err) {
      const errMsg = "Network request to Google Sheets API failed: " + (err as Error).message;
      await logAudit(errMsg, true);
      throw new Error(errMsg);
    }

    await logAudit("AUDIT - Sheets API response status: " + res.status);
    if (!res.ok) {
      const text = await res.text();
      const errMsg = `Sheets append response error: ${res.status} ${text}`;
      await logAudit(`AUDIT - ${errMsg}`, true);
      throw new Error(errMsg);
    }

    const resJson = await res.json();
    await logAudit("AUDIT - Sheets append response success: " + JSON.stringify(resJson));

    return { ok: true };
  });

