import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

export async function POST(req: Request) {
  try {
    const { code, email } = await req.json();
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

    const result = await convex.mutation(api.redeem.redeemCode, { code, email });

    return NextResponse.json({ success: result.success });
  } catch (error) {
    let errorMessage = "Something went wrong.";
    
    if ((error as Error).message.includes("User not found")) {
      errorMessage = "User not registered.";
    } else if ((error as Error).message.includes("Invalid or already used code")) {
      errorMessage = "Invalid or already used code.";
    }

    return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
  }
}