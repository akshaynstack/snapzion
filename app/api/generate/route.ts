import { NextResponse } from 'next/server';
import OpenAI from "openai";

export const dynamic = 'force-dynamic';

// Initialize OpenAI client
const openai = new OpenAI({
  baseURL: process.env.OPENAI_API_BASE_URL,
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {

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

    // Log the entire response from OpenAI
    // console.log('OpenAI API Response:', completion);

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No content in response');
    }

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate image' },
      { status: 500 }
    );
  }
}