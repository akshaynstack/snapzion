import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import OpenAI from "openai";

export const dynamic = 'force-dynamic';

const RATE_LIMIT = 100; // for security purposes
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 hours

const userRequests = new Map<string, { count: number; lastReset: number }>();

// Initialize OpenAI client
const openai = new OpenAI({
  baseURL: process.env.OPENAI_API_BASE_URL,
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    // Basic rate limiting
    const headersList = headers();
    const ip = headersList.get('x-forwarded-for') || 'unknown';
    
    const now = Date.now();
    const userLimit = userRequests.get(ip) || { count: 0, lastReset: now };

    if (now - userLimit.lastReset > RATE_LIMIT_WINDOW) {
      userLimit.count = 0;
      userLimit.lastReset = now;
    }

    if (userLimit.count >= RATE_LIMIT) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again tomorrow.' },
        { status: 429 }
      );
    }

    const { prompt } = await req.json();

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

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL_NAME || "flux",
      messages: [{ role: "user", content: prompt }],
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No content in response');
    }

    userLimit.count++;
    userRequests.set(ip, userLimit);

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate image' },
      { status: 500 }
    );
  }
}