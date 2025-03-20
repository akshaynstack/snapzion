// convex/mutations/updateProStatus.ts
import { mutation } from './_generated/server';
import { v } from 'convex/values';

export default mutation({
  args: { userId: v.string(), isPro: v.boolean(), proSince: v.number() },
  handler: async (ctx, { userId, isPro, proSince }) => {
    // Find the user document by userId
    const user = await ctx.db.query('users').filter(q => q.eq(q.field('userId'), userId)).first();

    if (user) {
      // Update the user's isPro status and proSince timestamp
      await ctx.db.patch(user._id, {
        isPro,
        proSince,
      });
    } else {
      throw new Error(`User with userId ${userId} not found`);
    }
  },
});