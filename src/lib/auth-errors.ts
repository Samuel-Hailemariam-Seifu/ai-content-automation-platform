/**
 * Maps low-level network errors from Supabase auth to actionable copy.
 */
export function describeAuthNetworkError(err: unknown): string {
  if (!(err instanceof Error)) {
    return "Something went wrong. Please try again.";
  }

  const msg = err.message || "";

  if (msg === "Failed to fetch") {
    return (
      "Could not reach Supabase. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local, " +
      "confirm the project is not paused, then restart the dev server."
    );
  }

  return msg;
}
