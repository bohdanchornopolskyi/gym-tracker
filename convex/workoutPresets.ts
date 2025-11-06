import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return [];
    }

    return await ctx.db
      .query("workoutPresets")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const get = query({
  args: { presetId: v.id("workoutPresets") },
  handler: async (ctx, { presetId }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not signed in");
    }

    const preset = await ctx.db.get(presetId);
    if (!preset || preset.userId !== userId) {
      return null;
    }

    const exerciseIds = preset.exercises.map((e) => e.exerciseId);
    const exercises = await Promise.all(
      exerciseIds.map((id) => ctx.db.get(id)),
    );

    return {
      ...preset,
      exerciseDetails: exercises.filter((e) => e !== null),
    };
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    notes: v.optional(v.string()),
    exercises: v.array(
      v.object({
        exerciseId: v.id("exercises"),
        sets: v.array(
          v.object({
            reps: v.number(),
            weight: v.number(),
            restTime: v.optional(v.number()),
          }),
        ),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not signed in");
    }

    return await ctx.db.insert("workoutPresets", {
      ...args,
      userId,
    });
  },
});

export const update = mutation({
  args: {
    presetId: v.id("workoutPresets"),
    name: v.optional(v.string()),
    notes: v.optional(v.string()),
    exercises: v.optional(
      v.array(
        v.object({
          exerciseId: v.id("exercises"),
          sets: v.array(
            v.object({
              reps: v.number(),
              weight: v.number(),
              restTime: v.optional(v.number()),
            }),
          ),
        }),
      ),
    ),
  },
  handler: async (ctx, { presetId, ...updates }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not signed in");
    }

    const preset = await ctx.db.get(presetId);
    if (!preset || preset.userId !== userId) {
      throw new Error("Preset not found or unauthorized");
    }

    await ctx.db.patch(presetId, updates);
  },
});

export const remove = mutation({
  args: { presetId: v.id("workoutPresets") },
  handler: async (ctx, { presetId }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not signed in");
    }

    const preset = await ctx.db.get(presetId);
    if (!preset || preset.userId !== userId) {
      throw new Error("Preset not found or unauthorized");
    }

    await ctx.db.delete(presetId);
  },
});

export const createFromWorkout = mutation({
  args: {
    workoutId: v.id("workouts"),
    name: v.string(),
  },
  handler: async (ctx, { workoutId, name }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not signed in");
    }

    const workout = await ctx.db.get(workoutId);
    if (!workout || workout.userId !== userId) {
      throw new Error("Workout not found or unauthorized");
    }

    const sets = await ctx.db
      .query("sets")
      .withIndex("by_workout", (q) => q.eq("workoutId", workoutId))
      .collect();

    const exerciseGroups = sets.reduce(
      (groups, set) => {
        const exerciseId = set.exerciseId;
        if (!groups[exerciseId]) {
          groups[exerciseId] = [];
        }
        groups[exerciseId].push({
          reps: set.reps,
          weight: set.weight,
          restTime: set.restTime,
        });
        return groups;
      },
      {} as Record<string, Array<{ reps: number; weight: number; restTime?: number }>>,
    );

    const exercises = Object.entries(exerciseGroups).map(([exerciseId, sets]) => ({
      exerciseId: exerciseId as any,
      sets,
    }));

    return await ctx.db.insert("workoutPresets", {
      userId,
      name,
      notes: workout.notes,
      exercises,
    });
  },
});

