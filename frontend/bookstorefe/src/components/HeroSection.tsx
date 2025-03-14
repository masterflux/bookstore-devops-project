// components/HeroSection.tsx
import Image from 'next/image'
import Link from 'next/link'

export default function HeroSection() {
    return (
        <section
            className="relative bg-cover bg-center h-96"
            style={{ backgroundImage: "url('/images/manybooks.jpeg')" }}
        >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-70"></div>
            <div className="relative z-10 flex items-center justify-center h-full">
                <div className="text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white">
                        Discover Your Next Favorite Book
                    </h2>
                    <p className="mt-4 text-lg text-gray-50">
                        Explore a wide selection of books and find your perfect read
                    </p>
                    <Link
                        href="/catalog"
                        className="mt-6 inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded hover:from-blue-600 hover:to-purple-600 transition"
                    >
                        Shop Now
                    </Link>
                </div>
            </div>
        </section>
    )
}
