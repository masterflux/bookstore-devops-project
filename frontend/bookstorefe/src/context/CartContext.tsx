'use client'
import { createContext, useContext, useReducer, ReactNode, useCallback } from 'react'

interface CartState {
    quantity: number
}

type CartAction =
    | { type: 'INCREMENT' }
    | { type: 'DECREMENT' }
    | { type: 'SET_QUANTITY'; payload: number }

const initialState: CartState = {
    quantity: 0
}

const cartReducer = (state: CartState, action: CartAction): CartState => {
    switch (action.type) {
        case 'INCREMENT':
            return { quantity: state.quantity + 1 }
        case 'DECREMENT':
            return { quantity: state.quantity - 1 }
        case 'SET_QUANTITY':
            return { quantity: action.payload }
        default:
            return state
    }
}

interface CartContextType {
    quantity: number
    increment: () => void
    decrement: () => void
    setQuantity: (quantity: number) => void
    fetchCartQuantity: (userId: string | null) => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

interface CartProviderProps {
    children: ReactNode
}

function throttle(func: Function, delay: number) {
    let lastCall = 0
    return function (...args: any[]) {
        const now = new Date().getTime()
        if (now - lastCall >= delay) {
            lastCall = now
            return func(...args)
        }
    }
}

export const CartProvider = ({ children }: CartProviderProps) => {
    const [state, dispatch] = useReducer(cartReducer, initialState)

    const increment = useCallback(() => dispatch({ type: 'INCREMENT' }), [])
    const decrement = useCallback(() => dispatch({ type: 'DECREMENT' }), [])

    const setQuantity = useCallback((quantity: number) => {
        dispatch({ type: 'SET_QUANTITY', payload: quantity })
    }, [])

    const fetchCartQuantity = useCallback(async (userId:string|null) => {
        try {
            const res = await fetch((process.env.CART_URL || 'http://localhost:3002') + '/cart/' + userId, {
                method: 'GET',
            })
            if (!res.ok) {
                throw new Error('Failed to fetch cart quantity')
            }
            const data = await res.json();
            const totalQuantity = data.reduce((sum:any, item:any) => sum + item.quantity, 0);
            dispatch({ type: 'SET_QUANTITY', payload: totalQuantity })
        } catch (error) {
            console.error('Error fetching cart quantity:', error)
        }
    }, [])

    return (
        <CartContext.Provider value={{ quantity: state.quantity, increment, decrement, setQuantity, fetchCartQuantity }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = (): CartContextType => {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}
