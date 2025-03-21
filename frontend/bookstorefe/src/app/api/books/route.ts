
export async function GET(request: Request) {
    try {
        const category = request.url.split('?')[1]?.split('category=')[1];
        let backendUrl = process.env.NEXT_PUBLIC_CATALOG_URL || 'http://localhost:3001';
        if (category) {
            backendUrl += `/books/category/${category}`
        } else {
            backendUrl += '/books'
        }

        const backendRes = await fetch(backendUrl)
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
        console.log(error);
        return new Response(JSON.stringify([]), { status: 500 })
    }
}
