import { getHuggingFaceApiKey } from "@/lib/env";

/**
 * Legacy `api-inference.huggingface.co/models/...` is decommissioned.
 * Use the OpenAI-compatible Inference Providers router instead.
 * @see https://huggingface.co/docs/inference-providers/en/index
 */
const DEFAULT_CHAT_COMPLETIONS_URL =
  "https://router.huggingface.co/v1/chat/completions";

/**
 * Default chat model for the router. Mistral-7B is often unavailable depending on
 * which Inference Providers you enabled — Qwen2.5 7B is widely routed.
 * Override with `HUGGINGFACE_MODEL` if needed.
 */
const DEFAULT_MODEL = "Qwen/Qwen2.5-7B-Instruct";

function trim(v: string | undefined): string | undefined {
  const t = v?.trim();
  return t || undefined;
}

function getChatCompletionsUrl(): string {
  return (
    trim(process.env.HUGGINGFACE_CHAT_COMPLETIONS_URL) ??
    DEFAULT_CHAT_COMPLETIONS_URL
  );
}

/**
 * Router expects `namespace/model:provider_or_policy`.
 * If you set `HUGGINGFACE_MODEL` without `:`, we append `:fastest`.
 */
function resolveModelId(): string {
  const raw = trim(process.env.HUGGINGFACE_MODEL) ?? DEFAULT_MODEL;
  if (raw.includes(":")) {
    return raw;
  }
  return `${raw}:fastest`;
}

type ChatCompletionResponse = {
  choices?: Array<{ message?: { content?: string | null } }>;
  error?: { message?: string };
};

export async function runInference(prompt: string): Promise<string> {
  const res = await fetch(getChatCompletionsUrl(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getHuggingFaceApiKey()}`,
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
      if (j.error?.code === "model_not_supported") {
        hint =
          " Open https://huggingface.co/settings/inference-providers and enable providers, or set HUGGINGFACE_MODEL to a model that matches an enabled provider (e.g. Qwen/Qwen2.5-7B-Instruct:fastest).";
      }
    } catch {
      /* ignore */
    }
    throw new Error(
      `Hugging Face API error (${res.status}): ${rawText.slice(0, 500)}${hint}`,
    );
  }

  let data: ChatCompletionResponse;
  try {
    data = JSON.parse(rawText) as ChatCompletionResponse;
  } catch {
    throw new Error("Hugging Face returned non-JSON response");
  }

  if (data.error?.message) {
    throw new Error(`Hugging Face: ${data.error.message}`);
  }

  const content = data.choices?.[0]?.message?.content;
  if (typeof content === "string" && content.trim()) {
    return content;
  }

  throw new Error("Unexpected Hugging Face chat response (no message content)");
}
