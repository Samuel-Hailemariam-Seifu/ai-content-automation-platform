function trim(v: string | undefined): string | undefined {
  const t = v?.trim();
  return t || undefined;
}

/** Decode JWT payload (no signature verify) — used only for dev diagnostics. */
function decodeJwtPayload(token: string): { role?: string } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    let base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4;
    if (pad) base64 += "=".repeat(4 - pad);
    const json: unknown = JSON.parse(atob(base64));
    if (json && typeof json === "object") {
      return json as { role?: string };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * In dev, warn if the "anon" slot actually contains the service_role secret
 * (common cause of 401 Invalid API key on /auth/v1/*).
 */
function warnIfAnonKeyLooksWrong(key: string) {
  if (typeof window === "undefined") return;
  if (process.env.NODE_ENV === "production") return;

  const payload = decodeJwtPayload(key);
  if (!payload) {
    console.warn(
      "[Supabase] NEXT_PUBLIC_SUPABASE_ANON_KEY should be a JWT with three dot-separated parts. Copy the full anon key from the dashboard.",
    );
    return;
  }
  if (payload.role === "service_role") {
    console.error(
      "[Supabase] NEXT_PUBLIC_SUPABASE_ANON_KEY is the service_role secret. Replace it with the anon public key (Project Settings → API → anon public). Never expose service_role to the browser.",
    );
  }
}

function assertValidHttpUrl(url: string, label: string): string {
  const normalized = url.replace(/\/+$/, "");
  try {
    const u = new URL(normalized);
    if (u.protocol !== "https:" && u.protocol !== "http:") {
      throw new Error();
    }
  } catch {
    throw new Error(
      `${label} must be a valid http(s) URL (e.g. https://xxxx.supabase.co). Got: ${url.slice(0, 80)}`,
    );
  }
  return normalized;
}

/**
 * In the browser, only `NEXT_PUBLIC_*` env vars exist. `SUPABASE_URL` alone
 * is not available to client bundles — that commonly causes `TypeError: Failed to fetch`.
 */
export function getSupabaseUrl(): string {
  const pub = trim(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const serverOnly = trim(process.env.SUPABASE_URL);
  const resolved =
    typeof window !== "undefined" ? pub : pub ?? serverOnly;

  if (!resolved) {
    const hint =
      typeof window !== "undefined"
        ? "Set NEXT_PUBLIC_SUPABASE_URL in .env.local (the anon URL from Supabase → Project Settings → API), then restart `next dev`. The name must start with NEXT_PUBLIC_."
        : "Set NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL.";
    throw new Error(`Missing Supabase URL. ${hint}`);
  }

  return assertValidHttpUrl(resolved, "NEXT_PUBLIC_SUPABASE_URL");
}

export function getSupabaseAnonKey(): string {
  const pub = trim(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const serverOnly = trim(process.env.SUPABASE_ANON_KEY);
  const resolved =
    typeof window !== "undefined" ? pub : pub ?? serverOnly;

  if (!resolved) {
    const hint =
      typeof window !== "undefined"
        ? "Set NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local (anon public key from Supabase → API), then restart `next dev`."
        : "Set NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_ANON_KEY.";
    throw new Error(`Missing Supabase anon key. ${hint}`);
  }

  warnIfAnonKeyLooksWrong(resolved);
  return resolved;
}

export function getGroqApiKey(): string {
  const key = trim(process.env.GROQ_API_KEY);
  if (!key) {
    throw new Error("Missing GROQ_API_KEY");
  }
  return key;
}
