"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { use } from "react"
import { vendors } from "@/data/users"
import { useProducts } from "@/lib/products-context"
import { useOrders } from "@/lib/orders-context"
import { useCart } from "@/lib/cart-context"
import toast from "react-hot-toast"
import { useRatings } from "@/lib/ratings-context"
import { useUsers } from "@/lib/users-context"
import { User } from "@/types"
import StarRating from "@/components/star-rating"

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [mlRecommendations, setMlRecommendations] = useState<string[]>([])
  const [mlLoading, setMlLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  // RATING FORM STATE
  const [selectedStars, setSelectedStars] = useState(0)
  const [hoveredStars, setHoveredStars] = useState(0)
  const [comment, setComment] = useState("")
  const [ratingSubmitted, setRatingSubmitted] = useState(false)

  const { addToCart } = useCart()
  const { products } = useProducts()
  const { getUserById } = useUsers()
  const { orders } = useOrders()
  
  const liveUser = currentUser ? getUserById(currentUser.id) : undefined
  const isSuspended = liveUser?.status === "suspended"
  
  const {
    getProductRatings,
    getProductAverage,
    hasUserRated,
    addRating,
  } = useRatings()

  // GET CURRENT USER FROM LOCALSTORAGE
  useEffect(() => {
    const stored = localStorage.getItem("currentUser")
    if (stored) setCurrentUser(JSON.parse(stored))
  }, [])

// FETCH ML RECOMMENDATIONS FROM PYTHON API
useEffect(() => {
  if (!currentUser) {
    setMlLoading(false)
    return
  }

  const fetchMlRecommendations = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/recommendations/${currentUser.id}`
      )

      if (!response.ok) {
        throw new Error("Failed to fetch recommendations")
      }

      const data = await response.json()
      setMlRecommendations(data.recommended_product_ids)
    } catch (error) {
      console.log("ML server not reachable — skipping ML recommendations", error)
      setMlRecommendations([])
    } finally {
      setMlLoading(false)
    }
  }

  fetchMlRecommendations()
}, [currentUser])

  const product = products.find((p) => p.id === id)
  const vendor = vendors.find((v) => v.id === product?.vendorId)

  // GET RECOMMENDED PRODUCTS
  const getRecommendations = () => {
    if (!product) return []

    // SAME CATEGORY, EXCLUDING CURRENT PRODUCT
    const sameCategory = products.filter(
      (p) => p.category === product.category && p.id !== product.id
    )

    if (sameCategory.length >= 4) {
      return sameCategory.slice(0, 4)
    }

    // NOT ENOUGH — ADD SAME VENDOR PRODUCTS
    const sameVendor = products.filter(
      (p) => p.vendorId === product.vendorId && p.id !== product.id
    )

    // COMBINE AND REMOVE DUPLICATES
    const combined = [...sameCategory, ...sameVendor]
    const unique = combined.filter(
      (p, index, self) => index === self.findIndex((item) => item.id === p.id)
    )
    return unique.slice(0, 4)
  }
  const recommendations = getRecommendations()
  const productRatings = getProductRatings(id)
  const averageRating = getProductAverage(id)

  if (!product) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <Link href="/products" className="text-green-400 hover:underline">
            Back to Marketplace
          </Link>
        </div>
      </main>
    )
  }

  // CHECK IF BUYER HAS ORDERED THIS PRODUCT
  const hasPurchased = currentUser
    ? orders.some(
        (order) =>
          order.buyerId === currentUser.id &&
          order.status !== "cancelled" && 
          order.items.some((item) => item.product.id === product.id)
      )
    : false

    const hasCancelledOrder = currentUser
    ?orders.some(
        (order) =>
            order.buyerId === currentUser.id &&
            order.status === "cancelled" &&
            order.items.some((item) => item.product.id === product.id)
    )
    : false

  const alreadyRated = currentUser
    ? hasUserRated(product.id, currentUser.id)
    : false

  // ADD TO CART
  const handleAddToCart = () => {
    addToCart(product, quantity)
    setAdded(true)
    toast.success(`${product.name} added to cart!`)
    setTimeout(() => setAdded(false), 2000)
  }

  // SUBMIT RATING
  const handleSubmitRating = () => {
  if (!currentUser || selectedStars === 0) return

  addRating({
    productId: product.id,
    vendorId: product.vendorId,
    buyerId: currentUser.id,
    buyerName: currentUser.name,
    stars: selectedStars,
    comment,
  })

  setRatingSubmitted(true)
  setComment("")
  setSelectedStars(0)
  toast.success("Thank you for your review!")
}

  return (
    <main className="min-h-screen bg-gray-950 text-white">

      
      <div className="max-w-6xl mx-auto px-8 py-6">
        <Link
          href="/products"
          className="text-gray-400 hover:text-green-400 transition-colors text-sm"
        >
          ← Back to Marketplace
        </Link>
      </div>

     
      <section className="max-w-6xl mx-auto px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          
          <div className="bg-gray-800 rounded-2xl h-96 flex items-center justify-center overflow-hidden">
            {product.image && product.image.startsWith("data:") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"/>
            ) : (
               <span className="text-gray-600">No Image Yet</span>
               )}
          </div>

          <div className="flex flex-col justify-center">
            <span className="text-green-400 text-sm uppercase tracking-wide mb-2">
              {product.category}
            </span>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

            
            <div className="mb-4">
              <StarRating
                stars={averageRating}
                count={productRatings.length}
                size="md"
              />
            </div>

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
              ) : (
                <span className="text-red-400">✗ Out of Stock</span>
              )}
            </p>
            {vendor && (
              <p className="text-sm text-gray-400 mb-6">
                Sold by{" "}
                <span className="text-white font-medium">
                  {vendor.storeName}
                </span>
              </p>
            )}

            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-gray-400 text-sm">Quantity:</span>
              <div className="flex items-center gap-3 bg-gray-800 rounded-full px-4 py-2">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="text-gray-400 hover:text-white font-bold text-lg"
                >
                  −
                </button>
                <span className="w-6 text-center font-semibold">
                  {quantity}
                </span>
                <button
                  type="button"
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
              type="button"
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

        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">
            Customer Reviews
            {productRatings.length > 0 && (
              <span className="text-gray-400 text-lg font-normal ml-3">
                ({productRatings.length} reviews)
              </span>
            )}
          </h2>

          {/* RATING FORM */}
          <div className="bg-gray-900 rounded-xl p-6 mb-8">

            
            {!currentUser && (
              <p className="text-gray-400">
                <Link href="/login" className="text-green-400 hover:underline">
                  Log in
                </Link>{" "}
                to leave a review
              </p>
            )}

           
            {currentUser && currentUser.role !== "buyer" && (
              <p className="text-gray-400">
                Only buyers can leave reviews
              </p>
            )}

            
            {/* SUSPENDED BUYER */}
{currentUser &&
  currentUser.role === "buyer" &&
  isSuspended && (
    <p className="text-yellow-400">
      Your account is restricted and cannot leave reviews right now.
    </p>
  )}

{/* BUYER BUT HASN'T PURCHASED */}
{currentUser &&
  currentUser.role === "buyer" &&
  !isSuspended &&
  !hasPurchased && (
    <p className="text-gray-400">
      Purchase this product to leave a review
    </p>
  )}

            
            {currentUser &&
              currentUser.role === "buyer" &&
              hasPurchased &&
              (alreadyRated || ratingSubmitted) && (
                <div className="text-green-400 flex items-center gap-2">
                  <span>✓</span>
                  <span>Thank you for your review!</span>
                </div>
              )}

            {currentUser &&
                currentUser.role === "buyer" &&
                hasCancelledOrder &&
                !hasPurchased && (
                    <p className="text-yellow-400">
                        You cancelled this order. Complete a purchase to leave a review.
                    </p>
            )}

             
            {currentUser &&
              currentUser.role === "buyer" &&
              !isSuspended &&
              hasPurchased &&
              !alreadyRated &&
              !ratingSubmitted && (
                <div>
                  <h3 className="font-semibold mb-4">Leave a Review</h3>

                  
                  <div className="flex items-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setSelectedStars(star)}
                        onMouseEnter={() => setHoveredStars(star)}
                        onMouseLeave={() => setHoveredStars(0)}
                        className={`text-3xl transition-colors ${
                          star <= (hoveredStars || selectedStars)
                            ? "text-yellow-400"
                            : "text-gray-600"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                    {selectedStars > 0 && (
                      <span className="text-gray-400 ml-2 text-sm">
                        {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][selectedStars]}
                      </span>
                    )}
                  </div>

                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience with this product..."
                    rows={3}
                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-500 resize-none mb-4"
                  />

                  {/* SUBMIT */}
                  <button
                    type="button"
                    onClick={handleSubmitRating}
                    disabled={selectedStars === 0}
                    className="bg-green-400 text-gray-900 font-semibold px-6 py-3 rounded-full hover:bg-green-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit Review
                  </button>
                </div>
              )}
          </div>

          {/* EXISTING RATINGS LIST */}
          {productRatings.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No reviews yet — be the first to review this product!
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {productRatings.map((rating) => (
                <div
                  key={rating.id}
                  className="bg-gray-900 rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold">{rating.buyerName}</p>
                      <p className="text-gray-500 text-xs mt-1">
                        {new Date(rating.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <StarRating
                      stars={rating.stars}
                      showNumber={false}
                      size="sm"
                    />
                  </div>
                  {rating.comment && (
                    <p className="text-gray-300 leading-relaxed">
                      {rating.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ML-POWERED RECOMMENDATIONS */}
{currentUser && !mlLoading && mlRecommendations.length > 0 && (
  <div className="mt-16">
    <div className="flex items-center gap-2 mb-8">
      <h2 className="text-2xl font-bold">Recommended For You</h2>
      <span className="text-xs bg-purple-900 text-purple-300 px-2 py-1 rounded-full font-medium">
        AI Powered
      </span>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {mlRecommendations.map((productId) => {
        const mlProduct = products.find((p) => p.id === productId)
        if (!mlProduct) return null

        return (
          <Link
            key={mlProduct.id}
            href={`/products/${mlProduct.id}`}
            className="bg-gray-900 rounded-xl overflow-hidden hover:ring-2 hover:ring-purple-400 transition-all"
          >
            <div className="bg-gray-800 h-40 flex items-center justify-center overflow-hidden">
              {mlProduct.image && mlProduct.image.startsWith("data:") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={mlProduct.image}
                  alt={mlProduct.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-600 text-sm">No Image Yet</span>
              )}
            </div>
            <div className="p-4">
              <span className="text-xs text-purple-400 uppercase tracking-wide">
                {mlProduct.category}
              </span>
              <h3 className="font-semibold mt-1 mb-1 line-clamp-1">
                {mlProduct.name}
              </h3>
              <p className="text-green-400 font-bold">
                ETB {(mlProduct.price * 160).toFixed(2)}
              </p>
            </div>
          </Link>
        )
      })}
    </div>
  </div>
)}

        {/* RECOMMENDATIONS */}
        {recommendations.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendations.map((rec) => (
                <Link
                key={rec.id}
                href={`/products/${rec.id}`}
                className="bg-gray-900 rounded-xl overflow-hidden hover:ring-2 hover:ring-green-400 transition-all">
                  <div className="bg-gray-800 h-40 flex items-center justify-center overflow-hidden">
                    {rec.image && rec.image.startsWith("data:") ?(
                      <img
                      src={rec.image}
                       alt={rec.name}
                      className="w-full h-full object-cover"/>
                    ): (
                      <span className="text-gray-600 text-sm">No Image Yet</span>
                    )}
                  </div>
                  <div className="p-4">
                    <span className="text-xs text-green-400 uppercase tracking-wide">
                      {rec.category}
                    </span>
                    <h3 className="font-semibold mt-1 mb-1 line-clamp-1">
                      {rec.name}
                    </h3>
                    <p className="text-green-400 font-bold">
                      ETB {(rec.price*160).toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </section>
    </main>
  )
}