import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh w-full flex-col items-center justify-center border-t border-white/[0.06] px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[calc(env(safe-area-inset-top)+2rem)] sm:pt-[calc(env(safe-area-inset-top)+2.5rem)]">
      <h1 className="text-lg font-medium text-zinc-100">Campaign not found</h1>
      <p className="mt-2 max-w-sm text-center text-[13px] text-zinc-500">
        It may have been removed or you don&apos;t have access.
      </p>
      <Link
        href="/dashboard"
        className="mt-8 text-[13px] font-medium text-indigo-400/90 hover:text-indigo-300"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
