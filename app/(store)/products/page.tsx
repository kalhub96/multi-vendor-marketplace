"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { products } from "@/data/products"
import { ProductCategory } from "@/types"

const categories: { label: string; value: ProductCategory | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Electronics", value: "electronics" },
  { label: "Clothing", value: "clothing" },
  { label: "Food", value: "food" },
  { label: "Books", value: "books" },
  { label: "Home", value: "home" },
  { label: "Other", value: "other" },
]

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("search") || ""

  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "all">("all")

  // FILTER BY SEARCH QUERY FIRST
  const searchedProducts = searchQuery
    ? products.filter((p) => {
        const query = searchQuery.toLowerCase()
        return (
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
        )
      })
    : products

  // THEN FILTER BY CATEGORY
  const filteredProducts =
    selectedCategory === "all"
      ? searchedProducts
      : searchedProducts.filter((p) => p.category === selectedCategory)

  return (
    <main className="min-h-screen bg-gray-950 text-white">

      {/* PAGE HEADER */}
      <section className="bg-gray-900 py-10 px-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Marketplace</h1>
        <p className="text-gray-400">
          {searchQuery
            ? `Search results for "${searchQuery}"`
            : "Discover products from the best vendors"}
        </p>
      </section>

      {/* CATEGORY FILTER TABS */}
      <section className="bg-gray-900 border-t border-gray-800 px-8 py-4">
        <div className="max-w-6xl mx-auto flex gap-3 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.value
                  ? "bg-green-400 text-gray-900"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* RESULTS COUNT + CLEAR SEARCH */}
      <section className="max-w-6xl mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          <p className="text-gray-400 text-sm">
            Showing {filteredProducts.length} products
          </p>
          {searchQuery && (
            <Link
              href="/products"
              className="text-green-400 text-sm hover:underline"
            >
              Clear search ✕
            </Link>
          )}
        </div>
      </section>

      {/* PRODUCTS GRID */}
      <section className="max-w-6xl mx-auto px-8 pb-16">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-gray-400 mb-2">
              No products found{searchQuery && ` for "${searchQuery}"`}
            </p>
            <p className="text-gray-500 text-sm">
              Try a different search term or category
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="bg-gray-900 rounded-xl overflow-hidden hover:ring-2 hover:ring-green-400 transition-all"
              >
                <div className="bg-gray-800 h-48 flex items-center justify-center">
                  <span className="text-gray-600 text-sm">No Image Yet</span>
                </div>

                <div className="p-4">
                  <span className="text-xs text-green-400 uppercase tracking-wide">
                    {product.category}
                  </span>
                  <h3 className="font-semibold mt-1 mb-1">{product.name}</h3>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-green-400 font-bold">
                      ETB {(product.price * 160).toFixed(2)}
                    </span>
                    <button
                      type="button"
                      className="bg-green-400 text-gray-900 text-sm font-semibold px-3 py-1 rounded-full hover:bg-green-300 transition-colors"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

    </main>
  )
}