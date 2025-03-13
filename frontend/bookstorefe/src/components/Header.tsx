// components/Header.tsx
'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Header() {
    const router = useRouter()

    const handleLogin = () => {
        router.push('/login')
    }

    const handleCart = () => {
        // For demonstration, check for a token in localStorage.
        const token = localStorage.getItem('token')
        if (token) {
            router.push('/cart')
        } else {
            router.push('/login')
        }
    }

    return (
        <header className="bg-gradient-to-r from-blue-700 to-purple-700 text-white p-4 shadow-md">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-8">
                    <h1 className="text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:text-white hover:scale-105 transition-all duration-300">
                        Bookstore
                    </h1>
                    <nav>
                        <ul className="flex space-x-4">
                            <li>
                                <Link href="/" className="hover:text-gray-200">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/catalog" className="hover:text-gray-200">
                                    Catalog
                                </Link>
                            </li>
                            <li>
                                <a href="#" className="hover:text-gray-200">
                                    Best Sellers
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-gray-200">
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={handleLogin}
                        className="bg-transparent border border-white px-4 py-2 rounded hover:bg-white hover:text-blue-700 transition"
                    >
                        Login
                    </button>
                    <button
                        onClick={handleCart}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded hover:from-blue-600 hover:to-purple-600 transition"
                    >
                        Cart
                    </button>
                </div>
            </div>
        </header>
    )
}
