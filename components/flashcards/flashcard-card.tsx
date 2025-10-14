"use client";

import { useState } from "react";
import { CheckCircle2, Sparkles, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type Flashcard = {
  _id: string;
  front: string;
  back: string;
  hint?: string;
  known: boolean;
  createdAt?: number;
};

type FlashcardCardProps = {
  card: Flashcard;
  onToggleKnown: (id: string, known: boolean) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
};

export function FlashcardCard({ card, onToggleKnown, onRemove }: FlashcardCardProps) {
  const [showBack, setShowBack] = useState(false);

  return (
    <Card className="flex h-full flex-col justify-between">
      <CardHeader>
        <CardTitle className="flex items-start justify-between gap-2">
          <span>{card.front}</span>
          {card.known ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          ) : (
            <Sparkles className="h-5 w-5 text-primary" />
          )}
        </CardTitle>
        {card.hint ? (
          <CardDescription>
            <span className="font-semibold text-foreground">Hint:</span> {card.hint}
          </CardDescription>
        ) : null}
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground">
          {showBack ? card.back : "Tap reveal to check your understanding."}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-2">
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => setShowBack((prev) => !prev)}>
            {showBack ? "Hide" : "Reveal"}
          </Button>
          <Button
            size="sm"
            variant={card.known ? "outline" : "default"}
            onClick={() => onToggleKnown(card._id, !card.known)}
          >
            {card.known ? "Mark as new" : "Mark known"}
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive"
          onClick={() => onRemove(card._id)}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
