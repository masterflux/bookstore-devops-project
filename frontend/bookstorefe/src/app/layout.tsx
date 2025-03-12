// app/layout.tsx
import './globals.css'
import { ReactNode } from 'react'
import Header from '@/components/Header'

export const metadata = {
  title: 'Bookstore',
  description: 'A modern bookstore interface inspired by Amazon Books',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <Header />
        {children}
        <footer className="bg-gradient-to-r from-gray-300 to-gray-400 text-center py-4 mt-8">
          <p className="text-gray-700">
            © {new Date().getFullYear()} Bookstore. All rights reserved.
          </p>
        </footer>
      </body>
    </html>
  )
}
