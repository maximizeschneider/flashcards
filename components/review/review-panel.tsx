"use client";

import { useEffect, useMemo, useState } from "react";
import { Brain } from "lucide-react";

import { Flashcard } from "@/components/flashcards/flashcard-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Grade = "again" | "hard" | "good" | "easy";

type ReviewPanelProps = {
  cards: Flashcard[];
  onReview: (id: string, grade: Grade) => Promise<void>;
  totalDue?: number;
};

const GRADES: Array<{
  value: Grade;
  label: string;
  description: string;
}> = [
  {
    value: "again",
    label: "Again",
    description: "Relearn this card soon",
  },
  {
    value: "hard",
    label: "Hard",
    description: "Still fuzzy",
  },
  {
    value: "good",
    label: "Good",
    description: "Remembered with effort",
  },
  {
    value: "easy",
    label: "Easy",
    description: "Nailed it",
  },
];

export function ReviewPanel({ cards, onReview, totalDue }: ReviewPanelProps) {
  const [showBack, setShowBack] = useState(false);
  const currentCard = cards[0];
  const remaining = totalDue ?? cards.length;

  useEffect(() => {
    setShowBack(false);
  }, [currentCard?._id]);

  const isEmpty = useMemo(() => !currentCard, [currentCard]);

  if (isEmpty) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-muted-foreground" />
            You're all caught up
          </CardTitle>
          <CardDescription>
            No cards are due. Add more cards or come back later for spaced repetition magic.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card id="review" className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <span>{currentCard.front}</span>
          <span className="text-xs text-muted-foreground">{remaining} due</span>
        </CardTitle>
        {currentCard.hint ? (
          <CardDescription>
            <span className="font-semibold text-foreground">Hint:</span> {currentCard.hint}
          </CardDescription>
        ) : null}
      </CardHeader>
      <CardContent className="flex-1">
        <div className="min-h-[160px] rounded-lg border border-dashed border-border bg-muted/30 p-6 text-base leading-relaxed">
          {showBack ? currentCard.back : "Think about the answer, then reveal it."}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="secondary" onClick={() => setShowBack((prev) => !prev)}>
          {showBack ? "Hide answer" : "Reveal answer"}
        </Button>
        <div className="grid w-full gap-2 sm:w-auto sm:grid-cols-4">
          {GRADES.map((grade) => (
            <Button
              key={grade.value}
              variant={grade.value === "again" ? "destructive" : grade.value === "easy" ? "default" : "outline"}
              onClick={() => onReview(currentCard._id, grade.value)}
            >
              <div className="flex flex-col">
                <span className="font-semibold">{grade.label}</span>
                <span className="text-xs text-muted-foreground">{grade.description}</span>
              </div>
            </Button>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
