import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const redeemCode = mutation({
  args: { code: v.string(), email: v.string() }, // ✅ Accept email instead of userId
  handler: async (ctx, { code, email }) => {
    // ✅ Find the user by email
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (!user) {
      throw new Error("User not found.");
    }

    // ✅ Find the redeem code
    const codeEntry = await ctx.db
      .query("redeemCodes")
      .withIndex("by_code", (q) => q.eq("code", code))
      .first();

    if (!codeEntry || codeEntry.isUsed) {
      throw new Error("Invalid or already used code.");
    }

    // ✅ Mark the redeem code as used
    await ctx.db.patch(codeEntry._id, {
      isUsed: true,
      userId: user.userId, // Associate with the found user
      usedAt: Date.now(),
    });

    // ✅ Upgrade user to Pro
    await ctx.db.patch(user._id, {
      isPro: true,
      proSince: Date.now(),
    });

    return { success: true };
  },
});