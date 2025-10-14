"use client";

import Link from "next/link";
import { CalendarClock, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type DeckStats = {
  total: number;
  due: number;
  scheduled: number;
  nextDue: number | null;
};

export type Deck = {
  _id: string;
  name: string;
  description?: string;
  createdAt: number;
  stats: DeckStats;
};

type DeckCardProps = {
  deck: Deck;
  onRemove: (id: string) => Promise<void>;
};

function formatNextDue(nextDue: number | null) {
  if (nextDue === null) {
    return "No cards yet";
  }

  const diff = nextDue - Date.now();
  if (diff <= 0) {
    return "Cards ready";
  }

  const days = Math.round(diff / (24 * 60 * 60 * 1000));
  if (days === 0) {
    return "Due later today";
  }

  return `Next due in ${days} day${days === 1 ? "" : "s"}`;
}

export function DeckCard({ deck, onRemove }: DeckCardProps) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="flex items-start justify-between gap-2 text-xl">
          <span>{deck.name}</span>
          <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <CalendarClock className="h-4 w-4" />
            {formatNextDue(deck.stats.nextDue)}
          </span>
        </CardTitle>
        {deck.description ? (
          <CardDescription>{deck.description}</CardDescription>
        ) : null}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <dl className="grid gap-2 sm:grid-cols-3">
          <div className="rounded-md border border-border bg-muted/30 p-3">
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">Total</dt>
            <dd className="text-lg font-semibold">{deck.stats.total}</dd>
          </div>
          <div className="rounded-md border border-border bg-muted/30 p-3">
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">Due</dt>
            <dd className="text-lg font-semibold text-primary">{deck.stats.due}</dd>
          </div>
          <div className="rounded-md border border-border bg-muted/30 p-3">
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">Scheduled</dt>
            <dd className="text-lg font-semibold text-emerald-400">
              {deck.stats.scheduled}
            </dd>
          </div>
        </dl>
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-2">
        <Button asChild>
          <Link href={`/decks/${deck._id}`}>Open deck</Link>
        </Button>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href={`/decks/${deck._id}#review`}>Review now</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive"
            onClick={() => onRemove(deck._id)}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete deck</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
