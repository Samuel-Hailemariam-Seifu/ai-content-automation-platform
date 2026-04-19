function trim(v: string | undefined): string | undefined {
  const t = v?.trim();
  return t || undefined;
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

  return resolved;
}

export function getHuggingFaceApiKey(): string {
  const key = trim(process.env.HUGGINGFACE_API_KEY);
  if (!key) {
    throw new Error("Missing HUGGINGFACE_API_KEY");
  }
  return key;
}

export const HUGGINGFACE_MODEL =
  process.env.HUGGINGFACE_MODEL ??
  "mistralai/Mistral-7B-Instruct-v0.2";
