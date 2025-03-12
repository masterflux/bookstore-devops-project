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
//         {
//             id: 2,
//             title: '1984',
//             author: 'George Orwell',
//             description: 'A dystopian novel exploring the consequences of a totalitarian regime.',
//             price: 8.99,
//             image: '/images/book2.jpg',
//         },
//         {
//             id: 3,
//             title: 'To Kill a Mockingbird',
//             author: 'Harper Lee',
//             description: 'An inspiring story addressing racial injustice in the American South.',
//             price: 12.99,
//             image: '/images/book3.jpg',
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

export async function GET(request: Request) {
    // In production, set BACKEND_BOOKS_URL in your environment variables.
    const backendUrl = process.env.BACKEND_BOOKS_URL || 'http://localhost:5000/books'
    console.log('%cbackendUrl: ','color: MidnightBlue; background: Aquamarine; font-size: 20px;',backendUrl);

    try {
        const backendRes = await fetch(backendUrl)
        console.log('%cbackendRes: ','color: MidnightBlue; background: Aquamarine; font-size: 20px;',backendRes);
        if (!backendRes.ok) {
            throw new Error('Failed to fetch from backend')
        }
        const data = await backendRes.json()
        return new Response(data)
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch books' }), { status: 500 })
    }
}
