import { mutation, query } from "convex/server";
import { v } from "convex/values";

type AuthContext = {
  auth: {
    getUserIdentity(): Promise<{ subject: string } | null>;
  };
};

function summarizeCards(cards: Array<{ due: number }>) {
  const now = Date.now();
  const total = cards.length;
  const due = cards.filter((card) => card.due <= now).length;
  const nextDue = cards.reduce<number | null>((soonest, card) => {
    if (soonest === null || card.due < soonest) {
      return card.due;
    }
    return soonest;
  }, null);

  return {
    total,
    due,
    scheduled: total - due,
    nextDue,
  };
}

async function requireUserId(ctx: AuthContext) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }

  return identity.subject;
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    const decks = await ctx.db
      .query("decks")
      .withIndex("by_created_at", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    return Promise.all(
      decks.map(async (deck) => {
        const cards = await ctx.db
          .query("cards")
          .withIndex("by_deck", (q) => q.eq("deckId", deck._id))
          .collect();

        return {
          _id: deck._id.toString(),
          name: deck.name,
          description: deck.description,
          createdAt: deck.createdAt,
          stats: summarizeCards(cards),
        };
      }),
    );
  },
});

export const get = query({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    const userId = await requireUserId(ctx);
    const deckId = ctx.db.normalizeId("decks", id);
    if (!deckId) {
      throw new Error("Deck not found");
    }

    const deck = await ctx.db.get(deckId);
    if (!deck) {
      throw new Error("Deck not found");
    }

    if (deck.userId !== userId) {
      throw new Error("Not authorized");
    }

    const cards = await ctx.db
      .query("cards")
      .withIndex("by_deck", (q) => q.eq("deckId", deckId))
      .collect();

    return {
      _id: deck._id.toString(),
      name: deck.name,
      description: deck.description,
      createdAt: deck.createdAt,
      stats: summarizeCards(cards),
    };
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, { name, description }) => {
    const userId = await requireUserId(ctx);
    const trimmedName = name.trim();
    if (!trimmedName) {
      throw new Error("Deck name is required");
    }

    const deckId = await ctx.db.insert("decks", {
      userId,
      name: trimmedName,
      description: description?.trim() || undefined,
      createdAt: Date.now(),
    });

    return deckId.toString();
  },
});

export const remove = mutation({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    const userId = await requireUserId(ctx);
    const deckId = ctx.db.normalizeId("decks", id);
    if (!deckId) {
      throw new Error("Deck not found");
    }

    const deck = await ctx.db.get(deckId);
    if (!deck || deck.userId !== userId) {
      throw new Error("Deck not found");
    }

    const cards = await ctx.db
      .query("cards")
      .withIndex("by_deck", (q) => q.eq("deckId", deckId))
      .collect();

    await Promise.all(cards.map((card) => ctx.db.delete(card._id)));
    await ctx.db.delete(deckId);
  },
});
