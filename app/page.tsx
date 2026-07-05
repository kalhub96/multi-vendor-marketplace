import Link from "next/link"
import { products } from "@/data/products"

export default function Home() {
  return (
    <main>
      <section className="bg-emerald-500 text-white py-20 px-8 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to MultiMart
        </h1>
        <p className="text-lg mb-8">
          Shop from the best vendors all in one place
        </p>
        <Link
          href="/products"
          className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-full hover:bg-emerald-300">
            Shop Now
          </Link>
      </section>
      
      <section className="py-16 px-8">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <div className="bg-gray-100 h-48 rounded-md mb-4 flex items-center justify-center">
                <span className="text-gray-400">No Image Yet</span>
              </div>
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <p className="text-gray-500 text-sm mb-2">{product.description}</p>
              <p className="text-blue-600 font-bold">${product.price}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}