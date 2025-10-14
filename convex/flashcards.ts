import { mutation, query } from "convex/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const flashcards = await ctx.db
      .query("flashcards")
      .withIndex("by_created_at")
      .order("desc")
      .collect();

    return flashcards.map((card) => ({ ...card, _id: card._id.toString() }));
  },
});

export const create = mutation({
  args: {
    front: v.string(),
    back: v.string(),
    hint: v.optional(v.string()),
  },
  handler: async (ctx, { front, back, hint }) => {
    const id = await ctx.db.insert("flashcards", {
      front,
      back,
      hint,
      known: false,
      createdAt: Date.now(),
    });

    return id.toString();
  },
});

export const toggleKnown = mutation({
  args: { id: v.string(), known: v.boolean() },
  handler: async (ctx, { id, known }) => {
    const normalized = ctx.db.normalizeId("flashcards", id);
    if (!normalized) {
      throw new Error("Flashcard not found");
    }

    await ctx.db.patch(normalized, { known });
  },
});

export const remove = mutation({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    const normalized = ctx.db.normalizeId("flashcards", id);
    if (!normalized) {
      throw new Error("Flashcard not found");
    }

    await ctx.db.delete(normalized);
  },
});
