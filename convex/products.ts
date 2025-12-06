import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all active products
export const list = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
    return products;
  },
});

// Get a single product by ID
export const get = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Add a new product
export const add = mutation({
  args: {
    name: v.string(),
    currentPrice: v.number(),
    originalPrice: v.optional(v.number()),
    image: v.string(),
    store: v.string(),
    url: v.optional(v.string()),
    description: v.optional(v.string()),
    targetPrice: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    const productId = await ctx.db.insert("products", {
      ...args,
      priceChange: 0,
      trend: "stable",
      lastUpdated: now,
      isActive: true,
      priceHistory: [{ date: now, price: args.currentPrice }],
    });
    return productId;
  },
});

// Update a product
export const update = mutation({
  args: {
    id: v.id("products"),
    name: v.optional(v.string()),
    currentPrice: v.optional(v.number()),
    originalPrice: v.optional(v.number()),
    targetPrice: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Product not found");

    // Calculate price change if price is being updated
    let priceChange = existing.priceChange;
    let trend = existing.trend;
    let priceHistory = existing.priceHistory || [];

    if (updates.currentPrice !== undefined && updates.currentPrice !== existing.currentPrice) {
      priceChange = updates.currentPrice - existing.currentPrice;
      trend = priceChange > 0 ? "up" : priceChange < 0 ? "down" : "stable";
      priceHistory = [...priceHistory, { date: new Date().toISOString(), price: updates.currentPrice }];
    }

    await ctx.db.patch(id, {
      ...updates,
      priceChange,
      trend,
      priceHistory,
      lastUpdated: new Date().toISOString(),
    });
  },
});

// Remove a product (soft delete)
export const remove = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { isActive: false });
  },
});

// Permanently delete a product
export const hardDelete = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Seed initial products
export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if products already exist
    const existingProducts = await ctx.db.query("products").collect();
    if (existingProducts.length > 0) {
      return { message: "Products already seeded", count: existingProducts.length };
    }

    const now = new Date().toISOString();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();

    const sampleProducts = [
      {
        name: "Sony WH-1000XM4 Wireless Noise-Canceling Headphones",
        currentPrice: 279.99,
        originalPrice: 349.99,
        image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=300",
        store: "Amazon",
        url: "https://amazon.com/dp/example1",
        description: "Industry-leading noise canceling with Dual Noise Sensor technology. Next-level music with Edge-AI.",
        priceChange: -15.50,
        trend: "down" as const,
        lastUpdated: "2 hours ago",
        isActive: true,
        targetPrice: 250,
        priceHistory: [
          { date: twoDaysAgo, price: 329.99 },
          { date: yesterday, price: 295.49 },
          { date: now, price: 279.99 },
        ],
      },
      {
        name: "Apple iPad Air (5th Generation)",
        currentPrice: 599.00,
        originalPrice: 599.00,
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300",
        store: "Best Buy",
        url: "https://bestbuy.com/example2",
        description: "10.9-inch Liquid Retina display with True Tone. Apple M1 chip with Neural Engine.",
        priceChange: 0,
        trend: "stable" as const,
        lastUpdated: "1 hour ago",
        isActive: true,
        priceHistory: [
          { date: twoDaysAgo, price: 599.00 },
          { date: yesterday, price: 599.00 },
          { date: now, price: 599.00 },
        ],
      },
      {
        name: "Samsung 65-inch 4K Smart TV",
        currentPrice: 899.99,
        originalPrice: 1099.99,
        image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300",
        store: "Target",
        url: "https://target.com/example3",
        description: "Crystal UHD 4K Smart TV with HDR. Built-in Alexa and smart home control.",
        priceChange: 25.00,
        trend: "up" as const,
        lastUpdated: "3 hours ago",
        isActive: true,
        targetPrice: 800,
        priceHistory: [
          { date: twoDaysAgo, price: 849.99 },
          { date: yesterday, price: 874.99 },
          { date: now, price: 899.99 },
        ],
      },
      {
        name: "Nintendo Switch OLED Model",
        currentPrice: 349.99,
        originalPrice: 349.99,
        image: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=300",
        store: "Walmart",
        url: "https://walmart.com/example4",
        description: "7-inch OLED screen with vibrant colors. Enhanced audio and 64 GB internal storage.",
        priceChange: -10.00,
        trend: "down" as const,
        lastUpdated: "5 hours ago",
        isActive: true,
        priceHistory: [
          { date: twoDaysAgo, price: 359.99 },
          { date: yesterday, price: 359.99 },
          { date: now, price: 349.99 },
        ],
      },
      {
        name: "Dyson V15 Detect Cordless Vacuum",
        currentPrice: 649.99,
        originalPrice: 749.99,
        image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=300",
        store: "Amazon",
        url: "https://amazon.com/dp/example5",
        description: "Laser reveals microscopic dust. Piezo sensor measures and counts dust particles.",
        priceChange: -50.00,
        trend: "down" as const,
        lastUpdated: "30 minutes ago",
        isActive: true,
        targetPrice: 600,
        priceHistory: [
          { date: twoDaysAgo, price: 699.99 },
          { date: yesterday, price: 699.99 },
          { date: now, price: 649.99 },
        ],
      },
    ];

    for (const product of sampleProducts) {
      await ctx.db.insert("products", product);
    }

    return { message: "Products seeded successfully", count: sampleProducts.length };
  },
});

// Clear all products (for testing)
export const clearAll = mutation({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    for (const product of products) {
      await ctx.db.delete(product._id);
    }
    return { message: "All products deleted", count: products.length };
  },
});
