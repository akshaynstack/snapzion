// 'use server';

// import { NextResponse } from 'next/server';
// import { api } from '@/convex/_generated/api';
// import { ConvexHttpClient } from 'convex/browser';
// import crypto from 'crypto';

// const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
// const WEBHOOK_SECRET = process.env.CREEM_WEBHOOK_SECRET!;

// function verifySignature(payload: string, signature: string): boolean {
//   const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
//   const computedSignature = hmac.update(payload).digest('hex');
//   return signature === computedSignature;
// }

// export async function POST(req: Request) {
//   try {
//     const body = await req.text();
//     const signature = req.headers.get('x-signature');

//     if (!signature || !WEBHOOK_SECRET || !verifySignature(body, signature)) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const payload = JSON.parse(body);
//     if (payload.event !== 'checkout.completed') {
//       return NextResponse.json({ message: 'Event not handled' }, { status: 400 });
//     }

//     const { request_id } = payload.data;
//     if (!request_id) {
//       return NextResponse.json({ error: 'Invalid webhook payload' }, { status: 400 });
//     }

//     // Upgrade user to Pro in Convex DB
//     await convex.mutation(api.users.upgradeToPro, {
//       userId: request_id,
//     });

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error('Webhook processing error:', error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import crypto from "crypto";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const CREEM_SECRET = process.env.CREEM_SECRET!; // Set this in env variables

function verifySignature(body: string, signature: string): boolean {
  const hmac = crypto.createHmac("sha256", CREEM_SECRET);
  hmac.update(body);
  const expectedSignature = hmac.digest(); // Returns Buffer

  // Convert Buffer to Uint8Array
  const expectedSignatureUint8 = new Uint8Array(expectedSignature);
  const receivedSignatureUint8 = new Uint8Array(Buffer.from(signature, "hex"));

  return crypto.timingSafeEqual(expectedSignatureUint8, receivedSignatureUint8);
}

export async function POST(req: NextRequest) {
  try {
    const bodyText = await req.text();
    const signature = req.headers.get("x-creem-signature") || "";

    // Verify Webhook Signature
    if (!verifySignature(bodyText, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    const body = JSON.parse(bodyText);

    // Validate Event Type
    if (body.eventType !== "checkout.completed") {
      return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
    }

    // Extract Payment Details
    const requestId = body.object.request_id; // This is your userId
    const orderStatus = body.object.order.status; // Should be "paid"

    // Ensure Payment was Successful
    if (orderStatus !== "paid") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
    }

    // Update User in Convex
    await convex.mutation(api.users.upgradeToPro, { userId: requestId });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}