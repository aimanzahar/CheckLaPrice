import { query } from "./_generated/server";

export const check = query({
  args: {},
  handler: async (ctx) => {
    // Simple ping query to check if Convex is connected
    return { status: "connected", timestamp: Date.now() };
  },
});