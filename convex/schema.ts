import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  products: defineTable({
    name: v.string(),
    currentPrice: v.number(),
    originalPrice: v.optional(v.number()),
    image: v.string(),
    store: v.string(),
    url: v.optional(v.string()),
    description: v.optional(v.string()),
    priceChange: v.optional(v.number()),
    trend: v.optional(v.union(v.literal("up"), v.literal("down"), v.literal("stable"))),
    lastUpdated: v.string(),
    targetPrice: v.optional(v.number()),
    isActive: v.boolean(),
    priceHistory: v.optional(v.array(v.object({
      date: v.string(),
      price: v.number(),
    }))),
  }).index("by_store", ["store"])
    .index("by_active", ["isActive"]),

  alerts: defineTable({
    productId: v.optional(v.id("products")),
    type: v.union(
      v.literal("price_drop"),
      v.literal("price_hike"),
      v.literal("trend_warning"),
      v.literal("news_alert")
    ),
    title: v.string(),
    message: v.string(),
    productName: v.string(),
    timestamp: v.string(),
    read: v.boolean(),
  }).index("by_read", ["read"]),

  userSettings: defineTable({
    theme: v.union(v.literal("light"), v.literal("dark"), v.literal("system")),
    notificationsEnabled: v.boolean(),
    priceAlertThreshold: v.number(),
  }),
});
