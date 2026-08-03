import { NextResponse } from "next/server";
import { runInference } from "@/lib/groq";
import type { CampaignJson } from "@/lib/parse-json-output";
import { buildRegeneratePrompt } from "@/lib/prompts";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function parseTweetsOnly(raw: string): string[] {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  const slice =
    start >= 0 && end > start ? raw.slice(start, end + 1) : raw.trim();
  const parsed = JSON.parse(slice) as { tweets?: unknown };
  if (!Array.isArray(parsed.tweets)) {
    throw new Error("Invalid tweets JSON");
  }
  const tweets = parsed.tweets.map((t) => String(t));
  while (tweets.length < 5) {
    tweets.push("...");
  }
  return tweets.slice(0, 5);
}

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
    const type = body.type as keyof CampaignJson;

    if (!contentId || !type) {
      return NextResponse.json(
        { error: "contentId and type are required" },
        { status: 400 },
      );
    }

    if (!["blog", "tweets", "linkedin"].includes(type)) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    const { data: row, error: fetchErr } = await supabase
      .from("contents")
      .select("*")
      .eq("id", contentId)
      .eq("user_id", user.id)
      .single();

    if (fetchErr || !row) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const previous: CampaignJson = {
      blog: row.blog_output ?? "",
      tweets: Array.isArray(row.tweets_output)
        ? (row.tweets_output as string[])
        : [],
      linkedin: row.linkedin_output ?? "",
    };

    const raw = await runInference(
      buildRegeneratePrompt(type, row.input_text, previous),
    );

    let update: Record<string, unknown> = {};

    if (type === "blog") {
      update = { blog_output: raw.trim() };
    } else if (type === "linkedin") {
      update = { linkedin_output: raw.trim() };
    } else {
      let tweets: string[];
      try {
        tweets = parseTweetsOnly(raw);
      } catch {
        tweets = previous.tweets.length ? previous.tweets : ["(Regeneration failed — try again)"];
      }
      update = { tweets_output: tweets };
    }

    const { error: upErr } = await supabase
      .from("contents")
      .update(update)
      .eq("id", contentId);

    if (upErr) {
      console.error(upErr);
      return NextResponse.json(
        { error: "Failed to update" },
        { status: 500 },
      );
    }

    const blogOut =
      type === "blog"
        ? String(update.blog_output ?? "")
        : previous.blog;
    const tweetsOut =
      type === "tweets"
        ? (update.tweets_output as string[])
        : previous.tweets;
    const linkedinOut =
      type === "linkedin"
        ? String(update.linkedin_output ?? "")
        : previous.linkedin;

    return NextResponse.json({
      type,
      blog: blogOut,
      tweets: tweetsOut,
      linkedin: linkedinOut,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Regenerate failed";
    console.error(e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
