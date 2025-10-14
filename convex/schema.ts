import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  decks: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_created_at", ["createdAt"]),
  cards: defineTable({
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
    .index("by_due", ["deckId", "due"]),
});
