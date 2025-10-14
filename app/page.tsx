"use client";

import { useMemo } from "react";
import { useMutation, useQuery } from "convex/react";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  FlashcardCard,
  type Flashcard,
} from "@/components/flashcards/flashcard-card";
import { FlashcardForm } from "@/components/flashcards/flashcard-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

export default function Home() {
  const router = useRouter();
  const { toast } = useToast();
  const flashcards = (useQuery("flashcards:list") as Flashcard[] | undefined) ?? [];
  const createFlashcard = useMutation("flashcards:create");
  const toggleKnown = useMutation("flashcards:toggleKnown");
  const removeFlashcard = useMutation("flashcards:remove");

  const stats = useMemo(() => {
    const total = flashcards.length;
    const known = flashcards.filter((card) => card.known).length;
    return {
      total,
      known,
      newCount: total - known,
    };
  }, [flashcards]);

  async function handleCreate(values: {
    front: string;
    back: string;
    hint?: string;
  }) {
    try {
      await createFlashcard(values);
      toast({
        title: "Flashcard created",
        description: "Keep going! Consistency makes memories stick.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Unable to create flashcard",
        description: "Check your Convex deployment URL and try again.",
      });
    }
  }

  async function handleToggleKnown(id: string, known: boolean) {
    try {
      await toggleKnown({ id, known });
    } catch (error) {
      console.error(error);
      toast({
        title: "Unable to update",
        description: "Is your Convex backend running?",
      });
    }
  }

  async function handleRemove(id: string) {
    try {
      await removeFlashcard({ id });
      toast({
        title: "Flashcard removed",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Unable to remove",
        description: "Double-check the Convex configuration.",
      });
    }
  }

  return (
    <main className="container mx-auto grid max-w-6xl gap-6 px-6 py-10">
      <section className="grid gap-4 lg:grid-cols-[320px,1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <PlusCircle className="h-5 w-5" />
              Create flashcard
            </CardTitle>
            <CardDescription>
              Capture prompts and answers for quick spaced repetition.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FlashcardForm onSubmit={handleCreate} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Progress overview</CardTitle>
            <CardDescription>
              Track how many cards are in your rotation and what remains to learn.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <dt className="text-sm text-muted-foreground">Total cards</dt>
                <dd className="text-2xl font-semibold">{stats.total}</dd>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <dt className="text-sm text-muted-foreground">Known</dt>
                <dd className="text-2xl font-semibold text-emerald-400">
                  {stats.known}
                </dd>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <dt className="text-sm text-muted-foreground">To review</dt>
                <dd className="text-2xl font-semibold text-primary">
                  {stats.newCount}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Your flashcards</h2>
            <p className="text-sm text-muted-foreground">
              Flip cards, track mastery, and keep learning.
            </p>
          </div>
          <Button variant="outline" onClick={() => router.refresh()}>
            Refresh
          </Button>
        </div>
        {flashcards.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              No flashcards yet. Add your first card to start studying.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {flashcards.map((card) => (
              <FlashcardCard
                key={card._id}
                card={card}
                onToggleKnown={handleToggleKnown}
                onRemove={handleRemove}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
