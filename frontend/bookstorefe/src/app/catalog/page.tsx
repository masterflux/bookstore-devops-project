import Link from 'next/link'
import Image from 'next/image'
import Fiction from '../../../public/images/fiction.jpeg'
import Science from '../../../public/images/science.jpeg'
import History from '../../../public/images/history.jpeg'

export default function CatalogPage() {
    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
                Bookstore Catalog
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {/* Fiction Category */}
                <div className="group relative overflow-hidden rounded-lg shadow-lg bg-white hover:bg-green-100 transition-all duration-300">
                    <Link href="/catalog/fiction">
                        <div className="cursor-pointer">
                            <div className="relative h-48 w-full">
                                <Image
                                    src={Fiction}
                                    alt="Fiction"
                                    layout="fill"
                                    objectFit="cover"
                                    className="transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>
                            <div className="p-4 text-center">
                                <span className="text-2xl font-semibold text-green-600">
                                    Fiction
                                </span>
                            </div>
                        </div>
                    </Link>
                </div>
                {/* Science Category */}
                <div className="group relative overflow-hidden rounded-lg shadow-lg bg-white hover:bg-green-100 transition-all duration-300">
                    <Link href="/catalog/science">
                        <div className="cursor-pointer">
                            <div className="relative h-48 w-full">
                                <Image
                                    src={Science}
                                    alt="Science"
                                    layout="fill"
                                    objectFit="cover"
                                    className="transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>
                            <div className="p-4 text-center">
                                <span className="text-2xl font-semibold text-green-600">
                                    Science
                                </span>
                            </div>
                        </div>
                    </Link>
                </div>
                {/* History Category */}
                <div className="group relative overflow-hidden rounded-lg shadow-lg bg-white hover:bg-green-100 transition-all duration-300">
                    <Link href="/catalog/history">
                        <div className="cursor-pointer">
                            <div className="relative h-48 w-full">
                                <Image
                                    src={History}
                                    alt="History"
                                    layout="fill"
                                    objectFit="cover"
                                    className="transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>
                            <div className="p-4 text-center">
                                <span className="text-2xl font-semibold text-green-600">
                                    History
                                </span>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}
