import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all alerts
export const list = query({
  args: {},
  handler: async (ctx) => {
    const alerts = await ctx.db.query("alerts").collect();
    return alerts.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  },
});

// Get unread alerts count
export const unreadCount = query({
  args: {},
  handler: async (ctx) => {
    const unreadAlerts = await ctx.db
      .query("alerts")
      .filter((q) => q.eq(q.field("read"), false))
      .collect();
    return unreadAlerts.length;
  },
});

// Mark alert as read
export const markAsRead = mutation({
  args: { id: v.id("alerts") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { read: true });
  },
});

// Mark all alerts as read
export const markAllAsRead = mutation({
  args: {},
  handler: async (ctx) => {
    const unreadAlerts = await ctx.db
      .query("alerts")
      .filter((q) => q.eq(q.field("read"), false))
      .collect();
    
    for (const alert of unreadAlerts) {
      await ctx.db.patch(alert._id, { read: true });
    }
    return { count: unreadAlerts.length };
  },
});

// Delete an alert
export const remove = mutation({
  args: { id: v.id("alerts") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Create an alert
export const create = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("alerts", {
      ...args,
      timestamp: new Date().toISOString(),
      read: false,
    });
  },
});

// Seed sample alerts
export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existingAlerts = await ctx.db.query("alerts").collect();
    if (existingAlerts.length > 0) {
      return { message: "Alerts already seeded", count: existingAlerts.length };
    }

    const sampleAlerts = [
      {
        type: "price_drop" as const,
        title: "Price Drop Alert",
        message: "Sony WH-1000XM4 dropped by $20 (15% off) on Amazon. Now at $279.99 - lowest price in 30 days!",
        productName: "Sony WH-1000XM4 Wireless Headphones",
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 minutes ago
        read: false,
      },
      {
        type: "trend_warning" as const,
        title: "Trend Alert",
        message: "Prices for Apple iPad Air are trending up. Consider buying now if you need it soon.",
        productName: "Apple iPad Air (5th Generation)",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        read: false,
      },
      {
        type: "news_alert" as const,
        title: "Market News",
        message: "Amazon Prime Day announced for next week. Expected deals on electronics and home goods.",
        productName: "Multiple Items",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
        read: true,
      },
      {
        type: "price_hike" as const,
        title: "Price Increase Warning",
        message: "Samsung 65-inch TV price increased by $50 (5% increase) across all stores.",
        productName: "Samsung 65-inch 4K Smart TV",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        read: true,
      },
      {
        type: "price_drop" as const,
        title: "Back in Stock - Price Drop",
        message: "Previously out-of-stock item is now available with 10% discount.",
        productName: "Nintendo Switch OLED",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        read: true,
      },
    ];

    for (const alert of sampleAlerts) {
      await ctx.db.insert("alerts", alert);
    }

    return { message: "Alerts seeded successfully", count: sampleAlerts.length };
  },
});
