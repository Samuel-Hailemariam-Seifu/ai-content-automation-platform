import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-white/[0.06] bg-zinc-950/75 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[3.25rem] max-w-3xl flex-wrap items-center justify-between gap-2 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:h-[3.25rem] sm:flex-nowrap sm:px-6 sm:py-0">
          <span className="text-[15px] font-medium tracking-[-0.02em] text-zinc-100">
            Content<span className="text-indigo-400/95">Flow</span>
          </span>
          <div className="flex flex-shrink-0 items-center gap-1">
            <Link
              href="/login"
              className="touch-manipulation rounded-md px-3 py-2 text-[13px] font-medium text-zinc-500 transition-colors hover:bg-white/[0.04] hover:text-zinc-200 sm:py-1.5"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="touch-manipulation rounded-md bg-indigo-500 px-3 py-2 text-[13px] font-medium text-white transition-colors hover:bg-indigo-400 sm:py-1.5"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto flex w-full min-w-0 max-w-lg flex-1 flex-col justify-center px-4 py-12 pb-[max(3rem,env(safe-area-inset-bottom))] text-center sm:px-6 sm:py-24">
        <h1 className="text-balance text-[1.75rem] font-medium leading-[1.15] tracking-tight text-zinc-50 sm:text-[2rem] md:text-4xl md:leading-[1.12]">
          One brief.{" "}
          <span className="text-indigo-400/95">Many formats.</span>
        </h1>
        <p className="mt-6 text-[15px] leading-relaxed text-zinc-500">
          Turn an idea into a blog post, an X thread, and LinkedIn copy—then
          refine it in chat and simulate scheduling.
        </p>
        <div className="mt-10 flex w-full max-w-sm flex-col gap-3 self-center sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center">
          <Link
            href="/signup"
            className="touch-manipulation rounded-lg bg-indigo-500 px-5 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-indigo-400 sm:py-2.5"
          >
            Create account
          </Link>
          <Link
            href="/login"
            className="touch-manipulation rounded-lg border border-white/[0.08] bg-white/[0.03] px-5 py-3 text-center text-sm font-medium text-zinc-300 transition-colors hover:border-white/[0.12] hover:bg-white/[0.06] hover:text-zinc-100 sm:py-2.5"
          >
            Sign in
          </Link>
        </div>
      </main>
    </div>
  );
}
