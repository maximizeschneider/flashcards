import { NextResponse } from "next/server";

import { answerDeckQuestion } from "@/lib/ai/openai";

type ConversationMessage = {
  role: "user" | "assistant";
  content: string;
};

type CardSummary = {
  id?: string;
  front: string;
  back: string;
  hint?: string;
};

export async function POST(request: Request, { params }: { params: { deckId: string } }) {
  const deckId = params.deckId;
  if (!deckId) {
    return NextResponse.json({ error: "Missing deck identifier" }, { status: 400 });
  }

  let body: {
    deckName?: string;
    cards?: CardSummary[];
    conversation?: ConversationMessage[];
  };

  try {
    body = (await request.json()) as typeof body;
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const conversation = Array.isArray(body.conversation) ? body.conversation : [];
  const cards = Array.isArray(body.cards)
    ? body.cards.map((card) => ({ front: card.front, back: card.back, hint: card.hint }))
    : [];

  if (conversation.length === 0) {
    return NextResponse.json({ error: "Conversation history is required" }, { status: 400 });
  }

  try {
    const answer = await answerDeckQuestion({
      deckName: body.deckName,
      cards,
      conversation,
    });

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Deck assistant error", error);
    return NextResponse.json({ error: "Assistant unavailable" }, { status: 500 });
  }
}
