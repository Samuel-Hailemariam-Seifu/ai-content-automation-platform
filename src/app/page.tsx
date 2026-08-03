import Link from "next/link";
import { LandingPreview } from "@/components/landing-preview";

const steps = [
  {
    n: "01",
    title: "Paste a brief",
    body: "Drop in a rough idea, a draft, or an outline. No formatting required.",
  },
  {
    n: "02",
    title: "AI drafts three formats",
    body: "Groq-powered generation turns it into a blog post, an X thread, and a LinkedIn post in one pass.",
  },
  {
    n: "03",
    title: "Refine, then schedule",
    body: "Chat to tweak tone or details, then simulate a posting schedule for each platform.",
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-zinc-950/90 backdrop-blur-xl pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex h-[3.25rem] max-w-3xl items-center justify-between gap-2 px-4 sm:px-6">
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

      <main className="mx-auto w-full min-w-0 max-w-3xl flex-1 border-t border-white/[0.06] px-4 pb-[max(3rem,env(safe-area-inset-bottom))] pt-[calc(3.25rem+env(safe-area-inset-top)+2.5rem)] sm:px-6 sm:pb-24 sm:pt-[calc(3.25rem+env(safe-area-inset-top)+3.5rem)]">
        {/* Hero */}
        <section className="mx-auto flex max-w-xl flex-col items-center text-center">
          <span
            className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[12px] font-medium text-zinc-400"
            style={{ animationDelay: "0ms" }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-indigo-400" />
            </span>
            Groq-powered generation
          </span>

          <h1
            className="animate-fade-up mt-6 text-balance text-[1.75rem] font-medium leading-[1.15] tracking-tight text-zinc-50 sm:text-[2rem] md:text-4xl md:leading-[1.12]"
            style={{ animationDelay: "60ms" }}
          >
            One brief. Three formats.{" "}
            <span className="text-indigo-400/95">Ready to publish.</span>
          </h1>

          <p
            className="animate-fade-up mt-6 text-[15px] leading-relaxed text-zinc-500"
            style={{ animationDelay: "120ms" }}
          >
            Turn a rough idea into a blog post, an X thread, and LinkedIn
            copy—then refine it in chat and simulate scheduling, all from one
            dashboard.
          </p>

          <div
            className="animate-fade-up mt-10 flex w-full max-w-sm flex-col gap-3 self-center sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center"
            style={{ animationDelay: "180ms" }}
          >
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
        </section>

        {/* Live preview of the actual product UI */}
        <section
          className="animate-fade-up mt-16 sm:mt-20"
          style={{ animationDelay: "240ms" }}
        >
          <LandingPreview />
        </section>

        {/* How it works */}
        <section className="mt-20 sm:mt-28">
          <p className="text-center text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">
            How it works
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3 sm:gap-5">
            {steps.map((s, i) => (
              <div
                key={s.n}
                className="animate-fade-up rounded-xl border border-white/[0.06] bg-zinc-950/35 p-5 transition-colors duration-300 hover:border-white/[0.1] sm:p-6"
                style={{ animationDelay: `${300 + i * 80}ms` }}
              >
                <span className="font-mono text-[12px] tabular-nums text-indigo-400/80">
                  {s.n}
                </span>
                <h3 className="mt-3 text-[15px] font-medium tracking-tight text-zinc-100">
                  {s.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-zinc-500">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-20 border-t border-white/[0.06] pt-8 text-center sm:mt-28">
          <p className="text-[12px] leading-relaxed text-zinc-600">
            Built with Next.js, Supabase &amp; Groq. Scheduling is simulated—no
            social networks are connected.
          </p>
        </footer>
      </main>
    </div>
  );
}
