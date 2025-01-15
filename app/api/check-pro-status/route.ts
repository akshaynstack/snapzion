import { NextResponse } from 'next/server';
import { currentUser  } from '@clerk/nextjs/server'; // Ensure this path is correct
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

export async function GET(req: Request) {
  const user = await currentUser (); // No arguments needed here
  if (!user) {
    return NextResponse.json({ isPro: false }, { status: 401 });
  }

  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const convexUser  = await convex.query(api.users.getUser , { userId: user.id });

  return NextResponse.json({ isPro: convexUser ?.isPro });
}