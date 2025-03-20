import { NextResponse } from 'next/server';
import OpenAI from "openai";
import { currentUser } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

export const dynamic = 'force-dynamic';

// Initialize OpenAI client
const openai = new OpenAI({
  baseURL: process.env.OPENAI_API_BASE_URL,
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    const convexUser = await convex.query(api.users.getUser, {
      userId: user?.id || "",
    });
    const isPro = convexUser?.isPro || false;
    const { prompt } = await req.json();

    if (!isPro) {
      return NextResponse.json(
        { error: 'Only Pro users can generate images' },
        { status: 403 }
      );
    }

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is missing' },
        { status: 500 }
      );
    }

    // Make the API request
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL_NAME || "Image-Generator",
      messages: [{ role: "user", content: prompt }],
    });


    console.log(completion);

    // Convert the entire response to plain text
    const responseText = JSON.stringify(completion);

    // Extract and sanitize URLs
    const urlRegex = /(https?:\/\/[^\s)"]+)/g;
    const rawUrls = responseText.match(urlRegex) || [];
    const sanitizedUrls = rawUrls.map(url => url.replace(/[\\)"]/g, ''));

    return NextResponse.json({ urls: sanitizedUrls });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process the request' },
      { status: 500 }
    );
  }
}