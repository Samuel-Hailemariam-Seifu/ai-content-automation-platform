export type CampaignJson = {
  blog: string;
  tweets: string[];
  linkedin: string;
};

function stripCodeFences(text: string): string {
  const trimmed = text.trim();
  const jsonBlock = /^```(?:json)?\s*([\s\S]*?)```$/m.exec(trimmed);
  if (jsonBlock?.[1]) {
    return jsonBlock[1].trim();
  }
  return trimmed;
}

function extractJsonObject(text: string): string | null {
  const cleaned = stripCodeFences(text);
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    return null;
  }
  return cleaned.slice(start, end + 1);
}

export function parseCampaignJson(raw: string): CampaignJson {
  const slice = extractJsonObject(raw) ?? stripCodeFences(raw);
  let parsed: unknown;
  try {
    parsed = JSON.parse(slice);
  } catch {
    throw new Error("Model did not return valid JSON. Try again.");
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error("Invalid campaign payload");
  }

  const o = parsed as Record<string, unknown>;
  const blog = typeof o.blog === "string" ? o.blog : "";
  const linkedin = typeof o.linkedin === "string" ? o.linkedin : "";
  let tweets: string[] = [];

  if (Array.isArray(o.tweets)) {
    tweets = o.tweets.map((t) => String(t)).filter(Boolean);
  } else if (typeof o.tweets === "string") {
    tweets = [o.tweets];
  }

  if (tweets.length < 5) {
    const pad = 5 - tweets.length;
    for (let i = 0; i < pad; i++) {
      tweets.push(`(Tweet ${tweets.length + i + 1} — refine in editor)`);
    }
  } else if (tweets.length > 5) {
    tweets = tweets.slice(0, 5);
  }

  if (!blog || !linkedin) {
    throw new Error("Missing blog or linkedin in JSON");
  }

  return { blog, tweets, linkedin };
}
