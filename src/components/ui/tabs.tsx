"use client";

import { useState } from "react";

type Tab = { id: string; label: string; content: React.ReactNode };

export function Tabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(tabs[0]?.id ?? "");

  return (
    <div className="min-w-0">
      <div
        className="-mx-1 flex gap-1 overflow-x-auto overflow-y-hidden border-b border-white/[0.06] px-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:gap-6 sm:overflow-visible sm:px-0 md:gap-10 [&::-webkit-scrollbar]:hidden"
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
              className={`-mb-px shrink-0 touch-manipulation border-b-2 px-3 pb-3 text-[13px] font-medium transition-colors sm:px-2 ${
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
      <div className="min-w-0 pt-6 sm:pt-8" role="tabpanel">
        {tabs.find((t) => t.id === active)?.content}
      </div>
    </div>
  );
}
