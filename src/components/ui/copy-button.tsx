"use client";

import { useState } from "react";
import { toast } from "sonner";

export function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      toast.success("Copied");
      setTimeout(() => setDone(false), 1800);
    } catch {
      toast.error("Could not copy");
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="min-h-9 touch-manipulation rounded-md border border-white/[0.08] bg-white/[0.03] px-2.5 py-2 text-[12px] font-medium text-zinc-400 transition-colors hover:border-white/[0.12] hover:bg-white/[0.05] hover:text-zinc-200 sm:min-h-0 sm:py-1"
    >
      {done ? "Copied" : "Copy"}
    </button>
  );
}
