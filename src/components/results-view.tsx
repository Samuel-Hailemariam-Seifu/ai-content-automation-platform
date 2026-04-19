"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ContentChat } from "@/components/content-chat";
import { ScheduleModal } from "@/components/schedule-modal";
import { CopyButton } from "@/components/ui/copy-button";
import { Tabs } from "@/components/ui/tabs";
import type { ContentRow } from "@/types/database";

type Props = { initial: ContentRow };

const btnSecondary =
  "rounded-md border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[12px] font-medium text-zinc-400 transition-colors hover:border-white/[0.12] hover:bg-white/[0.05] hover:text-zinc-200 disabled:opacity-45";

export function ResultsView({ initial }: Props) {
  const router = useRouter();
  const [row, setRow] = useState(initial);
  const [regen, setRegen] = useState<"blog" | "tweets" | "linkedin" | null>(
    null,
  );
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const blog = row.blog_output ?? "";
  const tweets = Array.isArray(row.tweets_output)
    ? (row.tweets_output as string[])
    : [];
  const linkedin = row.linkedin_output ?? "";

  async function regenerate(type: "blog" | "tweets" | "linkedin") {
    setRegen(type);
    try {
      const res = await fetch("/api/regenerate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentId: row.id, type }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Regenerate failed");
      }
      setRow((r) => ({
        ...r,
        blog_output: (data.blog as string) ?? r.blog_output,
        tweets_output: (data.tweets as string[]) ?? r.tweets_output,
        linkedin_output: (data.linkedin as string) ?? r.linkedin_output,
      }));
      toast.success(
        type === "blog"
          ? "Blog updated"
          : type === "tweets"
            ? "Thread updated"
            : "LinkedIn updated",
      );
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Regenerate failed");
    } finally {
      setRegen(null);
    }
  }

  const tabs = [
    {
      id: "blog",
      label: "Blog",
      content: (
        <section className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <CopyButton text={blog} />
            <button
              type="button"
              disabled={regen === "blog"}
              onClick={() => regenerate("blog")}
              className={btnSecondary}
            >
              {regen === "blog" ? "Regenerating…" : "Regenerate"}
            </button>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-zinc-950/35 px-5 py-6">
            <div className="whitespace-pre-wrap text-[15px] leading-[1.7] text-zinc-300">
              {blog}
            </div>
          </div>
        </section>
      ),
    },
    {
      id: "tweets",
      label: "Tweets",
      content: (
        <section className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <CopyButton
              text={tweets.map((t, i) => `${i + 1}. ${t}`).join("\n\n")}
            />
            <button
              type="button"
              disabled={regen === "tweets"}
              onClick={() => regenerate("tweets")}
              className={btnSecondary}
            >
              {regen === "tweets" ? "Regenerating…" : "Regenerate"}
            </button>
          </div>
          <ol className="space-y-3">
            {tweets.map((t, i) => (
              <li
                key={i}
                className="flex gap-4 rounded-xl border border-white/[0.05] bg-zinc-950/30 px-4 py-4"
              >
                <span className="w-5 shrink-0 pt-0.5 text-right font-mono text-[11px] tabular-nums text-zinc-600">
                  {i + 1}
                </span>
                <span className="flex-1 text-[15px] leading-relaxed text-zinc-300">
                  {t}
                </span>
              </li>
            ))}
          </ol>
        </section>
      ),
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      content: (
        <section className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <CopyButton text={linkedin} />
            <button
              type="button"
              disabled={regen === "linkedin"}
              onClick={() => regenerate("linkedin")}
              className={btnSecondary}
            >
              {regen === "linkedin" ? "Regenerating…" : "Regenerate"}
            </button>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-zinc-950/35 px-5 py-6">
            <p className="whitespace-pre-wrap text-[15px] leading-[1.7] text-zinc-300">
              {linkedin}
            </p>
          </div>
        </section>
      ),
    },
  ];

  return (
    <>
      <div className="space-y-10">
        <header className="flex flex-col gap-6 border-b border-white/[0.06] pb-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-2">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">
              Campaign
            </p>
            <h1 className="text-xl font-medium tracking-tight text-zinc-50">
              Generated content
            </h1>
            <p className="line-clamp-3 text-[14px] leading-relaxed text-zinc-500">
              {row.input_text}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setScheduleOpen(true)}
            className="shrink-0 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-[13px] font-medium text-zinc-300 transition-colors hover:border-white/[0.12] hover:bg-white/[0.06] hover:text-zinc-100"
          >
            Schedule post
          </button>
        </header>

        <Tabs tabs={tabs} />

        <ContentChat contentId={row.id} />
      </div>

      <ScheduleModal
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        contentId={row.id}
      />
    </>
  );
}
