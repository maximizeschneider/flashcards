"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type DeckFormState = {
  name: string;
  description: string;
};

const INITIAL_STATE: DeckFormState = {
  name: "",
  description: "",
};

type DeckFormProps = {
  onSubmit: (data: { name: string; description?: string }) => Promise<void>;
};

export function DeckForm({ onSubmit }: DeckFormProps) {
  const [formState, setFormState] = useState(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!formState.name.trim()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        name: formState.name.trim(),
        description: formState.description.trim() || undefined,
      });
      setFormState(INITIAL_STATE);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <Label htmlFor="name">Deck name</Label>
        <Input
          id="name"
          placeholder="Japanese N5 vocabulary"
          value={formState.name}
          onChange={(event) =>
            setFormState((prev) => ({ ...prev, name: event.target.value }))
          }
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          placeholder="Short summary of what this deck covers"
          value={formState.description}
          onChange={(event) =>
            setFormState((prev) => ({ ...prev, description: event.target.value }))
          }
        />
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create deck"}
      </Button>
    </form>
  );
}
