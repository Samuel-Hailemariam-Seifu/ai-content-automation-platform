import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-white/[0.06] bg-zinc-950/75 backdrop-blur-xl">
        <div className="mx-auto flex h-[3.25rem] max-w-3xl items-center justify-between px-5 sm:px-6">
          <span className="text-[15px] font-medium tracking-[-0.02em] text-zinc-100">
            Content<span className="text-indigo-400/95">Flow</span>
          </span>
          <div className="flex items-center gap-1">
            <Link
              href="/login"
              className="rounded-md px-3 py-1.5 text-[13px] font-medium text-zinc-500 transition-colors hover:bg-white/[0.04] hover:text-zinc-200"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="rounded-md bg-indigo-500 px-3 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-indigo-400"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto flex max-w-lg flex-1 flex-col justify-center px-5 py-24 text-center sm:px-6">
        <h1 className="text-[2rem] font-medium leading-[1.15] tracking-tight text-zinc-50 sm:text-4xl sm:leading-[1.12]">
          One brief.{" "}
          <span className="text-indigo-400/95">Many formats.</span>
        </h1>
        <p className="mt-6 text-[15px] leading-relaxed text-zinc-500">
          Turn an idea into a blog post, an X thread, and LinkedIn copy—then
          refine it in chat and simulate scheduling.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href="/signup"
            className="rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-400"
          >
            Create account
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:border-white/[0.12] hover:bg-white/[0.06] hover:text-zinc-100"
          >
            Sign in
          </Link>
        </div>
      </main>
    </div>
  );
}
