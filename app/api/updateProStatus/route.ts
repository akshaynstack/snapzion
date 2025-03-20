import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("request_id");
  const orderId = searchParams.get("order_id"); // Creem order ID
  const signature = searchParams.get("signature"); // Security signature

  if (!userId || !orderId || !signature) {
    return new Response("Missing parameters", { status: 400 });
  }

  try {
    // ✅ Step 1: Verify the payment with Creem API
    const response = await fetch(`https://test-api.creem.io/v1/orders/${orderId}`, {
      headers: { "x-api-key": process.env.CREEM_API_KEY || "" },
    });

    const paymentData = await response.json();

    // ✅ Step 2: Check if the payment was successful
    if (paymentData.status !== "paid") {
      return new Response("Payment not verified", { status: 400 });
    }

    // ✅ Step 3: Upgrade user in Convex DB
    await convex.mutation(api.users.upgradeToPro, { userId });

    // ✅ Step 4: Redirect to pricing page
    return new Response("User upgraded to Pro", { status: 200 });
  } catch (error) {
    console.error("Failed to update Pro status:", error);
    return new Response("Failed to update user", { status: 500 });
  }
}