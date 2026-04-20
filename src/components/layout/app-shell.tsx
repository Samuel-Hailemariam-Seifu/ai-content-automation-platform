import Link from "next/link";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/scheduler", label: "Scheduler" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-zinc-950/75 backdrop-blur-xl supports-[backdrop-filter]:bg-zinc-950/65">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-x-3 gap-y-2 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:h-[3.25rem] sm:flex-nowrap sm:gap-y-0 sm:px-6 sm:py-0">
          <Link
            href="/dashboard"
            className="min-h-10 min-w-0 shrink-0 text-[15px] font-medium tracking-[-0.02em] text-zinc-100"
          >
            Content<span className="text-indigo-400/95">Flow</span>
          </Link>
          <nav className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-x-0.5 gap-y-1 sm:flex-none sm:justify-end">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="touch-manipulation rounded-md px-3 py-2 text-[13px] font-medium text-zinc-500 transition-colors hover:bg-white/[0.04] hover:text-zinc-200 sm:py-1.5"
              >
                {l.label}
              </Link>
            ))}
            <form action="/auth/signout" method="post" className="ml-0 sm:ml-1">
              <button
                type="submit"
                className="touch-manipulation rounded-md px-3 py-2 text-[13px] font-medium text-zinc-600 transition-colors hover:bg-white/[0.04] hover:text-zinc-400 sm:py-1.5"
              >
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full min-w-0 max-w-3xl flex-1 px-4 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-12">
        {children}
      </main>
    </div>
  );
}
