"use client";

import { useState } from "react";

type Tab = { id: string; label: string; content: React.ReactNode };

export function Tabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(tabs[0]?.id ?? "");

  return (
    <div>
      <div
        className="flex gap-6 border-b border-white/[0.06] sm:gap-10"
        role="tablist"
      >
        {tabs.map((t) => {
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(t.id)}
              className={`-mb-px border-b-2 px-1 pb-3 text-[13px] font-medium transition-colors sm:px-2 ${
                isActive
                  ? "border-indigo-500 text-zinc-100"
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      <div className="pt-8" role="tabpanel">
        {tabs.find((t) => t.id === active)?.content}
      </div>
    </div>
  );
}
