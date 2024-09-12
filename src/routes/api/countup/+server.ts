// src/routes/api/countup/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { count } from '$lib';

export const GET: RequestHandler = async () => {
    let streameClosed = false

    const stream = new ReadableStream({
        start(controller) {
            const send = (value: number) => {
                if (!streameClosed) {
                    const message = `data: ${JSON.stringify({ count: value })}\n\n`;
                    try {
                        controller.enqueue(message);
                    } catch (err) {
                        console.error("Error enqueuing message:", err);
                    }
                } else {
                    console.log("stream is already closed")
                }
            };

            const unsubscribe = count.subscribe(value => {
                send(value);
            });

            const keepAliveInterval = setInterval(() => {
                controller.enqueue(': keep-alive\n\n')
            }, 15000)

            controller.close = () => {
                unsubscribe()
                clearInterval(keepAliveInterval)
            };
        }
    })

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*'
        }
    })
};

//
export const POST: RequestHandler = async ({ request }) => {
    const data = await request.json();
    console.log('[/api/countup] Received data:', data);

    if (data.value === '*') {
        count.update(n => n + 1);
    }

    return new Response(JSON.stringify({ status: 200, message: '*' }), {
        headers: { 'Content-Type': 'application/json' }
    });
};
