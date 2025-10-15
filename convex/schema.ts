import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  decks: defineTable({
    userId: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_created_at", ["userId", "createdAt"])
    .index("by_user", ["userId"]),
  cards: defineTable({
    userId: v.string(),
    deckId: v.id("decks"),
    front: v.string(),
    back: v.string(),
    hint: v.optional(v.string()),
    due: v.number(),
    interval: v.number(),
    ease: v.number(),
    reps: v.number(),
    lapses: v.number(),
    createdAt: v.number(),
  })
    .index("by_deck", ["deckId", "createdAt"])
    .index("by_due", ["deckId", "due"])
    .index("by_user", ["userId", "createdAt"]),
});
