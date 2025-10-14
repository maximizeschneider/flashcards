import { mutation, query } from "convex/server";
import { v } from "convex/values";

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const MIN_EASE = 1.3;

type Grade = "again" | "hard" | "good" | "easy";

type CardRecord = {
  _id: { toString(): string };
  deckId: { toString(): string };
  front: string;
  back: string;
  hint?: string;
  due: number;
  interval: number;
  ease: number;
  reps: number;
  lapses: number;
  createdAt: number;
};

function projectCard(card: CardRecord) {
  return {
    ...card,
    _id: card._id.toString(),
    deckId: card.deckId.toString(),
  };
}

function scheduleCard(
  card: CardRecord,
  grade: Grade,
): Pick<CardRecord, "due" | "interval" | "ease" | "reps" | "lapses"> {
  const now = Date.now();
  let { interval, ease, reps, lapses } = card;

  if (grade === "again") {
    lapses += 1;
    reps = Math.max(0, reps - 1);
    ease = Math.max(MIN_EASE, ease - 0.2);
    const minutes = reps === 0 ? 1 : 10;
    return {
      due: now + minutes * 60 * 1000,
      interval: 0,
      ease,
      reps,
      lapses,
    };
  }

  const isNew = reps === 0;
  if (grade === "hard") {
    ease = Math.max(MIN_EASE, ease - 0.05);
    interval = isNew ? 1 : Math.max(1, Math.round(interval * 1.2));
  } else if (grade === "good") {
    ease = Math.max(MIN_EASE, ease + 0.05);
    interval = isNew ? 3 : Math.max(1, Math.round(interval * ease));
  } else {
    // easy
    ease = Math.max(MIN_EASE, ease + 0.15);
    interval = isNew ? 5 : Math.max(1, Math.round(interval * ease * 1.3));
  }

  reps += 1;

  return {
    due: now + interval * DAY_IN_MS,
    interval,
    ease,
    reps,
    lapses,
  };
}

export const listByDeck = query({
  args: { deckId: v.string() },
  handler: async (ctx, { deckId }) => {
    const normalizedDeckId = ctx.db.normalizeId("decks", deckId);
    if (!normalizedDeckId) {
      throw new Error("Deck not found");
    }

    const cards = await ctx.db
      .query("cards")
      .withIndex("by_deck", (q) => q.eq("deckId", normalizedDeckId))
      .order("desc")
      .collect();

    return cards.map(projectCard);
  },
});

export const due = query({
  args: { deckId: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, { deckId, limit }) => {
    const normalizedDeckId = ctx.db.normalizeId("decks", deckId);
    if (!normalizedDeckId) {
      throw new Error("Deck not found");
    }

    const cards = await ctx.db
      .query("cards")
      .withIndex("by_due", (q) => q.eq("deckId", normalizedDeckId))
      .order("asc")
      .collect();

    const dueCards = cards.filter((card) => card.due <= Date.now());
    const limited = typeof limit === "number" ? dueCards.slice(0, limit) : dueCards;

    return limited.map(projectCard);
  },
});

export const create = mutation({
  args: {
    deckId: v.string(),
    front: v.string(),
    back: v.string(),
    hint: v.optional(v.string()),
  },
  handler: async (ctx, { deckId, front, back, hint }) => {
    const normalizedDeckId = ctx.db.normalizeId("decks", deckId);
    if (!normalizedDeckId) {
      throw new Error("Deck not found");
    }

    const cardId = await ctx.db.insert("cards", {
      deckId: normalizedDeckId,
      front,
      back,
      hint,
      due: Date.now(),
      interval: 0,
      ease: 2.5,
      reps: 0,
      lapses: 0,
      createdAt: Date.now(),
    });

    return cardId.toString();
  },
});

export const remove = mutation({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    const normalizedId = ctx.db.normalizeId("cards", id);
    if (!normalizedId) {
      throw new Error("Card not found");
    }

    await ctx.db.delete(normalizedId);
  },
});

export const review = mutation({
  args: {
    id: v.string(),
    grade: v.union(
      v.literal("again"),
      v.literal("hard"),
      v.literal("good"),
      v.literal("easy"),
    ),
  },
  handler: async (ctx, { id, grade }) => {
    const normalizedId = ctx.db.normalizeId("cards", id);
    if (!normalizedId) {
      throw new Error("Card not found");
    }

    const card = (await ctx.db.get(normalizedId)) as CardRecord | null;
    if (!card) {
      throw new Error("Card not found");
    }

    const updates = scheduleCard(card, grade as Grade);
    await ctx.db.patch(normalizedId, updates);
  },
});
