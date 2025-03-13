import type { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextResponse ) {
    const body = await req.json();
    return new Response(JSON.stringify({ message: `Hello, ${body.name}!` }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    let backendUrl = process.env.catalogurl || 'http://localhost:3001';
    if (category) {
        backendUrl += `/books/category/${category}`
    } else {
        backendUrl += '/books'
    }
    try {
        const backendRes = await fetch(backendUrl)
        console.log('%cbackendRes: ','color: MidnightBlue; background: Aquamarine; font-size: 20px;',backendRes);
        if (!backendRes.ok) {
            return new Response(JSON.stringify([]), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            })
        }
        const data = await backendRes.json()
        return new Response(JSON.stringify(data), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            })
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch books' }), { status: 500 })
    }
}
