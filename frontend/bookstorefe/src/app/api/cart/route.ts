
const BACKEND_URL = process.env.NEXT_PUBLIC_CART_URL || 'http://localhost:3002';

export async function POST(request: Request) {

    const body = await request.text();

    const backendResponse = await fetch(BACKEND_URL + '/cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body,
    });

    const text = await backendResponse.text();

    return new Response(text, {
        status: backendResponse.status,
        headers: backendResponse.headers,
    });
}
