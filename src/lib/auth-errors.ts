/**
 * Maps Supabase auth errors to actionable copy for toasts.
 */
export function formatAuthError(err: unknown): string {
  if (err && typeof err === "object") {
    const o = err as { message?: string; status?: number };
    const msg = (o.message ?? "").toString();

    if (/invalid api key/i.test(msg)) {
      return (
        "Invalid API key: set NEXT_PUBLIC_SUPABASE_ANON_KEY to the anon public key in Supabase → Project Settings → API. " +
        "Do not use the service_role secret. Restart next dev after changing .env.local."
      );
    }

    if (msg) {
      return msg;
    }
  }

  if (err instanceof Error) {
    if (err.message === "Failed to fetch") {
      return (
        "Could not reach Supabase. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local, " +
        "confirm the project is not paused, then restart the dev server."
      );
    }
    return err.message;
  }

  return "Something went wrong. Please try again.";
}
