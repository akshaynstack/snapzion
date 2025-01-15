import { NextResponse } from 'next/server';
import { currentUser  } from '@clerk/nextjs/server';

export async function GET(req: Request) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ loggedIn: false }, { status: 401 });
  }

  return NextResponse.json({ loggedIn: true, userId: user.id });
}