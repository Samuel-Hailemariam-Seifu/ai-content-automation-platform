"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { useAsyncFn } from "@/hooks/use-async-fn";

export default function DashboardPage() {
  const router = useRouter();
  const [text, setText] = useState("");

  const generate = useCallback(
    async (inputText: string) => {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputText }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Generation failed");
      }
      toast.success("Campaign generated");
      router.push(`/results/${data.id as string}`);
      router.refresh();
    },
    [router],
  );

  const { run, loading } = useAsyncFn(generate);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const inputText = text.trim();
    if (!inputText) {
      toast.error("Add some content or an idea first.");
      return;
    }
    try {
      await run(inputText);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Something went wrong",
      );
    }
  }

  return (
    <AppShell>
      <div className="space-y-10">
        <header className="space-y-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">
            Create
          </p>
          <h1 className="text-xl font-medium tracking-tight text-zinc-50 sm:text-2xl">
            New campaign
          </h1>
          <p className="max-w-lg text-[15px] leading-relaxed text-zinc-500">
            Paste a rough idea or draft. We&apos;ll generate a blog post, X
            thread, and LinkedIn post.
          </p>
        </header>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-zinc-950/40 shadow-sm shadow-black/20">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your content or idea..."
              rows={10}
              disabled={loading}
              className="min-h-[200px] w-full resize-y bg-transparent px-3 py-3 text-base leading-[1.65] text-zinc-100 placeholder:text-zinc-600 outline-none disabled:opacity-50 sm:min-h-[220px] sm:px-4 sm:py-4 sm:text-[15px]"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex min-h-11 touch-manipulation items-center justify-center rounded-lg bg-indigo-500 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-45 sm:min-h-0 sm:w-auto sm:py-2.5"
            >
              {loading ? (
                <span className="flex items-center gap-2.5">
                  <span
                    className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/25 border-t-white"
                    aria-hidden
                  />
                  AI is generating…
                </span>
              ) : (
                "Generate campaign"
              )}
            </button>
            {loading && (
              <span className="text-[13px] leading-snug text-zinc-500 sm:max-w-[14rem]">
                Free tier can take up to a minute.
              </span>
            )}
          </div>
        </form>
      </div>
    </AppShell>
  );
}
