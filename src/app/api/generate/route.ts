import { NextResponse } from "next/server";
import { runInference } from "@/lib/huggingface";
import { parseCampaignJson } from "@/lib/parse-json-output";
import { buildCampaignPrompt } from "@/lib/prompts";
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
    const inputText =
      typeof body.inputText === "string" ? body.inputText.trim() : "";

    if (!inputText) {
      return NextResponse.json(
        { error: "inputText is required" },
        { status: 400 },
      );
    }

    const raw = await runInference(buildCampaignPrompt(inputText));
    const campaign = parseCampaignJson(raw);

    const { data, error } = await supabase
      .from("contents")
      .insert({
        user_id: user.id,
        input_text: inputText,
        blog_output: campaign.blog,
        tweets_output: campaign.tweets,
        linkedin_output: campaign.linkedin,
      })
      .select("id")
      .single();

    if (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Failed to save content" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      id: data.id,
      blog: campaign.blog,
      tweets: campaign.tweets,
      linkedin: campaign.linkedin,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Generation failed";
    console.error(e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
