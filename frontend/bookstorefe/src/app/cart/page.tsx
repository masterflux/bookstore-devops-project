'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'

interface CartItem {
    id: number
    bookId: number
    title: string
    author: string
    price: number
    quantity: number
    totalPrice: number
    stock: number
}

export default function CartPage() {
    const [cart, setCart] = useState<CartItem[]>([])
    const [totalAmount, setTotalAmount] = useState(0)
    const router = useRouter()
    const { isLoggedIn } = useAuth()
    const { quantity, setQuantity, fetchCartQuantity } = useCart()

    // Fetch initial cart data
    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login')
        } else {
            fetch('http://localhost:3002/cart/' + sessionStorage.getItem('token'), {
                method: 'GET',
            }).then((res) => res.json())
                .then((data) => {
                    console.log('%cdata: ', 'color: MidnightBlue; background: Aquamarine; font-size: 20px;', data);
                    setCart(data)
                    calculateTotal(data)
                })
        }
    }, [])


    // Update quantity
    const updateQuantity = async (id: number, change: number) => {
        const updatedCart = cart.map((item) => {
            if (item.id === id) {
                const newQuantity = item.quantity + change
                if (newQuantity > 0 && newQuantity <= item.stock) {
                    item.quantity = newQuantity
                    item.totalPrice = item.quantity * item.price
                }
            }
            return item
        })

        setCart(updatedCart)
        calculateTotal(updatedCart)
        const totalQuantity = updatedCart.reduce((sum: any, item: any) => sum + item.quantity, 0);
        setQuantity(totalQuantity)

        await fetch(`http://localhost:3002/cart/${updatedCart.find((item) => item.id === id)?.bookId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                quantity: updatedCart.find((item) => item.id === id)?.quantity,
                userId: sessionStorage.getItem('token')
            }),
        })
    }

    // Calculate total amount
    const calculateTotal = (items: CartItem[]) => {
        const total = items.reduce((sum, item) => sum + item.totalPrice, 0)
        setTotalAmount(total)
    }

    const clearCart = async () => {
        await fetch('http://localhost:3002/cart/clear/' + sessionStorage.getItem('token'), { method: 'DELETE' })
        setCart([])
        setTotalAmount(0)
        setQuantity(0)
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl">
                <div className="absolute t-4 l-4  flex justify-center">
                    <button
                        onClick={clearCart}
                        className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600">
                        Clear Cart
                    </button>
                </div>
                <h1 className="text-2xl font-bold mb-6 text-center">Shopping Cart</h1>

                {cart.length === 0 ? (
                    <p className="text-center text-gray-600">Your cart is empty.</p>
                ) : (
                    <div>
                        {cart.map((item) => (
                            <div key={item.id} className="flex items-center justify-between border-b py-4">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">{item.title}</h2>
                                    <p className="text-gray-600 text-sm">by {item.author}</p>
                                    <p className="text-gray-800 font-medium">${item.price.toFixed(2)} each</p>
                                    <p className="text-sm text-gray-500">Stock: {item.stock}</p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => updateQuantity(item.id, -1)}
                                        disabled={item.quantity <= 1}
                                        className="px-3 py-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
                                    >
                                        −
                                    </button>
                                    <span className="text-lg font-semibold">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, 1)}
                                        disabled={item.quantity >= item.stock}
                                        className="px-3 py-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        ))}

                        <div className="mt-6 flex justify-between items-center">
                            <h2 className="text-xl font-bold">Total: ${totalAmount.toFixed(2)}</h2>
                            <button className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700">
                                Checkout
                            </button>
                        </div>

                    </div>
                )}
            </div>
        </div>
    )
}