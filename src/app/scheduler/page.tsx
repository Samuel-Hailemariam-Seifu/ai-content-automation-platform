"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { ScheduleModal } from "@/components/schedule-modal";

type Embedded = {
  blog_output: string | null;
  tweets_output: string[] | null;
  linkedin_output: string | null;
  input_text: string | null;
};

type Row = {
  id: string;
  content_id: string;
  platform: string;
  scheduled_time: string;
  contents: Embedded | null;
};

function preview(platform: string, c: Embedded | null): string {
  if (!c) return "—";
  if (platform === "blog") {
    return (c.blog_output ?? c.input_text ?? "").slice(0, 120);
  }
  if (platform === "twitter") {
    const t = c.tweets_output;
    if (Array.isArray(t) && t[0]) {
      return t[0].slice(0, 120);
    }
    return (c.input_text ?? "").slice(0, 120);
  }
  return (c.linkedin_output ?? c.input_text ?? "").slice(0, 120);
}

export default function SchedulerPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/schedule");
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Failed to load");
      }
      setItems((data.items as Row[]) ?? []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void load();
    });
  }, [load]);

  return (
    <AppShell>
      <div className="space-y-10">
        <header className="flex flex-col gap-6 border-b border-white/[0.06] pb-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">
              Plan
            </p>
            <h1 className="text-xl font-medium tracking-tight text-zinc-50">
              Scheduler
            </h1>
            <p className="max-w-md text-[14px] leading-relaxed text-zinc-500">
              Simulated posts only—nothing is published automatically.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setScheduleOpen(true)}
            className="shrink-0 rounded-lg bg-indigo-500 px-3.5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-indigo-400"
          >
            Schedule post
          </button>
        </header>

        {loading ? (
          <div className="h-36 animate-shimmer rounded-xl" />
        ) : items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/[0.08] bg-zinc-950/30 px-6 py-20 text-center">
            <p className="text-[14px] leading-relaxed text-zinc-500">
              No scheduled posts yet. Generate a campaign, then schedule from
              the results page or here.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {items.map((row) => {
              const emb = row.contents;
              const plat =
                row.platform === "twitter"
                  ? "Twitter / X"
                  : row.platform === "linkedin"
                    ? "LinkedIn"
                    : "Blog";
              return (
                <li
                  key={row.id}
                  className="rounded-xl border border-white/[0.06] bg-zinc-950/35 px-5 py-5"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500">
                      {plat}
                    </span>
                    <time
                      dateTime={row.scheduled_time}
                      className="text-[12px] tabular-nums text-zinc-600"
                    >
                      {new Date(row.scheduled_time).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </time>
                  </div>
                  <p className="mt-3 text-[14px] leading-relaxed text-zinc-400">
                    {(() => {
                      const p = preview(row.platform, emb ?? null);
                      return p.length >= 120 ? `${p.slice(0, 120)}…` : p;
                    })()}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <ScheduleModal
        open={scheduleOpen}
        onClose={() => {
          setScheduleOpen(false);
          void load();
        }}
        contentId={null}
      />
    </AppShell>
  );
}
