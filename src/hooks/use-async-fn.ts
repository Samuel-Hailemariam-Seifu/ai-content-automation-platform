"use client";

import { useCallback, useState } from "react";

/**
 * Wraps an async function with loading / error state for UI feedback.
 */
export function useAsyncFn<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(
    async (...args: TArgs) => {
      setLoading(true);
      setError(null);
      try {
        return await fn(...args);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Something went wrong";
        setError(msg);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [fn],
  );

  return { run, loading, error, clearError: () => setError(null) };
}
