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
  image: string
}

// Simulate fetching data from a catalog service
async function getBooks(): Promise<Book[]> {
  return [
    {
      id: 1,
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      description: 'A classic novel depicting American society in the 1920s with an elegant narrative style.',
      price: 10.99,
      image: '/images/book1.jpg',
    },
    {
      id: 2,
      title: '1984',
      author: 'George Orwell',
      description: 'A dystopian novel exploring the consequences of a totalitarian regime.',
      price: 8.99,
      image: '/images/book2.jpg',
    },
    {
      id: 3,
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      description: 'An inspiring story addressing racial injustice in the American South.',
      price: 12.99,
      image: '/images/book3.jpg',
    },
  ]
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
