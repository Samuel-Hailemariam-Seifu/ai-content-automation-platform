"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";
import { formatAuthError } from "@/lib/auth-errors";
import { createClient } from "@/lib/supabase/client";

const inputClass =
  "mt-1.5 min-h-11 w-full rounded-lg border border-white/[0.08] bg-zinc-950/50 px-3.5 py-2.5 text-base text-zinc-100 outline-none transition-colors focus:border-indigo-500/35 focus:ring-1 focus:ring-indigo-500/25 sm:min-h-0 sm:text-[13px]";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        throw error;
      }
      toast.success("Signed in");
      router.push(next.startsWith("/") ? next : "/dashboard");
      router.refresh();
    } catch (err) {
      toast.error(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm space-y-8">
      <div className="text-center">
        <Link
          href="/"
          className="text-[15px] font-medium tracking-[-0.02em] text-zinc-100"
        >
          Content<span className="text-indigo-400/95">Flow</span>
        </Link>
        <h1 className="mt-8 text-xl font-medium tracking-tight text-zinc-50">
          Sign in
        </h1>
        <p className="mt-2 text-[13px] text-zinc-500">
          Email and password to continue.
        </p>
      </div>
      <div className="rounded-2xl border border-white/[0.06] bg-zinc-950/40 p-6 shadow-sm shadow-black/20 sm:p-8">
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-2 min-h-11 w-full touch-manipulation rounded-lg bg-indigo-500 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-400 disabled:opacity-45"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
      <p className="text-center text-[13px] text-zinc-500">
        No account?{" "}
        <Link
          href="/signup"
          className="font-medium text-indigo-400/90 hover:text-indigo-300"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh w-full flex-col items-center justify-center border-t border-white/[0.06] px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[calc(env(safe-area-inset-top)+2rem)] sm:pt-[calc(env(safe-area-inset-top)+2.5rem)]">
      <Suspense
        fallback={
          <div className="h-44 w-full max-w-sm animate-shimmer rounded-2xl" />
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
