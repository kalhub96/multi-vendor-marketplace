"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, Product, ProductCategory } from "@/types"
import { products as mockProducts } from "@/data/products"

export default function VendorProductsPage() {
    const router = useRouter()
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [checking, setChecking] = useState(true)
    const [products, setProducts] = useState<Product[]>([])
    const [showForm, setShowForm] = useState(false)

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [stock, setStock] = useState("")
    const [price, setPrice] = useState("")
    const [category, setCategory] = useState<ProductCategory>("electronics")
    const [fromError, setFormError] = useState("") 

    useEffect(() => {
        const stored = localStorage.getItem("user")
        if (!stored) {
            router.push("/login")
            return
        }
        const user: User = JSON.parse(stored)
        if (user.role !== "vendor") {
            router.push("/")
            return
        }
        setCurrentUser(user)
        setProducts(mockProducts.filter((p) => p.vendorId === "vendor_1"))
        setChecking(false)
    }, [router])

    if (checking) {
        return(
            <main className="text-white bg-gray-950 flex items-center justify-center min-h-screen">
                <p className="text-gray-400">Loading...</p>
            </main>
        )
    }

    const handleAddProduct = () => {
        setFormError("")

        if (!name || !description || !price || !stock) {
            setFormError("Please fill in all fields")
            return
        }

        if (isNaN(Number(price)) || Number(price) <= 0) {
            setFormError("Price must be a valid number greater than 0.")
            return
        }

        if (isNaN(Number(stock)) || Number(stock) < 0) {
            setFormError("Stock must be a valid number.")
            return
        }

        const newProduct: Product = {
            id: `product_${Date.now()}`,
            name,
            vendorId: "vendor_1",
            description,
            price: Number(price)/160,
            image: "/products/placeholder.jpg",
            category,
            stock: Number(stock),
            createdAt: new Date().toISOString(),
        }

        setProducts((prev) => [...prev, newProduct])

        setName("")
        setDescription("")
        setPrice("")
        setStock("")
        setCategory("electronics")
        setShowForm(false)
    }

    const handleDelete = (productId: string) => {
        setProducts((prev) => prev.filter((p) => p.id !== productId))
    }

    return (
        <main className="text-white bg-gray-950 min-h-screen">

            /* Header*/
            <section className="bg-gray-900 px-8 py-10">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div>
                        <Link
                            href="/vendor/dashboard"
                            className="text-gray-400 hover:text-white text-sm transition-colors">
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
                    className="bg-green-400 text-gray-900 font-semibold px-6 py-3 rounded-full hover:bg-green-300 transition-colors">
                        {showForm ? "Cancel" : "+ Add Product"}
                    </button>
                </div>
            </section>
            <section className="max-w-6xl mx-auto px-8 py-10">
                
            </section>
        </main>
    )
}
