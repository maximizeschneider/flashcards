"use client";

import { useCallback, useMemo, useState } from "react";

import { Flashcard } from "@/components/flashcards/flashcard-card";
import {
  AiChatContainer,
  AiInput,
  AiMessageBubble,
  AiMessageList,
} from "@/components/ai-elements/chat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type AssistantMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type FlashcardAssistantProps = {
  deckId: string;
  deckName?: string;
  cards: Flashcard[];
};

const INITIAL_MESSAGE: AssistantMessage = {
  id: "assistant-welcome",
  role: "assistant",
  content:
    "Hi there! Ask me anything about this deck and I’ll answer using the saved flashcards. Try questions like ‘How do I remember card 3?’ or ‘Explain the concept on the back of card 1.’",
};

export function FlashcardAssistant({ deckId, deckName, cards }: FlashcardAssistantProps) {
  const [messages, setMessages] = useState<AssistantMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const deckSummary = useMemo(
    () =>
      cards.map((card) => ({
        id: card._id,
        front: card.front,
        back: card.back,
        hint: card.hint,
      })),
    [cards],
  );

  const handleSubmit = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed) {
      return;
    }

    const userMessage: AssistantMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(`/api/decks/${deckId}/assistant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deckName,
          cards: deckSummary,
          conversation: [...messages, userMessage].map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to reach the assistant");
      }

      const data = (await response.json()) as { answer: string };

      const assistantMessage: AssistantMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.answer,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: AssistantMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          "I couldn’t generate a response right now. Double-check your API configuration or try asking again in a moment.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [deckId, deckName, deckSummary, input, messages]);

  function handleResetConversation() {
    setMessages([INITIAL_MESSAGE]);
  }

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle className="text-lg">Deck assistant</CardTitle>
        <button
          type="button"
          className="text-xs font-medium text-muted-foreground transition hover:text-primary"
          onClick={handleResetConversation}
          disabled={isLoading}
        >
          Reset
        </button>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <AiChatContainer>
          <AiMessageList>
            {messages.map((message) => (
              <AiMessageBubble key={message.id} role={message.role} content={message.content} />
            ))}
          </AiMessageList>
          <AiInput
            placeholder="Ask about any card or concept..."
            value={input}
            onChange={(event) => setInput(event.target.value)}
            disabled={isLoading}
            isLoading={isLoading}
            onSubmit={handleSubmit}
            onKeyDown={(event) => {
              if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                handleSubmit();
              }
            }}
          />
        </AiChatContainer>
      </CardContent>
    </Card>
  );
}
