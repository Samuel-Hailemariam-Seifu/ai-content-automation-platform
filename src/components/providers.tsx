"use client";

import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        richColors
        closeButton
        position="top-center"
        theme="dark"
        toastOptions={{
          classNames: {
            toast:
              "bg-zinc-950/95 border border-white/[0.08] text-zinc-100 shadow-lg shadow-black/30 backdrop-blur-md",
          },
        }}
      />
    </>
  );
}
