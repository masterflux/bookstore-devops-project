// context/AuthContext.tsx
'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AuthContextType {
    isLoggedIn: boolean
    login: () => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
    children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

    useEffect(() => {
        const token = sessionStorage.getItem('token')
        if (token) {
            setIsLoggedIn(true)
        }
    }, [])

    const login = () => {
        setIsLoggedIn(true)
        sessionStorage.setItem('token', 'logined')
    }

    const logout = () => {
        setIsLoggedIn(false)
        sessionStorage.removeItem('token')
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}


export function useAuth(): AuthContextType {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
