'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuth } from '../../components/AuthContext'

interface CartItem {
    id: number
    title: string
    quantity: number
    price: number
}

export default function CartPage() {
    const router = useRouter()
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const { isLoggedIn } = useAuth()

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login')
        } else {
            // Simulate fetching cart items (empty for now).
            setCartItems([])
        }
    }, [router])

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-6 text-center">Your Cart</h2>
                {cartItems.length === 0 ? (
                    <p className="text-center text-gray-600">Your cart is empty.</p>
                ) : (
                    <div className="space-y-4">
                        {cartItems.map((item) => (
                            <div key={item.id} className="p-4 bg-white rounded shadow">
                                <h3 className="text-xl font-bold">{item.title}</h3>
                                <p>
                                    Quantity: {item.quantity} | Price: ${item.price}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
