// app/layout.tsx
import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'Bookstore',
  description: 'A modern bookstore interface inspired by Amazon Books',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <header className="bg-gradient-to-r from-blue-700 to-purple-700 text-white p-4 shadow-md">
          <div className="container mx-auto flex items-center justify-between">
            <h1 className="text-3xl font-bold">Bookstore</h1>
            <nav>
              <ul className="flex space-x-4">
                <li>
                  <a href="#" className="hover:text-gray-200">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-200">
                    Categories
                  </a>
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
        </header>
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
