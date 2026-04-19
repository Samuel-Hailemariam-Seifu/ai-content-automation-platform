import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const PLATFORMS = ["twitter", "linkedin", "blog"] as const;

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
    const platform = typeof body.platform === "string" ? body.platform : "";
    const scheduledTime =
      typeof body.scheduledTime === "string" ? body.scheduledTime : "";

    if (!contentId || !scheduledTime) {
      return NextResponse.json(
        { error: "contentId and scheduledTime are required" },
        { status: 400 },
      );
    }

    if (!PLATFORMS.includes(platform as (typeof PLATFORMS)[number])) {
      return NextResponse.json({ error: "Invalid platform" }, { status: 400 });
    }

    const { data: row, error: fetchErr } = await supabase
      .from("contents")
      .select("id")
      .eq("id", contentId)
      .eq("user_id", user.id)
      .single();

    if (fetchErr || !row) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 });
    }

    const { data, error } = await supabase
      .from("scheduled_posts")
      .insert({
        content_id: contentId,
        platform,
        scheduled_time: scheduledTime,
      })
      .select("id")
      .single();

    if (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Failed to schedule" },
        { status: 500 },
      );
    }

    return NextResponse.json({ id: data.id });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Schedule failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: posts, error: postsErr } = await supabase
      .from("scheduled_posts")
      .select("id, content_id, platform, scheduled_time, created_at")
      .order("scheduled_time", { ascending: true });

    if (postsErr) {
      console.error(postsErr);
      return NextResponse.json(
        { error: "Failed to load schedules" },
        { status: 500 },
      );
    }

    const list = posts ?? [];
    const ids = [...new Set(list.map((p) => p.content_id))];
    let contentsById: Record<
      string,
      {
        blog_output: string | null;
        tweets_output: unknown;
        linkedin_output: string | null;
        input_text: string | null;
      }
    > = {};

    if (ids.length > 0) {
      const { data: contents, error: cErr } = await supabase
        .from("contents")
        .select(
          "id, blog_output, tweets_output, linkedin_output, input_text",
        )
        .in("id", ids);

      if (cErr) {
        console.error(cErr);
        return NextResponse.json(
          { error: "Failed to load content" },
          { status: 500 },
        );
      }

      contentsById = Object.fromEntries(
        (contents ?? []).map((c) => [c.id, c]),
      );
    }

    const items = list.map((p) => ({
      ...p,
      contents: contentsById[p.content_id] ?? null,
    }));

    return NextResponse.json({ items });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
