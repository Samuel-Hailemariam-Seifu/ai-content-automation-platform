"use client";

import { useState } from "react";
import { toast } from "sonner";

export function ContentChat({ contentId }: { contentId: string }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; text: string }[]
  >([]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const q = message.trim();
    if (!q) return;
    setMessage("");
    setMessages((m) => [...m, { role: "user", text: q }]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentId, message: q }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Chat failed");
      }
      setMessages((m) => [
        ...m,
        { role: "assistant", text: data.answer as string },
      ]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Chat failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-4 border-t border-white/[0.06] pt-10">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">
          Ask
        </p>
        <h2 className="mt-1 text-sm font-medium text-zinc-200">
          Chat with this content
        </h2>
        <p className="mt-1 text-[13px] leading-relaxed text-zinc-500">
          Questions use your generated copy as context.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-zinc-950/40">
        <div className="max-h-52 space-y-4 overflow-y-auto px-4 py-4">
          {messages.length === 0 && (
            <p className="text-[13px] text-zinc-600">
              For example: shorten the LinkedIn hook, or list the main CTAs.
            </p>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={`text-[13px] leading-relaxed ${
                m.role === "user"
                  ? "text-zinc-200"
                  : "whitespace-pre-wrap text-zinc-400"
              }`}
            >
              <span className="block text-[10px] font-medium uppercase tracking-wider text-zinc-600">
                {m.role === "user" ? "You" : "Assistant"}
              </span>
              <span className="mt-1 block">{m.text}</span>
            </div>
          ))}
          {loading && (
            <p className="text-[13px] text-zinc-500">Thinking…</p>
          )}
        </div>

        <form
          onSubmit={send}
          className="flex flex-col gap-2 border-t border-white/[0.06] bg-zinc-950/60 p-3 sm:flex-row sm:items-stretch sm:gap-2"
        >
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask a question…"
            className="min-h-11 min-w-0 flex-1 rounded-lg border border-transparent bg-transparent px-3 py-2 text-base text-zinc-100 placeholder:text-zinc-600 outline-none focus-visible:ring-1 focus-visible:ring-indigo-500/40 sm:min-h-0 sm:text-[13px]"
          />
          <button
            type="submit"
            disabled={loading}
            className="min-h-11 shrink-0 touch-manipulation rounded-lg bg-indigo-500 px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-indigo-400 disabled:opacity-45 sm:min-h-0 sm:px-3.5"
          >
            Send
          </button>
        </form>
      </div>
    </section>
  );
}
