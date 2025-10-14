import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  flashcards: defineTable({
    front: v.string(),
    back: v.string(),
    hint: v.optional(v.string()),
    known: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_created_at", ["createdAt"])
    .index("by_known", ["known", "createdAt"]),
});
