"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const INITIAL_STATE = {
  front: "",
  back: "",
  hint: "",
};

type FlashcardFormProps = {
  onSubmit: (data: { front: string; back: string; hint?: string }) => Promise<void>;
};

export function FlashcardForm({ onSubmit }: FlashcardFormProps) {
  const [formState, setFormState] = useState(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!formState.front.trim() || !formState.back.trim()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        front: formState.front.trim(),
        back: formState.back.trim(),
        hint: formState.hint.trim() || undefined,
      });
      setFormState(INITIAL_STATE);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <Label htmlFor="front">Prompt</Label>
        <Input
          id="front"
          placeholder="What is the capital of France?"
          value={formState.front}
          onChange={(event) =>
            setFormState((prev) => ({ ...prev, front: event.target.value }))
          }
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="back">Answer</Label>
        <Textarea
          id="back"
          placeholder="Paris"
          value={formState.back}
          onChange={(event) =>
            setFormState((prev) => ({ ...prev, back: event.target.value }))
          }
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="hint">Hint (optional)</Label>
        <Input
          id="hint"
          placeholder="Think about the Eiffel Tower"
          value={formState.hint}
          onChange={(event) =>
            setFormState((prev) => ({ ...prev, hint: event.target.value }))
          }
        />
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Adding..." : "Add flashcard"}
      </Button>
    </form>
  );
}
