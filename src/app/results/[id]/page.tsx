import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { ResultsView } from "@/components/results-view";
import { createClient } from "@/lib/supabase/server";
import type { ContentRow } from "@/types/database";

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contents")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    notFound();
  }

  return (
    <AppShell>
      <ResultsView initial={data as ContentRow} />
    </AppShell>
  );
}
