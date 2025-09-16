import { google } from '@ai-sdk/google';
import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { cookies } from 'next/headers';

import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { getDataFromToken } from '@/lib/utils/getDataFromToken';
const sqs = new SQSClient({ region: process.env.REGION });
const USAGE_QUEUE_URL = process.env.AI_USAGE_QUEUE_URL!;
// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const t0 = Date.now();
    const cookieStore = await cookies();

    const token = cookieStore.get('access_token')?.value;
    if (!token) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // 2) Decode userId from token
    const { id: userId } = getDataFromToken(token) || {};
    if (!userId) {
        return new Response(JSON.stringify({ error: 'Invalid token' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const { messages }: { messages: UIMessage[] } = await req.json();

    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
    const promptText = lastUserMsg
        ? lastUserMsg.parts
              ?.map((p: any) => (p?.type === 'text' ? p.text : ''))
              .join('') ?? ''
        : '';

    const modelId = 'gemini-2.0-flash';

    const result = streamText({
        model: google(modelId),
        messages: convertToModelMessages(messages),
        onFinish: async ({ text, usage }) => {
            const latencyMs = Date.now() - t0;
            const payload = {
                user: userId,
                model: modelId,
                prompt: promptText,
                messageCount: messages?.length ?? 0,
                outputPreview: (text ?? '').slice(0, 4000),
                usage,
                latencyMs,
                createdAt: Date.now(),
                source: 'product-form'
            };

            sqs.send(
                new SendMessageCommand({
                    QueueUrl: USAGE_QUEUE_URL,
                    MessageBody: JSON.stringify(payload)
                })
            ).catch((e) => {
                console.error('Failed to send message to SQS', e);
            });
        }
    });

    return result.toUIMessageStreamResponse();
}
