import Link from "next/link";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/scheduler", label: "Scheduler" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-zinc-950/75 backdrop-blur-xl">
        <div className="mx-auto flex h-[3.25rem] max-w-3xl items-center justify-between px-5 sm:px-6">
          <Link
            href="/dashboard"
            className="text-[15px] font-medium tracking-[-0.02em] text-zinc-100"
          >
            Content<span className="text-indigo-400/95">Flow</span>
          </Link>
          <nav className="flex items-center gap-0.5">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-md px-3 py-1.5 text-[13px] font-medium text-zinc-500 transition-colors hover:bg-white/[0.04] hover:text-zinc-200"
              >
                {l.label}
              </Link>
            ))}
            <form action="/auth/signout" method="post" className="ml-1">
              <button
                type="submit"
                className="rounded-md px-3 py-1.5 text-[13px] font-medium text-zinc-600 transition-colors hover:bg-white/[0.04] hover:text-zinc-400"
              >
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-10 sm:px-6 sm:py-12">
        {children}
      </main>
    </div>
  );
}
