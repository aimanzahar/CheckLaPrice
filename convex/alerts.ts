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
        _id: "demo_alert_1" as Id<"alerts">,
        _creationTime: Date.now(),
        userId: "demo_user",
        productId: "demo_product_1" as Id<"products">,
        type: "price_drop" as const,
        title: "Price Drop Alert",
        message: "Sony WH-1000XM4 dropped by RM 20 (15% off) on Amazon. Now at RM 279.99 - lowest price in 30 days!",
        productName: "Sony WH-1000XM4 Wireless Headphones",
        isRead: false,
        createdAt: new Date().toISOString(),
      },
      {
        _id: "demo_alert_2" as Id<"alerts">,
        _creationTime: Date.now(),
        userId: "demo_user",
        productId: null,
        type: "trend_warning" as const,
        title: "Market Trend Warning",
        message: "Tech sector showing inflation trends. Monitor prices closely over the next 2 weeks.",
        productName: undefined,
        isRead: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      },
      {
        _id: "demo_alert_3" as Id<"alerts">,
        _creationTime: Date.now(),
        userId: "demo_user",
        productId: "demo_product_3" as Id<"products">,
        type: "price_hike" as const,
        title: "Price Increase Warning",
        message: "Samsung 65-inch TV price increased by RM 50 (5% increase) across all stores.",
        productName: "Samsung 65-inch 4K Smart TV",
        isRead: false,
        createdAt: new Date().toISOString(),
      },
      {
        _id: "demo_alert_4" as Id<"alerts">,
        _creationTime: Date.now(),
        userId: "demo_user",
        productId: "demo_product_2" as Id<"products">,
        type: "price_drop" as const,
        title: "Back in Stock - Price Drop",
        message: "Previously out-of-stock item is now available with 10% discount.",
        productName: "Apple iPad Air (5th Generation)",
        isRead: true,
        createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      },
    ];

    for (const alert of sampleAlerts) {
      await ctx.db.insert("alerts", alert);
    }

    return { message: "Alerts seeded successfully", count: sampleAlerts.length };
  },
});
