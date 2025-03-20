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