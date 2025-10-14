const DEFAULT_MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type FlashcardSummary = {
  front: string;
  back: string;
  hint?: string;
};

type SourceSummary = {
  type: "link" | "pdf" | "text";
  value: string;
};

function assertApiKey(): string {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
  return apiKey;
}

async function callOpenAI(messages: ChatMessage[], temperature = 0.2) {
  const apiKey = assertApiKey();

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      temperature,
      messages,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI request failed: ${response.status} ${errorText}`);
  }

  const data = (await response.json()) as {
    choices: Array<{ message: { content: string } }>;
  };

  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI response did not include content");
  }

  return content.trim();
}

function extractJsonObject(text: string) {
  const jsonFence = text.match(/```json([\s\S]*?)```/i);
  const candidate = jsonFence ? jsonFence[1] : text;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1) {
    throw new Error("Unable to locate JSON payload in AI response");
  }

  const jsonText = candidate.slice(start, end + 1).trim();
  return JSON.parse(jsonText);
}

export async function generateFlashcardsFromSources({
  topic,
  sources,
  deckName,
  limit = 8,
}: {
  topic?: string;
  sources: SourceSummary[];
  deckName?: string;
  limit?: number;
}): Promise<FlashcardSummary[]> {
  const preparedSources = sources
    .map((source, index) => `${index + 1}. (${source.type}) ${source.value}`)
    .join("\n");

  const messages: ChatMessage[] = [
    {
      role: "system",
      content:
        "You are an expert study coach who crafts concise flashcards. Use only the supplied topic and sources. Return strictly JSON.",
    },
    {
      role: "user",
      content: [
        deckName ? `Deck name: ${deckName}` : null,
        topic ? `Focus topic: ${topic}` : null,
        preparedSources ? `Supporting sources:\n${preparedSources}` : null,
        `Generate up to ${limit} flashcards covering the essential points. Respond as JSON with the shape {"cards":[{"front":"","back":"","hint":"optional"}]}.`,
      ]
        .filter(Boolean)
        .join("\n\n"),
    },
  ];

  const completion = await callOpenAI(messages, 0.1);
  const parsed = extractJsonObject(completion) as { cards?: FlashcardSummary[] };
  const cards = Array.isArray(parsed.cards) ? parsed.cards : [];

  return cards
    .filter((card) => card.front && card.back)
    .slice(0, limit)
    .map((card) => ({
      front: card.front.trim(),
      back: card.back.trim(),
      hint: card.hint?.trim() || undefined,
    }));
}

export async function answerDeckQuestion({
  deckName,
  cards,
  conversation,
}: {
  deckName?: string;
  cards: FlashcardSummary[];
  conversation: Array<{ role: "user" | "assistant"; content: string }>;
}): Promise<string> {
  const cardDigest = cards
    .map((card, index) => {
      const hintSegment = card.hint ? `\nHint: ${card.hint}` : "";
      return `Card ${index + 1}:\nFront: ${card.front}\nBack: ${card.back}${hintSegment}`;
    })
    .join("\n\n");

  const messages: ChatMessage[] = [
    {
      role: "system",
      content:
        "You are an AI study partner. Answer using only the provided flashcards. Summaries should be clear, cite card numbers when useful, and suggest mnemonic tips when appropriate.",
    },
    {
      role: "user",
      content: [deckName ? `Deck: ${deckName}` : null, cardDigest ? `Flashcards:\n${cardDigest}` : null]
        .filter(Boolean)
        .join("\n\n"),
    },
    ...conversation,
  ];

  const completion = await callOpenAI(messages, 0.2);
  return completion;
}
