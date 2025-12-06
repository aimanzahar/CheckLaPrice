/* eslint-disable */
/**
 * Generated Convex API stub - will be replaced when running `npx convex dev`
 */

// Stub API object - this will be replaced by the real Convex generated API
export const api = {
  products: {
    list: "products:list" as any,
    get: "products:get" as any,
    add: "products:add" as any,
    update: "products:update" as any,
    remove: "products:remove" as any,
    seed: "products:seed" as any,
    clearAll: "products:clearAll" as any,
    hardDelete: "products:hardDelete" as any,
  },
  alerts: {
    list: "alerts:list" as any,
    unreadCount: "alerts:unreadCount" as any,
    markAsRead: "alerts:markAsRead" as any,
    markAllAsRead: "alerts:markAllAsRead" as any,
    remove: "alerts:remove" as any,
    create: "alerts:create" as any,
    seed: "alerts:seed" as any,
  },
  settings: {
    get: "settings:get" as any,
    setTheme: "settings:setTheme" as any,
    update: "settings:update" as any,
    init: "settings:init" as any,
  },
  ping: {
    check: "ping:check" as any,
  },
} as const;
