"use client"

import { useState } from "react"
import Link from "next/link"
import { use } from "react"
import { products } from "@/data/products"
import { vendors } from "@/data/users"
import { CartItem } from "@/types"

export default function ProductDetailPage({
    params,
}:{
    params: Promise<{ id: string}> 
}) {
    const { id } = use(params)
    const [quantity, setQuantity] = useState(1)
    const [added, setAdded] = useState(false)

    //find the product id
    const product = products.find((p) => p.id === id)

    //find the vender who owns the product
    const vender = vendors.find((v) => v.id === product?.vendorId)

    //error if the product is not found
    if (!product){
        return (
            <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-4"> Product Not Found</h1>
                    <Link 
                    href="/products"
                    className="text-green-400 hover:underline"
                    >
                         Back to Marketplace 
                    </Link>
                </div>
            </main>
        )
    }

    // add to cart handler
    const handleAddToCart = () => {
        // get existing cart from localstorage
        const existingCart: CartItem[] = JSON.parse(
            localStorage.getItem("cart") || "[]"
        )

        //check if the product is already in cart
        const existingItem = existingCart.find(
            (item) => item.product.id === product.id
        )

        if (existingItem) {
            // if exists increase quality
            existingItem.quantity += quantity
            localStorage.setItem("cart",JSON.stringify(existingCart))
        } else {

            const newItem: CartItem = { product, quantity }
            localStorage.setItem(
                "cart",
                JSON.stringify([...existingCart, newItem])
            )
        }

        // show added comfermation
        setAdded(true)
        setTimeout(() => setAdded(false), 2000)
    }

    return (
        <main className="min-h-screen bg-gray-950 text-white">
            <div className="max-w-6xl mx-auto px-8 py-6">
                <Link href="/products"
                className="text-gray-400 hover:text-green-400 transition-colors text-sm">
                    ← Back to Marketplace
                </Link>
            </div>

            <section className="max-w-6xl mx-auto px-8 pb-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                    <div className="bg-gray-800 rounded-2xl h-96 flex items-center justify-center">
                        <span className="text-gray-600">No Image Yet</span>
                    </div>

                    <div className="flex flex-col justify-center">
                        <span className="text-green-400 text-sm uppercase tracking-wide mb-2">
                            {product.category}
                        </span>
                        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

                        <p className="text-4xl font-bold text-green-400 mb-4"> 
                            ETB {(product.price * 160).toFixed(2)}
                        </p>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            {product.description}
                        </p>

                        <p className="text-sm mb-6">
                            {product.stock > 0 ? (
                                <span className="text-green-400">
                                    ✓ In Stock ({product.stock} available)
                                </span>
                            ):(
                                <span className="text-red-400">✗ Out of Stock</span>
                            )}
                        </p>

                        {vender && (
                            <p className="text-sm text-gray-400 mb-6">
                                Sold by{" "}
                                <span className="text-white font-medium">
                                    {vender.storeName}
                                </span>
                            </p>
                        )}

                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-gray-400 text-sm">Quantity:</span>
                            <div className="flex items-center gap-3 bg-gray-800 rounded-full px-4 py-2">
                                <button
                                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                className="text-gray-400 hover:text-white font-bold test-lg"
                                >
                                    −
                                </button>
                                <span className="w-6 text-center font-semibold">
                                    {quantity}
                                </span>
                                <button
                                onClick={() =>
                                    setQuantity((q) => Math.min(product.stock, q + 1))
                                }
                                className="text-gray-400 hover:text-white font-bold text-lg"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        className={`w-full py-4 rounded-full font-bold text-lg transition-all ${
                        added
                        ? "bg-gray-600 text-white"
                        : "bg-green-400 text-gray-900 hover:bg-green-300"
                        }`}
                        >
                            {added ? "✓ Added to Cart!" : "Add to Cart"}
                        </button>
                    </div>
                </div>
            </section>
        </main>
    )
}