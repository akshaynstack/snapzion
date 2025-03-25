// import { NextResponse } from "next/server";
// import { ConvexHttpClient } from "convex/browser";
// import { api } from "@/convex/_generated/api";

// export async function POST(req: Request) {
//   try {
//     const { secret } = await req.json();
//     const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

//     // Validate secret key from .env
//     if (secret !== process.env.REDEEM_CODE_SECRET) {
//       return NextResponse.json({ error: "Invalid secret key" }, { status: 403 });
//     }

//     // Generate redeem code (snapzion-XXXXXX)
//     const redeemCode = `snapzion-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

//     // Store the redeem code in Convex DB
//     await convex.mutation(api.generate.generateCode, { code: redeemCode });

//     return NextResponse.json({ success: true, code: redeemCode });
//   } catch (error) {
//     return NextResponse.json({ error: "Failed to generate code" }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

export async function POST(req: Request) {
  try {
    const { secret, count } = await req.json();
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

    // Validate secret key
    if (secret !== process.env.REDEEM_CODE_SECRET) {
      return NextResponse.json({ error: "Invalid secret key" }, { status: 403 });
    }

    const codes = [];
    for (let i = 0; i < count; i++) {
      const redeemCode = `snapzion-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      codes.push(redeemCode);
    }

    // Store the redeem codes in Convex DB
    await Promise.all(
      codes.map((code) => convex.mutation(api.generate.generateCode, { code }))
    );

    return NextResponse.json({ success: true, codes });
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate codes" }, { status: 500 });
  }
}