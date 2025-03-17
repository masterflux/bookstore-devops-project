
const BACKEND_URL = process.env.NEXT_PUBLIC_CART_URL || 'http://localhost:3002';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = await params;

    const backendResponse = await fetch(BACKEND_URL + '/cart/' + id)

    const text = await backendResponse.text();
    
    return new Response(text, {
        status: backendResponse.status,
        headers: backendResponse.headers,
    });

}
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const { id } = await params;
    const body = await request.text();
    const backendResponse = await fetch(BACKEND_URL + '/cart/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body,
    })
    const text = await backendResponse.text();

    return new Response(text, {
        status: backendResponse.status,
        headers: backendResponse.headers,
    });

}
