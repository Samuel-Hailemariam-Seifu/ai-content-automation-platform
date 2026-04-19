import {
  getHuggingFaceApiKey,
  HUGGINGFACE_MODEL,
} from "@/lib/env";

const HF_URL = `https://api-inference.huggingface.co/models/${HUGGINGFACE_MODEL}`;

export async function runInference(prompt: string): Promise<string> {
  const res = await fetch(HF_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getHuggingFaceApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_new_tokens: 2048,
        return_full_text: false,
      },
      options: {
        wait_for_model: true,
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(
      `Hugging Face API error (${res.status}): ${errText.slice(0, 500)}`,
    );
  }

  const data: unknown = await res.json();

  if (Array.isArray(data) && data[0]?.generated_text != null) {
    return String(data[0].generated_text);
  }

  if (
    data &&
    typeof data === "object" &&
    "generated_text" in data &&
    typeof (data as { generated_text: unknown }).generated_text === "string"
  ) {
    return (data as { generated_text: string }).generated_text;
  }

  if (typeof data === "string") {
    return data;
  }

  throw new Error("Unexpected Hugging Face response shape");
}
