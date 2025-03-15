// app/catalog/[category]/CategoryPageClient.tsx
"use client";

import { useEffect, useState } from "react";
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

export default function CategoryPageClient({
    category,
}: CategoryPageClientProps) {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!category) return;

        fetch(`/api/books?category=${category}`, {
            cache: "no-store",
        })
            .then((res) => res.json())
            .then((data) => {
                setBooks(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching books: ", error);
                setLoading(false);
            });
    }, [category]);

    if (loading) {
        return (
            <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
                <p className="text-2xl">Loading...</p>
            </div>
        );
    }

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
                {category.charAt(0).toUpperCase() + category.slice(1)} Books
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {books.map((book) => (
                    <BookCard key={book.id} book={book} />
                ))}
            </div>
        </div>
    );
}
