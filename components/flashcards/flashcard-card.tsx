"use client";

import { useState } from "react";
import { Clock, Repeat2, Trash2 } from "lucide-react";

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
  deckId: string;
  front: string;
  back: string;
  hint?: string;
  due: number;
  interval: number;
  ease: number;
  reps: number;
  lapses: number;
  createdAt?: number;
};

type FlashcardCardProps = {
  card: Flashcard;
  onRemove: (id: string) => Promise<void>;
};

function formatDue(due: number) {
  const diff = due - Date.now();
  if (diff <= 0) {
    return "Due now";
  }

  const minutes = Math.max(1, Math.round(diff / (60 * 1000)));
  if (minutes < 60) {
    return `Due in ${minutes} minute${minutes === 1 ? "" : "s"}`;
  }

  const hours = Math.round(diff / (60 * 60 * 1000));
  if (hours < 24) {
    return `Due in ${hours} hour${hours === 1 ? "" : "s"}`;
  }

  const days = Math.round(diff / (24 * 60 * 60 * 1000));
  return `Due in ${days} day${days === 1 ? "" : "s"}`;
}

function describeInterval(interval: number) {
  if (interval <= 0) {
    return "Learning";
  }

  if (interval === 1) {
    return "1 day";
  }

  return `${interval} days`;
}

export function FlashcardCard({ card, onRemove }: FlashcardCardProps) {
  const [showBack, setShowBack] = useState(false);

  return (
    <Card className="flex h-full flex-col justify-between">
      <CardHeader>
        <CardTitle className="flex items-start justify-between gap-2">
          <span>{card.front}</span>
          <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <Clock className="h-4 w-4" />
            {formatDue(card.due)}
          </span>
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
          <span className="flex items-center gap-1 rounded-md border border-dashed border-border px-2 text-xs text-muted-foreground">
            <Repeat2 className="h-3.5 w-3.5" />
            {describeInterval(card.interval)} · EF {card.ease.toFixed(2)}
          </span>
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
