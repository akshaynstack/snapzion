// 'use server';

// import axios from 'axios';

// const CREEM_API_KEY = process.env.CREEM_API_KEY; // Ensure this is set in your environment variables
// const PRODUCT_ID = process.env.CREEM_PRODUCT_ID; // Replace with your actual product ID

// export async function createCheckoutSession(userId: string): Promise<string> {
//   try {
//     const response = await axios.post(
//       'https://test-api.creem.io/v1/checkouts',
//       {
//         product_id: PRODUCT_ID,
//         request_id: userId, // Use userId to track the payment
//         success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
//       },
//       {
//         headers: { 'x-api-key': CREEM_API_KEY },
//       }
//     );

//     const { checkout_url } = response.data;
//     return checkout_url;
//   } catch (error) {
//     console.error('Error creating checkout session:', error);
//     throw new Error('Failed to create checkout session');
//   }
// }

'use server';

import { NextResponse } from 'next/server';
import { api } from '@/convex/_generated/api';
import { ConvexHttpClient } from 'convex/browser';
import crypto from 'crypto';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const WEBHOOK_SECRET = process.env.CREEM_WEBHOOK_SECRET!;

function verifySignature(payload: string, signature: string): boolean {
  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
  hmac.update(payload, 'utf8'); // Ensure correct encoding
  const computedSignature = hmac.digest('hex');

  console.log('Received Signature:', signature);
  console.log('Computed Signature:', computedSignature);

  return crypto.timingSafeEqual(
    Uint8Array.from(Buffer.from(computedSignature, 'hex')),
    Uint8Array.from(Buffer.from(signature, 'hex'))
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get('x-signature');

    if (!signature || !WEBHOOK_SECRET || !verifySignature(body, signature)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = JSON.parse(body);
    if (payload.eventType !== 'checkout.completed') {
      return NextResponse.json({ message: 'Event not handled' }, { status: 400 });
    }

    const request_id = payload.object.request_id;
    if (!request_id) {
      return NextResponse.json({ error: 'Invalid webhook payload' }, { status: 400 });
    }

    // Upgrade user to Pro in Convex DB
    await convex.mutation(api.users.upgradeToPro, {
      userId: request_id,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}