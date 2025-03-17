const BACKEND_URL = process.env.NEXT_PUBLIC_CART_URL || 'http://localhost:3002';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const { id } = await params;

    const backendResponse = await fetch(BACKEND_URL + '/cart/clear/' + id, { method: 'DELETE' })

    const text = await backendResponse.text();

    return new Response(text, {
        status: backendResponse.status,
        headers: backendResponse.headers,
    });

}