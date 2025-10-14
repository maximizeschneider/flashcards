"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type DeckGenerationSource = {
  id: string;
  type: "link" | "pdf" | "text";
  value: string;
};

export type DeckFormValues = {
  name: string;
  description?: string;
  generation?: {
    topic?: string;
    sources?: Array<Omit<DeckGenerationSource, "id">>;
  };
};

type DeckFormProps = {
  onSubmit: (data: DeckFormValues) => Promise<void>;
};

const INITIAL_STATE = {
  name: "",
  description: "",
};

export function DeckForm({ onSubmit }: DeckFormProps) {
  const [formState, setFormState] = useState(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generationEnabled, setGenerationEnabled] = useState(false);
  const [topic, setTopic] = useState("");
  const [sources, setSources] = useState<DeckGenerationSource[]>([]);
  const [newSourceType, setNewSourceType] = useState<DeckGenerationSource["type"]>("link");
  const [newSourceValue, setNewSourceValue] = useState("");

  const canGenerate = useMemo(() => {
    if (!generationEnabled) {
      return false;
    }

    return Boolean(topic.trim()) || sources.length > 0;
  }, [generationEnabled, sources.length, topic]);

  function resetForm() {
    setFormState(INITIAL_STATE);
    setGenerationEnabled(false);
    setTopic("");
    setSources([]);
    setNewSourceType("link");
    setNewSourceValue("");
  }

  function handleAddSource(event: React.FormEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (!newSourceValue.trim()) {
      return;
    }

    setSources((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type: newSourceType,
        value: newSourceValue.trim(),
      },
    ]);
    setNewSourceValue("");
  }

  function handleRemoveSource(id: string) {
    setSources((prev) => prev.filter((source) => source.id !== id));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!formState.name.trim()) {
      return;
    }

    try {
      setIsSubmitting(true);
      const payload: DeckFormValues = {
        name: formState.name.trim(),
        description: formState.description.trim() || undefined,
      };

      if (canGenerate) {
        payload.generation = {
          topic: topic.trim() || undefined,
          sources: sources.map(({ type, value }) => ({ type, value })),
        };
      }

      await onSubmit(payload);
      resetForm();
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
      <div className="space-y-3 rounded-lg border border-dashed border-border bg-muted/30 p-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold">AI-generated flashcards</h3>
            <p className="text-xs text-muted-foreground">
              Provide a topic or supporting sources (links, PDFs, or notes) and we&apos;ll draft starter cards for you.
            </p>
          </div>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border border-input accent-primary"
              checked={generationEnabled}
              onChange={(event) => setGenerationEnabled(event.target.checked)}
            />
            Enable
          </label>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="topic">Deck topic</Label>
          <Input
            id="topic"
            placeholder="e.g. Fundamentals of photosynthesis"
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            disabled={!generationEnabled}
          />
        </div>

        <fieldset className="grid gap-3" disabled={!generationEnabled}>
          <legend className="text-sm font-semibold">Sources</legend>
          <div className="flex flex-col gap-2 rounded-md border border-border bg-background p-3 text-sm">
            {sources.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                Add URLs to articles or PDFs, or paste helpful notes. These will be summarized for flashcard generation.
              </p>
            ) : (
              <ul className="grid gap-2">
                {sources.map((source) => (
                  <li
                    key={source.id}
                    className="flex items-start justify-between gap-2 rounded border border-border bg-muted/40 p-2 text-xs"
                  >
                    <div className="flex-1">
                      <span className="font-semibold capitalize">{source.type}</span>
                      <span className="ml-2 break-words text-muted-foreground">{source.value}</span>
                    </div>
                    <button
                      type="button"
                      className="text-muted-foreground transition hover:text-destructive"
                      onClick={() => handleRemoveSource(source.id)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="grid gap-2 rounded-md border border-dashed border-border p-3">
            <div className="grid gap-2 sm:grid-cols-[140px,1fr]">
              <div className="grid gap-1">
                <Label htmlFor="source-type" className="text-xs uppercase tracking-wide text-muted-foreground">
                  Source type
                </Label>
                <select
                  id="source-type"
                  className="h-10 rounded-md border border-input bg-background px-2 text-sm"
                  value={newSourceType}
                  onChange={(event) => setNewSourceType(event.target.value as DeckGenerationSource["type"])}
                  disabled={!generationEnabled}
                >
                  <option value="link">Link</option>
                  <option value="pdf">PDF</option>
                  <option value="text">Notes</option>
                </select>
              </div>
              <div className="grid gap-1">
                <Label htmlFor="source-value" className="text-xs uppercase tracking-wide text-muted-foreground">
                  Details
                </Label>
                <Textarea
                  id="source-value"
                  placeholder={
                    newSourceType === "text"
                      ? "Paste relevant notes or a short summary."
                      : "Paste a direct link to the article or PDF."
                  }
                  value={newSourceValue}
                  onChange={(event) => setNewSourceValue(event.target.value)}
                  rows={newSourceType === "text" ? 3 : 2}
                  disabled={!generationEnabled}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="button" size="sm" onClick={handleAddSource} disabled={!generationEnabled || !newSourceValue.trim()}>
                Add source
              </Button>
            </div>
          </div>
        </fieldset>
        <p className="text-xs text-muted-foreground">
          When enabled, deck creation will call the AI generator after saving your deck. This may take a few seconds.
        </p>
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : canGenerate ? "Create & generate" : "Create deck"}
      </Button>
    </form>
  );
}
