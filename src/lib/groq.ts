import { getGroqApiKey } from "@/lib/env";

/**
 * Groq exposes an OpenAI-compatible chat completions endpoint.
 * @see https://console.groq.com/docs/api-reference#chat-create
 */
const DEFAULT_CHAT_COMPLETIONS_URL =
  "https://api.groq.com/openai/v1/chat/completions";

/** Override with `GROQ_MODEL` if needed. @see https://console.groq.com/docs/models */
const DEFAULT_MODEL = "llama-3.3-70b-versatile";

function trim(v: string | undefined): string | undefined {
  const t = v?.trim();
  return t || undefined;
}

function getChatCompletionsUrl(): string {
  return trim(process.env.GROQ_CHAT_COMPLETIONS_URL) ?? DEFAULT_CHAT_COMPLETIONS_URL;
}

function resolveModelId(): string {
  return trim(process.env.GROQ_MODEL) ?? DEFAULT_MODEL;
}

type ChatCompletionResponse = {
  choices?: Array<{ message?: { content?: string | null } }>;
  error?: { message?: string };
};

export async function runInference(prompt: string): Promise<string> {
  const res = await fetch(getChatCompletionsUrl(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getGroqApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: resolveModelId(),
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2048,
      temperature: 0.35,
    }),
  });

  const rawText = await res.text();

  if (!res.ok) {
    let hint = "";
    try {
      const j = JSON.parse(rawText) as {
        error?: { message?: string; code?: string };
      };
      if (j.error?.code === "model_decommissioned") {
        hint =
          " Set GROQ_MODEL to a currently supported model — see https://console.groq.com/docs/models.";
      }
    } catch {
      /* ignore */
    }
    throw new Error(
      `Groq API error (${res.status}): ${rawText.slice(0, 500)}${hint}`,
    );
  }

  let data: ChatCompletionResponse;
  try {
    data = JSON.parse(rawText) as ChatCompletionResponse;
  } catch {
    throw new Error("Groq returned non-JSON response");
  }

  if (data.error?.message) {
    throw new Error(`Groq: ${data.error.message}`);
  }

  const content = data.choices?.[0]?.message?.content;
  if (typeof content === "string" && content.trim()) {
    return content;
  }

  throw new Error("Unexpected Groq chat response (no message content)");
}
