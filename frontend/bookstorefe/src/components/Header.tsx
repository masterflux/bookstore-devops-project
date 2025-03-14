'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../components/AuthContext'
import { useCart } from '../components/CartContext'
import GlobeImage from '../../public/globe.svg'
import AvatarImage from '../../public/images/avatar.svg'
import Image from 'next/image'


export default function Header() {
    const router = useRouter()
    const { isLoggedIn, login, logout } = useAuth()
    const { quantity, setQuantity, fetchCartQuantity } = useCart()

    const handleLogin = () => {
        router.push('/login')
    }
    const handleLogout = () => {
        logout()
        setQuantity(0)
    }

    const handleCart = () => {
        router.push('/cart')
    }
    useEffect(() => {
        isLoggedIn && fetchCartQuantity(sessionStorage.getItem('token'))
    }, [isLoggedIn])

    return (
        <header className="bg-gradient-to-r from-blue-700 to-purple-700 text-white p-4 shadow-md">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-8">
                    <Link href="/" className="text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:text-white hover:scale-105 transition-all duration-300">
                        Bookstore
                    </Link>
                    <nav>
                        <ul className="flex space-x-4">
                            <li>
                                <Link href="/" className="font-bold hover:text-gray-200">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/catalog" className="font-bold hover:text-gray-200">
                                    Catalog
                                </Link>
                            </li>
                            <li>
                                <a href="#" onClick={handleCart} className="font-bold hover:text-gray-200 relative">
                                    Cart
                                    {quantity > 0 && (
                                        <span className="absolute top-[-12px] right-[-23px] bg-red-500 text-white text-xs rounded-full px-2 py-1">
                                            {quantity}
                                        </span>
                                    )}
                                </a>
                            </li>
                            {/* <li>
                                <a href="#" className="hover:text-gray-200">
                                    Best Sellers
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-gray-200">
                                    Contact
                                </a>
                            </li> */}
                        </ul>
                    </nav>
                </div>
                <div className="flex items-center space-x-4">
                    {!isLoggedIn ? (
                        <button
                            onClick={handleLogin}
                            className="bg-transparent border border-white px-4 py-2 rounded hover:bg-white hover:text-blue-700 transition"
                        >
                            Login
                        </button>
                    ) : (
                        <button
                            onClick={handleLogout}
                            className="bg-transparent border border-white px-4 py-2 rounded hover:bg-white hover:text-blue-700 transition"
                        >
                            Logout
                        </button>
                    ) }
                    {isLoggedIn ? (
                        <Image
                            src={AvatarImage}
                            alt={"User Avatar"}
                            objectFit="cover"  
                            className="w-10 h-10 rounded-full border-2 border-white"  
                        />
                    ) : (
                            <Image
                                src={GlobeImage}
                                alt={"User Avatar"}
                                objectFit="cover"
                                className="w-10 h-10 rounded-full border-2 border-white"
                        />
                    )}
                </div>
            </div>
        </header>
    )
}
