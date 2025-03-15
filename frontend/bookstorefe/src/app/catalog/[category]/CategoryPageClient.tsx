import { BookCard } from "../../../components/BookCard";

interface Book {
    id: number
    title: string
    author: string
    description: string
    price: number
    imageurl: string
}

interface CategoryPageClientProps {
    category: string;
}

// Fetch books from our API layer
async function getBooks(category:string): Promise<Book[]> {
    // Adjust the URL as needed; a relative URL works on the server side.
    const res = await fetch((process.env.URL || 'http://localhost:3000') + `/api/books?category=${category}`, {
        cache: "no-store",
    })
    if (!res.ok) {
        return [];
    }
    return res.json()
}

export default async function CategoryPageClient({
    category,
}: CategoryPageClientProps) {

    let books: Book[] = [];
    if (category) {
        books = await getBooks(category)
    }

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
                {category.charAt(0).toUpperCase() + category.slice(1)} Books
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {books.map((book: Book) => (
                    <BookCard key={book.id} book={book} />
                ))}
            </div>
        </div>
    );
}
