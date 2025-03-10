// components/HeroSection.tsx
import Image from 'next/image'

export default function HeroSection() {
    return (
        <section
            className="relative bg-cover bg-center h-96"
            style={{ backgroundImage: "url('/images/hero.jpg')" }}
        >
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="relative z-10 flex items-center justify-center h-full">
                <div className="text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white">
                        Discover Your Next Favorite Book
                    </h2>
                    <p className="mt-4 text-lg text-gray-200">
                        Explore a wide selection of books and find your perfect read
                    </p>
                    <a
                        href="#"
                        className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-500 transition"
                    >
                        Shop Now
                    </a>
                </div>
            </div>
        </section>
    )
}
