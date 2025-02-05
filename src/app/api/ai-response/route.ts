// src/app/api/ai-response/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return NextResponse.json({ error: 'Messages are required and should be an array' }, { status: 400 });
    }

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.ANTHROPIC_API_KEY || '',
                'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 1024,
                messages: messages,
            }),
        });

        const data = await response.json();
        console.log(data);

        if (!response.ok) {
            console.error('Error from Anthropic API:', data);
            return NextResponse.json({ error: 'Error fetching AI response' }, { status: 500 });
        }

        // Extract the AI's response text
        const aiContent = data.content[0]?.text || 'No response from AI';

        return NextResponse.json({ content: aiContent });
    } catch (error) {
        console.error('Error fetching AI response:', error);
        return NextResponse.json({ error: 'Error fetching AI response' }, { status: 500 });
    }
}