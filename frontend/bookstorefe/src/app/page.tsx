// app/page.tsx
import HeroSection from '../components/HeroSection'
import { BookCard } from '../components/BookCard'
export const revalidate = 60

interface Book {
  id: number
  title: string
  author: string
  description: string
  price: number
  imageurl: string
}

// Fetch books from our API layer
async function getBooks(): Promise<Book[]> {
  // Adjust the URL as needed; a relative URL works on the server side.
  const res = await fetch((process.env.URL || 'http://localhost:3000') + '/api/books', { cache: 'no-store' })  if (!res.ok) {
    // Optionally, add error handling here.
    return []
  }
  return res.json()
}


export default async function Home() {
  const books = await getBooks()

  return (
    <>
      <HeroSection />
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Book List</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </main>
    </>
  )
}
