import Link from "next/link";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/scheduler", label: "Scheduler" },
];

/** Total height of fixed bar = safe-area + 3.25rem — keep in sync with header inner `h-[3.25rem]`. */
const MAIN_PT =
  "pt-[calc(3.25rem+env(safe-area-inset-top))]";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-zinc-950/90 backdrop-blur-xl supports-[backdrop-filter]:bg-zinc-950/80 pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex h-[3.25rem] max-w-3xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link
            href="/dashboard"
            className="min-h-10 shrink-0 text-[15px] font-medium tracking-[-0.02em] text-zinc-100"
          >
            Content<span className="text-indigo-400/95">Flow</span>
          </Link>
          <nav className="flex min-w-0 flex-1 items-center justify-end gap-0.5 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-1 [&::-webkit-scrollbar]:hidden">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="touch-manipulation shrink-0 rounded-md px-2.5 py-2 text-[13px] font-medium text-zinc-500 transition-colors hover:bg-white/[0.04] hover:text-zinc-200 sm:px-3 sm:py-1.5"
              >
                {l.label}
              </Link>
            ))}
            <form action="/auth/signout" method="post" className="shrink-0 sm:ml-1">
              <button
                type="submit"
                className="touch-manipulation rounded-md px-2.5 py-2 text-[13px] font-medium text-zinc-600 transition-colors hover:bg-white/[0.04] hover:text-zinc-400 sm:px-3 sm:py-1.5"
              >
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main
        className={`mx-auto w-full min-w-0 max-w-3xl flex-1 px-4 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-12 ${MAIN_PT}`}
      >
        {children}
      </main>
    </div>
  );
}
