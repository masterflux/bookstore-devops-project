'use client'
import Image from 'next/image'
import BlankImage from '../../public/images/Books.svg'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

interface Book {
    id: number
    title: string
    author: string
    description: string
    price: number
    imageurl: string
}

interface BookCardProps {
    book: Book
}

export function BookCard({ book }: BookCardProps) {
    const router = useRouter()
    const { isLoggedIn } = useAuth()
    const { increment } = useCart()

    const handleAddToCart = async () => {

        if (!isLoggedIn) {
            router.push('/login')
            return
        }

        try {
            const response = await fetch((window.origin + '/api') + '/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: sessionStorage.getItem('token'),
                    bookId: book.id,
                    quantity:1
                }),
            });

            increment()
        } catch (error) {
            console.error('Error adding book to cart:', error)
        }
    }
    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 overflow-hidden">
            <div className="relative h-60 w-full">
                <div className="relative w-60 h-60 mx-auto my-4 p-4 bg-white rounded shadow">
                    <Image
                        src={book.imageurl || BlankImage}
                        alt={book.title}
                        layout="fill"  // To make sure the image fills the container
                        objectFit="cover"  // To ensure the image doesn't stretch but is cropped to fit the container
                        className="rounded-lg"  // Optional, if you want to round the corners of the image
                    />
                </div>
            </div>
            <div className="p-4">
                <h3 className="text-xl font-bold mb-2 truncate">{book.title}</h3>
                <p className="text-gray-600 text-sm">by {book.author}</p>
                {/* <p className="mt-2 text-gray-700 text-sm">{book.description}</p> */}
                <p className="mt-4 font-semibold text-lg">${book.price}</p>
                <button
                    onClick={handleAddToCart}
                    className="mt-4 w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded hover:from-blue-600 hover:to-purple-600 transition">
                    Add to Cart
                </button>
            </div>
        </div>
    )
}
