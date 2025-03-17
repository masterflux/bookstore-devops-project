'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { isLoggedIn, login, logout } = useAuth()

  const handleSubmit = async  (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const loginfc = async (username: any, password: any) => {
      try {
        const response = await fetch((window.origin + '/api') + '/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        return data

      } catch (error) {
        console.error('Error during login:', error);
      }
    };

    // 调用登录函数
    const { success, userId } = await loginfc(username, password);

    if (success) {
      login(userId)
      router.push('/');
    }

  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="p-8 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter username"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded hover:from-blue-600 hover:to-purple-600 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}
