"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

type Platform = "twitter" | "linkedin" | "blog";

type Campaign = { id: string; input_text: string };

const field =
  "mt-1.5 min-h-11 w-full rounded-lg border border-white/[0.08] bg-zinc-950/50 px-3 py-2 text-base text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 focus:border-indigo-500/35 focus:ring-1 focus:ring-indigo-500/25 sm:min-h-0 sm:text-[13px]";

const label = "text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500";

export function ScheduleModal({
  open,
  onClose,
  contentId,
}: {
  open: boolean;
  onClose: () => void;
  contentId: string | null;
}) {
  const [platform, setPlatform] = useState<Platform>("twitter");
  const [scheduledTime, setScheduledTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [pickedId, setPickedId] = useState("");

  useEffect(() => {
    if (!open) return;
    queueMicrotask(() => {
      const d = new Date();
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
      setScheduledTime(d.toISOString().slice(0, 16));
    });
  }, [open]);

  useEffect(() => {
    if (!open || contentId) return;
    let cancelled = false;
    queueMicrotask(() => {
      void (async () => {
        try {
          const res = await fetch("/api/contents");
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.error ?? "Failed to load campaigns");
          }
          const items = (data.items as Campaign[]) ?? [];
          if (cancelled) return;
          setCampaigns(items);
          setPickedId(items[0]?.id ?? "");
        } catch (e) {
          if (!cancelled) {
            toast.error(e instanceof Error ? e.message : "Failed to load");
          }
        }
      })();
    });
    return () => {
      cancelled = true;
    };
  }, [open, contentId]);

  if (!open) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const cid = contentId ?? pickedId;
    if (!cid) {
      toast.error("Generate a campaign first, or pick one below.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentId: cid,
          platform,
          scheduledTime: new Date(scheduledTime).toISOString(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Failed");
      }
      toast.success("Scheduled (demo only)");
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to schedule");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        className="relative max-h-[min(92dvh,calc(100dvh-env(safe-area-inset-bottom)-1rem))] w-full max-w-md overflow-y-auto rounded-t-2xl border border-white/[0.08] border-b-0 bg-zinc-950 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl shadow-black/40 sm:rounded-2xl sm:border-b sm:p-6 sm:pb-6"
        role="dialog"
        aria-modal="true"
      >
        <h2 className="text-lg font-medium tracking-tight text-zinc-50">
          Schedule post
        </h2>
        <p className="mt-1 text-[13px] leading-relaxed text-zinc-500">
          Demo scheduling only—nothing is published.
        </p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          {!contentId && (
            <div>
              <label className={label} htmlFor="campaign">
                Campaign
              </label>
              <select
                id="campaign"
                required
                value={pickedId}
                onChange={(e) => setPickedId(e.target.value)}
                className={field}
              >
                {campaigns.length === 0 ? (
                  <option value="">No campaigns yet</option>
                ) : (
                  campaigns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {(c.input_text ?? "").slice(0, 72)}
                      {(c.input_text?.length ?? 0) > 72 ? "…" : ""}
                    </option>
                  ))
                )}
              </select>
            </div>
          )}
          <div>
            <label className={label} htmlFor="platform">
              Platform
            </label>
            <select
              id="platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value as Platform)}
              className={field}
            >
              <option value="twitter">Twitter / X</option>
              <option value="linkedin">LinkedIn</option>
              <option value="blog">Blog</option>
            </select>
          </div>
          <div>
            <label className={label} htmlFor="when">
              Date & time
            </label>
            <input
              id="when"
              type="datetime-local"
              required
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className={field}
            />
          </div>
          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="min-h-11 touch-manipulation rounded-lg px-3 py-2 text-[13px] font-medium text-zinc-500 transition-colors hover:bg-white/[0.04] hover:text-zinc-300 sm:min-h-0"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || (!contentId && !pickedId)}
              className="min-h-11 touch-manipulation rounded-lg bg-indigo-500 px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-indigo-400 disabled:opacity-45 sm:min-h-0"
            >
              {loading ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
