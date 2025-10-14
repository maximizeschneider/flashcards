import { NextResponse } from "next/server";

import { generateFlashcardsFromSources } from "@/lib/ai/openai";

type SourceSummary = {
  type: "link" | "pdf" | "text";
  value: string;
};

type RequestBody = {
  topic?: string;
  sources?: SourceSummary[];
  deckName?: string;
};

export async function POST(request: Request, { params }: { params: { deckId: string } }) {
  const deckId = params.deckId;
  if (!deckId) {
    return NextResponse.json({ error: "Missing deck identifier" }, { status: 400 });
  }

  let body: RequestBody;
  try {
    body = (await request.json()) as RequestBody;
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const sources = Array.isArray(body.sources)
    ? body.sources.filter((source) => source && typeof source.value === "string")
    : [];

  if (!body.topic && sources.length === 0) {
    return NextResponse.json(
      { error: "Provide a topic or at least one source to generate flashcards." },
      { status: 400 },
    );
  }

  try {
    const cards = await generateFlashcardsFromSources({
      deckName: body.deckName,
      topic: body.topic,
      sources,
    });

    if (cards.length === 0) {
      return NextResponse.json({ cards: [], warning: "The AI could not extract any key facts from the supplied material." });
    }

    return NextResponse.json({ cards });
  } catch (error) {
    console.error("Flashcard generation failed", error);
    return NextResponse.json(
      {
        error: "Unable to generate flashcards",
      },
      { status: 500 },
    );
  }
}
