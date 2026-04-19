import type { CampaignJson } from "@/lib/parse-json-output";

export function buildCampaignPrompt(inputText: string): string {
  return `<s>[INST] You are a content marketing assistant. The user provides an idea or draft below.

Output ONLY a single JSON object (no markdown fences, no commentary) with exactly these keys:
- "blog": string, a blog post in Markdown using ## for section headings, at least 3 sections.
- "tweets": array of exactly 5 strings, each one tweet under 280 characters, conversational and punchy. Do not number them in the strings.
- "linkedin": string, one professional LinkedIn post, engaging but appropriate for work.

Base everything on the user's input.

User input:
---
${inputText.trim()}
---
[/INST]`;
}

export function buildRegeneratePrompt(
  type: keyof CampaignJson,
  inputText: string,
  previous: CampaignJson,
): string {
  const ctx = `Blog:\n${previous.blog}\n\nTweets:\n${previous.tweets.join("\n---\n")}\n\nLinkedIn:\n${previous.linkedin}`;

  if (type === "blog") {
    return `<s>[INST] Rewrite ONLY the blog post as Markdown with ## headings. Same topic as before, fresh wording. Original idea:\n${inputText}\n\nPrevious outputs for context:\n${ctx}\n\nRespond with ONLY the blog markdown text, no JSON. [/INST]`;
  }
  if (type === "tweets") {
    return `<s>[INST] Write exactly 5 new tweet strings for X/Twitter (under 280 chars each). Topic from:\n${inputText}\n\nContext:\n${ctx}\n\nRespond with ONLY valid JSON: {"tweets":["...","...","...","...","..."]} no other text. [/INST]`;
  }
  return `<s>[INST] Rewrite ONLY the LinkedIn post. Professional tone. Original idea:\n${inputText}\n\nContext:\n${ctx}\n\nRespond with ONLY the LinkedIn post text, no JSON. [/INST]`;
}

export function buildChatPrompt(
  campaign: CampaignJson,
  question: string,
): string {
  return `<s>[INST] You help the user understand and refine their campaign content.

Campaign:
Blog (markdown):
${campaign.blog}

Twitter thread:
${campaign.tweets.map((t, i) => `${i + 1}. ${t}`).join("\n")}

LinkedIn:
${campaign.linkedin}

User question:
${question}

Answer clearly and concisely. If suggesting edits, be specific. [/INST]`;
}
