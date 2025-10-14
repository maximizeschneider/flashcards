"use client";

import { useMemo } from "react";
import { useMutation, useQuery } from "convex/react";
import { ArrowLeft, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { Deck } from "@/components/decks/deck-card";
import { FlashcardCard, type Flashcard } from "@/components/flashcards/flashcard-card";
import { FlashcardForm } from "@/components/flashcards/flashcard-form";
import { ReviewPanel } from "@/components/review/review-panel";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

export default function DeckDetailPage() {
  const params = useParams<{ deckId: string }>();
  const deckId = params?.deckId;
  const { toast } = useToast();

  const deck = (useQuery("decks:get", deckId ? { id: deckId } : "skip") as Deck | undefined) ?? null;
  const cards = (useQuery(
    "cards:listByDeck",
    deckId ? { deckId } : "skip",
  ) as Flashcard[] | undefined) ?? [];
  const dueCards = (useQuery(
    "cards:due",
    deckId ? { deckId, limit: 10 } : "skip",
  ) as Flashcard[] | undefined) ?? [];

  const createCard = useMutation("cards:create");
  const removeCard = useMutation("cards:remove");
  const reviewCard = useMutation("cards:review");

  const stats = useMemo(() => {
    const total = cards.length;
    const due = deck?.stats.due ?? dueCards.length;
    const learning = cards.filter((card) => card.interval === 0).length;
    return { total, due, learning };
  }, [cards, deck?.stats.due, dueCards]);

  async function handleCreateCard(values: { front: string; back: string; hint?: string }) {
    if (!deckId) {
      return;
    }

    try {
      await createCard({ deckId, ...values });
      toast({
        title: "Card created",
        description: "Keep the momentum going!",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Unable to create card",
        description: "Check your Convex deployment URL and try again.",
      });
    }
  }

  async function handleRemoveCard(id: string) {
    try {
      await removeCard({ id });
      toast({
        title: "Card deleted",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Unable to delete card",
        description: "Is your Convex backend running?",
      });
    }
  }

  async function handleReview(id: string, grade: "again" | "hard" | "good" | "easy") {
    try {
      await reviewCard({ id, grade });
    } catch (error) {
      console.error(error);
      toast({
        title: "Unable to record review",
        description: "Double-check your Convex configuration.",
      });
    }
  }

  if (!deckId) {
    return null;
  }

  return (
    <main className="container mx-auto grid max-w-6xl gap-6 px-6 py-10">
      <div className="flex flex-col gap-3">
        <Button asChild variant="ghost" className="w-fit">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to decks
          </Link>
        </Button>
        <div className="grid gap-4 lg:grid-cols-[360px,1fr]">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <PlusCircle className="h-5 w-5" />
                Add a flashcard
              </CardTitle>
              <CardDescription>
                Capture a prompt and answer. We'll schedule the next review automatically.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FlashcardForm onSubmit={handleCreateCard} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{deck?.name ?? "Deck"}</CardTitle>
              {deck?.description ? <CardDescription>{deck.description}</CardDescription> : null}
            </CardHeader>
            <CardContent>
              <dl className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <dt className="text-sm text-muted-foreground">Total cards</dt>
                  <dd className="text-2xl font-semibold">{stats.total}</dd>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <dt className="text-sm text-muted-foreground">Due now</dt>
                  <dd className="text-2xl font-semibold text-primary">{stats.due}</dd>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <dt className="text-sm text-muted-foreground">Learning</dt>
                  <dd className="text-2xl font-semibold text-emerald-400">{stats.learning}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>

      <section className="grid gap-4 lg:grid-cols-[360px,1fr]">
        <ReviewPanel cards={dueCards} totalDue={deck?.stats.due} onReview={handleReview} />
        <Card>
          <CardHeader>
            <CardTitle>Your cards</CardTitle>
            <CardDescription>Flip through cards, inspect intervals, or remove ones you no longer need.</CardDescription>
          </CardHeader>
          <CardContent>
            {cards.length === 0 ? (
              <div className="py-10 text-center text-muted-foreground">
                No cards yet. Add your first prompt to get started.
              </div>
            ) : (
              <div className="grid gap-4">
                {cards.map((card) => (
                  <FlashcardCard key={card._id} card={card} onRemove={handleRemoveCard} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
