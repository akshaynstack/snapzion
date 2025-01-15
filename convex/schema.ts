import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
    users: defineTable({
        userId: v.string(), //clerkId
        email: v.string(),
        name: v.string(),
        isPro: v.boolean(),
        proSince: v.optional(v.number()),
        lemonSqueezyCustomerId: v.optional(v.string()),
        lemonSqueezyOrderId: v.optional(v.string()),
    }).index('by_user_id', ['userId']),

    images: defineTable({
        url: v.string(),
        prompt: v.string(),
        timestamp: v.number(), // Store timestamp as a number (milliseconds since epoch)
        style: v.string(),
        size: v.string(),
    }).index('by_timestamp', ['timestamp']),
});