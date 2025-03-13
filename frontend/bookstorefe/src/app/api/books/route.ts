import type { NextRequest, NextResponse } from 'next/server'
// export async function GET(req: NextRequest) {
//     return new Response(JSON.stringify([
//         {
//             id: 1,
//             title: 'The Great Gatsby',
//             author: 'F. Scott Fitzgerald',
//             description: 'A classic novel depicting American society in the 1920s with an elegant narrative style.',
//             price: 10.99,
//             image: '/images/book1.jpg',
//         },
//     ]), {
//         status: 200,
//         headers: { 'Content-Type': 'application/json' },
//     });
// }

export async function POST(req: NextResponse ) {
    const body = await req.json();
    return new Response(JSON.stringify({ message: `Hello, ${body.name}!` }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}

export async function GET(request: NextRequest) {
    // In production, set BACKEND_BOOKS_URL in your environment variables.
    const backendUrl = process.env.BACKEND_BOOKS_URL || 'http://localhost:3001/books'
    console.log('%cbackendUrl: ','color: MidnightBlue; background: Aquamarine; font-size: 20px;',backendUrl);

    try {
        const backendRes = await fetch(backendUrl)
        console.log('%cbackendRes: ','color: MidnightBlue; background: Aquamarine; font-size: 20px;',backendRes);
        if (!backendRes.ok) {
            throw new Error('Failed to fetch from backend')
        }
        const data = await backendRes.json()
        console.log('%cdata: ','color: MidnightBlue; background: Aquamarine; font-size: 20px;',data);
        return new Response(JSON.stringify(data), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            })
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch books' }), { status: 500 })
    }
}
