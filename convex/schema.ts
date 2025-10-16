import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  exercises: defineTable({
    name: v.string(),
    category: v.union(
      v.literal("Chest"),
      v.literal("Back"),
      v.literal("Legs"),
      v.literal("Shoulders"),
      v.literal("Arms"),
      v.literal("Core"),
    ),
    muscleGroup: v.optional(v.string()),
    userId: v.optional(v.id("users")),
  })
    .index("by_category", ["category"])
    .index("by_user", ["userId"]),
  workouts: defineTable({
    userId: v.id("users"),
    date: v.number(),
    notes: v.optional(v.string()),
    duration: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_date", ["userId", "date"]),
  sets: defineTable({
    workoutId: v.id("workouts"),
    exerciseId: v.id("exercises"),
    setNumber: v.number(),
    reps: v.number(),
    weight: v.number(),
    restTime: v.optional(v.number()),
  })
    .index("by_workout", ["workoutId"])
    .index("by_exercise", ["exerciseId"]),
});
