"use client";

import { CopyButton } from "@/components/ui/copy-button";
import { Tabs } from "@/components/ui/tabs";

const blog = `Dark Mode Is Here — And It Was Worth the Wait

After months of user requests (and a few strongly-worded support tickets), dark mode has landed. It's not a color-inversion hack — every component was rebuilt with contrast and readability in mind, from data tables to toast notifications.

Here's what changed, why it took longer than a weekend project, and how to switch it on.`;

const tweets = [
  "Shipped: dark mode. No inverted-filter tricks — every component redesigned from scratch for contrast and readability.",
  "Biggest lesson? Dark mode isn't a color swap. Shadows, borders, and image overlays all needed separate treatment.",
  "Toggle it in Settings → Appearance. Would love to hear what you think 👇",
];

const linkedin = `We just rolled out dark mode after months of user feedback. It's a small feature with an outsized impact on how people use the product late at night — and a reminder that the details users ask for loudest are often worth prioritizing.

Curious how other teams decide what to build next: requests, data, or gut feel?`;

export function LandingPreview() {
  const tabs = [
    {
      id: "blog",
      label: "Blog",
      content: (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <CopyButton text={blog} />
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-zinc-950/35 px-3 py-4 sm:px-5 sm:py-6">
            <div className="whitespace-pre-wrap text-[14px] leading-[1.7] text-zinc-300 sm:text-[15px]">
              {blog}
            </div>
          </div>
        </section>
      ),
    },
    {
      id: "tweets",
      label: "X Thread",
      content: (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <CopyButton
              text={tweets.map((t, i) => `${i + 1}. ${t}`).join("\n\n")}
            />
          </div>
          <ol className="space-y-3">
            {tweets.map((t, i) => (
              <li
                key={i}
                className="flex gap-3 rounded-xl border border-white/[0.05] bg-zinc-950/30 px-3 py-3"
              >
                <span className="w-5 shrink-0 pt-0.5 text-right font-mono text-[11px] tabular-nums text-zinc-600">
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1 text-[14px] leading-relaxed text-zinc-300 sm:text-[15px]">
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
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <CopyButton text={linkedin} />
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-zinc-950/35 px-3 py-4 sm:px-5 sm:py-6">
            <p className="whitespace-pre-wrap text-[14px] leading-[1.7] text-zinc-300 sm:text-[15px]">
              {linkedin}
            </p>
          </div>
        </section>
      ),
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-950/50 shadow-2xl shadow-black/40">
      <div className="flex items-center gap-1.5 border-b border-white/[0.06] bg-white/[0.02] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
        <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
        <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
        <span className="ml-2 truncate text-[11px] text-zinc-600">
          Generated campaign — one brief in, three formats out
        </span>
      </div>
      <div className="px-4 pb-6 pt-5 sm:px-6 sm:pb-8">
        <Tabs tabs={tabs} />
      </div>
    </div>
  );
}
