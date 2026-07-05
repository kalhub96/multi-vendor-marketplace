"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, Product, ProductCategory } from "@/types"
import { products as mockProducts } from "@/data/products"
import { useAuth } from "@/lib/auth-context"

export default function VendorProductsPage() {
  const router = useRouter()
  const { loaded } = useAuth()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [checking, setChecking] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [showForm, setShowForm] = useState(false)

  // FORM STATE
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState("")
  const [category, setCategory] = useState<ProductCategory>("electronics")
  const [formError, setFormError] = useState("")

  // AUTH CHECK
  useEffect(() => {
    if (!loaded) return
    if (!currentUser) {
      router.push("/login")
      return
    }
    if (currentUser.role !== "vendor"){
      router.push("/")
    }
    setProducts(mockProducts.filter((p) => p.vendorId === "vendor_1"))
  }, [currentUser, loaded, router])

  if (!loaded || !currentUser) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </main>
    )
  }

  // ADD PRODUCT HANDLER
  const handleAddProduct = () => {
    setFormError("")

    // VALIDATION
    if (!name || !description || !price || !stock) {
      setFormError("Please fill in all fields")
      return
    }

    if (isNaN(Number(price)) || Number(price) <= 0) {
      setFormError("Price must be a valid number")
      return
    }

    if (isNaN(Number(stock)) || Number(stock) < 0) {
      setFormError("Stock must be a valid number")
      return
    }

    // CREATE NEW PRODUCT
    const newProduct: Product = {
      id: `product_${Date.now()}`,
      vendorId: "vendor_1",
      name,
      description,
      price: Number(price) / 160,
      image: "/products/placeholder.jpg",
      category,
      stock: Number(stock),
      createdAt: new Date().toISOString(),
    }

    setProducts((prev) => [newProduct, ...prev])

    // RESET FORM
    setName("")
    setDescription("")
    setPrice("")
    setStock("")
    setCategory("electronics")
    setShowForm(false)
  }

  // DELETE PRODUCT HANDLER
  const handleDelete = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId))
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white">

      {/* HEADER */}
      <section className="bg-gray-900 py-10 px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <Link
              href="/vendor/dashboard"
              className="text-gray-400 hover:text-green-400 text-sm transition-colors"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold mt-2">Manage Products</h1>
            <p className="text-gray-400 mt-1">
              {products.length} products in your store
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="bg-green-400 text-gray-900 font-semibold px-6 py-3 rounded-full hover:bg-green-300 transition-colors"
          >
            {showForm ? "Cancel" : "+ Add Product"}
          </button>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-8 py-10">

        {/* ADD PRODUCT FORM */}
        {showForm && (
          <div className="bg-gray-900 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold mb-6">Add New Product</h2>

            {formError && (
              <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-4 text-sm">
                {formError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* NAME */}
              <div>
                <label className="text-sm text-gray-400 mb-1 block">
                  Product Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Wireless Headphones"
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-500"
                />
              </div>

              {/* CATEGORY */}
              <div>
                <label className="text-sm text-gray-400 mb-1 block">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as ProductCategory)
                  }
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  <option value="electronics">Electronics</option>
                  <option value="clothing">Clothing</option>
                  <option value="food">Food</option>
                  <option value="books">Books</option>
                  <option value="home">Home</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* PRICE */}
              <div>
                <label className="text-sm text-gray-400 mb-1 block">
                  Price (ETB)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 1500"
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-500"
                />
              </div>

              {/* STOCK */}
              <div>
                <label className="text-sm text-gray-400 mb-1 block">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="e.g. 50"
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-500"
                />
              </div>

              {/* DESCRIPTION */}
              <div className="md:col-span-2">
                <label className="text-sm text-gray-400 mb-1 block">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your product..."
                  rows={3}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-500 resize-none"
                />
              </div>

            </div>

            <button
              type="button"
              onClick={handleAddProduct}
              className="mt-6 bg-green-400 text-gray-900 font-bold px-8 py-3 rounded-full hover:bg-green-300 transition-colors"
            >
              Add Product
            </button>
          </div>
        )}

        {/* PRODUCTS TABLE */}
        <div className="bg-gray-900 rounded-xl overflow-hidden">

          {/* TABLE HEADER */}
          <div className="grid grid-cols-5 gap-4 px-6 py-4 bg-gray-800 text-gray-400 text-sm font-medium">
            <span className="col-span-2">Product</span>
            <span>Category</span>
            <span>Price</span>
            <span>Stock</span>
          </div>

          {/* TABLE ROWS */}
          {products.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              No products yet — add your first one!
            </div>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="grid grid-cols-5 gap-4 px-6 py-4 border-t border-gray-800 items-center hover:bg-gray-800/50 transition-colors"
              >
                {/* NAME + DESCRIPTION */}
                <div className="col-span-2">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-gray-400 text-sm line-clamp-1">
                    {product.description}
                  </p>
                </div>

                {/* CATEGORY */}
                <span className="text-green-400 text-sm capitalize">
                  {product.category}
                </span>

                {/* PRICE */}
                <span className="font-medium">
                  ETB {(product.price * 160).toFixed(2)}
                </span>

                {/* STOCK + DELETE */}
                <div className="flex items-center justify-between">
                  <span
                    className={
                      product.stock > 0
                        ? "text-white"
                        : "text-red-400"
                    }
                  >
                    {product.stock}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDelete(product.id)}
                    className="text-red-400 hover:text-red-300 text-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </section>
    </main>
  )
}