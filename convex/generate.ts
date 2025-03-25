// import { mutation } from "./_generated/server";
// import { v } from "convex/values";

// export const generateCode = mutation({
//   args: { code: v.string() },
//   handler: async ({ db }, { code }) => {
//     await db.insert("redeemCodes", { code, isUsed: false, createdAt: Date.now() });
//     return { success: true };
//   },
// });

import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const generateCode = mutation({
  args: { code: v.string() },
  handler: async ({ db }, { code }) => {
    await db.insert("redeemCodes", { code, isUsed: false, createdAt: Date.now() });
    return { success: true };
  },
});