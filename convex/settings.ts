import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get user settings
export const get = query({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db.query("userSettings").first();
    if (!settings) {
      // Return default settings
      return {
        theme: "system" as const,
        notificationsEnabled: true,
        priceAlertThreshold: 10,
      };
    }
    return settings;
  },
});

// Update theme setting
export const setTheme = mutation({
  args: {
    theme: v.union(v.literal("light"), v.literal("dark"), v.literal("system")),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("userSettings").first();
    
    if (existing) {
      await ctx.db.patch(existing._id, { theme: args.theme });
    } else {
      await ctx.db.insert("userSettings", {
        theme: args.theme,
        notificationsEnabled: true,
        priceAlertThreshold: 10,
      });
    }
  },
});

// Update all settings
export const update = mutation({
  args: {
    theme: v.optional(v.union(v.literal("light"), v.literal("dark"), v.literal("system"))),
    notificationsEnabled: v.optional(v.boolean()),
    priceAlertThreshold: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("userSettings").first();
    
    if (existing) {
      await ctx.db.patch(existing._id, args);
    } else {
      await ctx.db.insert("userSettings", {
        theme: args.theme ?? "system",
        notificationsEnabled: args.notificationsEnabled ?? true,
        priceAlertThreshold: args.priceAlertThreshold ?? 10,
      });
    }
  },
});

// Initialize default settings
export const init = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("userSettings").first();
    if (existing) {
      return existing;
    }
    
    const id = await ctx.db.insert("userSettings", {
      theme: "system",
      notificationsEnabled: true,
      priceAlertThreshold: 10,
    });
    
    return await ctx.db.get(id);
  },
});
