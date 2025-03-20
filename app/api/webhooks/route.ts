// import { NextRequest, NextResponse } from "next/server";
// import { ConvexHttpClient } from "convex/browser";
// import { api } from "@/convex/_generated/api";
// import crypto from "crypto";

// const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
// const CREEM_SECRET = process.env.CREEM_SECRET!; // Set this in env variables

// function verifySignature(body: string, signature: string): boolean {
//   const hmac = crypto.createHmac("sha256", CREEM_SECRET);
//   hmac.update(body);
//   const expectedSignature = hmac.digest(); // Returns Buffer

//   // Convert Buffer to Uint8Array
//   const expectedSignatureUint8 = new Uint8Array(expectedSignature);
//   const receivedSignatureUint8 = new Uint8Array(Buffer.from(signature, "hex"));

//   return crypto.timingSafeEqual(expectedSignatureUint8, receivedSignatureUint8);
// }

// export async function POST(req: NextRequest) {
//   try {
//     const bodyText = await req.text();
//     const signature = req.headers.get("x-creem-signature") || "";

//     // Verify Webhook Signature
//     if (!verifySignature(bodyText, signature)) {
//       return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
//     }

//     const body = JSON.parse(bodyText);

//     // Validate Event Type
//     if (body.eventType !== "checkout.completed") {
//       return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
//     }

//     // Extract Payment Details
//     const requestId = body.object.request_id; // This is your userId
//     const orderStatus = body.object.order.status; // Should be "paid"

//     // Ensure Payment was Successful
//     if (orderStatus !== "paid") {
//       return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
//     }

//     // Update User in Convex
//     await convex.mutation(api.users.upgradeToPro, { userId: requestId });

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("Webhook Error:", error);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }


import { NextRequest, NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";
import crypto from "crypto";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const CREEM_SECRET = process.env.CREEM_SECRET!; // Set in env variables

function verifySignature(body: string, signature: string): boolean {
  if (!signature) return false;

  const hmac = crypto.createHmac("sha256", CREEM_SECRET).update(body, "utf8").digest("hex");
  return crypto.timingSafeEqual(new Uint8Array(Buffer.from(hmac, "hex")), new Uint8Array(Buffer.from(signature, "hex")));
}

export async function POST(req: NextRequest) {
  try {
    const bodyText = await req.text();
    const signature = req.headers.get("creem-signature") || ""; // ✅ Correct header

    // ✅ Verify Webhook Signature
    if (!verifySignature(bodyText, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    const body = JSON.parse(bodyText);

    // ✅ Validate Event Type
    if (body.eventType !== "checkout.completed") {
      return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
    }

    // ✅ Extract Payment Details
    const userId = body.object.request_id; // ✅ Ensure this is the correct user identifier
    const orderStatus = body.object.order.status; // ✅ Should be "paid"

    // ✅ Ensure Payment was Successful
    if (orderStatus !== "paid") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
    }

    // ✅ Update User in Convex (Use `internal.mutation`)
    await convex.mutation(api.users.upgradeToPro, { userId });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}