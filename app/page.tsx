"use client";

import { useMemo } from "react";
import { useMutation, useQuery } from "convex/react";
import { BookOpenCheck, Layers3 } from "lucide-react";

import { DeckCard, type Deck } from "@/components/decks/deck-card";
import { DeckForm } from "@/components/decks/deck-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

export default function Home() {
  const { toast } = useToast();
  const decks = (useQuery("decks:list") as Deck[] | undefined) ?? [];
  const createDeck = useMutation("decks:create");
  const removeDeck = useMutation("decks:remove");

  const totals = useMemo(() => {
    return decks.reduce(
      (acc, deck) => {
        acc.decks += 1;
        acc.cards += deck.stats.total;
        acc.due += deck.stats.due;
        return acc;
      },
      { decks: 0, cards: 0, due: 0 },
    );
  }, [decks]);

  async function handleCreateDeck(values: { name: string; description?: string }) {
    try {
      await createDeck(values);
      toast({
        title: "Deck created",
        description: "Add some cards and start a review session!",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Unable to create deck",
        description: "Check your Convex deployment URL and try again.",
      });
    }
  }

  async function handleRemoveDeck(id: string) {
    const confirmed = window.confirm(
      "Deleting this deck will remove all of its cards. Continue?",
    );
    if (!confirmed) {
      return;
    }

    try {
      await removeDeck({ id });
      toast({
        title: "Deck deleted",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Unable to delete deck",
        description: "Is your Convex backend running?",
      });
    }
  }

  return (
    <main className="container mx-auto grid max-w-6xl gap-6 px-6 py-10">
      <section className="grid gap-4 lg:grid-cols-[340px,1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Layers3 className="h-5 w-5" />
              Create a deck
            </CardTitle>
            <CardDescription>
              Group related concepts and let the scheduler handle spaced repetition for each deck.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DeckForm onSubmit={handleCreateDeck} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpenCheck className="h-5 w-5" />
              Study snapshot
            </CardTitle>
            <CardDescription>
              Keep an eye on how many decks and cards are ready for review.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <dt className="text-sm text-muted-foreground">Decks</dt>
                <dd className="text-2xl font-semibold">{totals.decks}</dd>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <dt className="text-sm text-muted-foreground">Cards</dt>
                <dd className="text-2xl font-semibold">{totals.cards}</dd>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <dt className="text-sm text-muted-foreground">Due today</dt>
                <dd className="text-2xl font-semibold text-primary">{totals.due}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4">
        <div>
          <h2 className="text-lg font-semibold">Your decks</h2>
          <p className="text-sm text-muted-foreground">
            Create decks by topic, then dive into reviews powered by spaced repetition.
          </p>
        </div>
        {decks.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              No decks yet. Start by creating your first study collection.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {decks.map((deck) => (
              <DeckCard key={deck._id} deck={deck} onRemove={handleRemoveDeck} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
