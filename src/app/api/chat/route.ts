import { NextResponse } from "next/server";
import { runInference } from "@/lib/groq";
import type { CampaignJson } from "@/lib/parse-json-output";
import { buildChatPrompt } from "@/lib/prompts";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const contentId =
      typeof body.contentId === "string" ? body.contentId : "";
    const message =
      typeof body.message === "string" ? body.message.trim() : "";

    if (!contentId || !message) {
      return NextResponse.json(
        { error: "contentId and message are required" },
        { status: 400 },
      );
    }

    const { data: row, error } = await supabase
      .from("contents")
      .select("*")
      .eq("id", contentId)
      .eq("user_id", user.id)
      .single();

    if (error || !row) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const campaign: CampaignJson = {
      blog: row.blog_output ?? "",
      tweets: Array.isArray(row.tweets_output)
        ? (row.tweets_output as string[])
        : [],
      linkedin: row.linkedin_output ?? "",
    };

    const answer = await runInference(buildChatPrompt(campaign, message));

    return NextResponse.json({ answer: answer.trim() });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Chat failed";
    console.error(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
