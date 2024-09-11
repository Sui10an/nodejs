// src/routes/api/countup/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { count } from '$lib';
import { io } from '$lib';

export const GET: RequestHandler = async () => {
    const stream = new ReadableStream({
        start(controller) {
            count.subscribe(value => {
                controller.enqueue(`data: ${JSON.stringify({ count: value })}\n\n`)
            })
        }
    })

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        }
    })
};

export const POST: RequestHandler = async ({ request }) => {
    const data = await request.json();
    console.log('[/api/countup] Received data:', data);

    if (data.value === 'countup') {
        count.update(n => n + 1);
    }

    return new Response(JSON.stringify({ status: 200, message: 'countup' }), {
        headers: { 'Content-Type': 'application/json' }
    });
};
