// components/BookCard.tsx
import Image from 'next/image'

interface Book {
    id: number
    title: string
    author: string
    description: string
    price: number
    image: string
}

interface BookCardProps {
    book: Book
}

export function BookCard({ book }: BookCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 overflow-hidden">
            <div className="relative h-64 w-full">
                <Image src={book.image} alt={book.title} fill style={{ objectFit: 'cover' }} />
            </div>
            <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{book.title}</h3>
                <p className="text-gray-600 text-sm">by {book.author}</p>
                <p className="mt-2 text-gray-700 text-sm">{book.description}</p>
                <p className="mt-4 font-semibold text-lg">${book.price}</p>
                <button className="mt-4 w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded hover:from-blue-600 hover:to-purple-600 transition">
                    Add to Cart
                </button>
            </div>
        </div>
    )
}
