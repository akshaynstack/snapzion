import { mutation, query } from "./_generated/server";
import { v } from 'convex/values';
import { paginationOptsValidator } from "convex/server";

export const saveImage = mutation({
  args: {
    url: v.string(),    
    prompt: v.string(), 
    style: v.string(),  
    size: v.string(),   
  },
  handler: async (ctx, { url, prompt, style, size }) => {    
    const image = await ctx.db.insert("images", {
      url,            
      prompt,         
      timestamp: Date.now(), 
      style,           
      size,            
    });

    return image;
  },
});

export const fetchImages = query({
    args: { paginationOpts: paginationOptsValidator },
    handler: async (ctx, args) => {
      const images = await ctx.db
        .query("images")
        .order("desc")
        .paginate(args.paginationOpts);
  
      return {
        ...images,
        page: images.page.map(image => ({
          _id: image._id,
          url: image.url,
          prompt: image.prompt,
          timestamp: new Date(image._creationTime).toISOString(),
          style: image.style,
          size: image.size,
        })),
      };
    },
  });  