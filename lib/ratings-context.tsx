"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "@/lib/supabase-client"
import { Rating } from "@/types"

type RatingsContextType = {
  ratings: Rating[]
  addRating: (rating: Omit<Rating, "id" | "createdAt">) => Promise<void>
  getProductRatings: (productId: string) => Rating[]
  getProductAverage: (productId: string) => number
  getVendorAverage: (vendorId: string) => number
  hasUserRated: (productId: string, buyerId: string) => boolean
  refetchRatings: () => Promise<void>
  loaded: boolean
}

const RatingsContext = createContext<RatingsContextType | null>(null)

// CONVERT A DATABASE ROW INTO OUR APP'S Rating TYPE
// NOTE: buyer_name isn't stored on the ratings table itself —
// we join it in from the users table
function mapRowToRating(row: {
  id: string
  product_id: string
  vendor_id: string
  buyer_id: string
  stars: number
  comment: string | null
  created_at: string
  users: { name: string } | null
}): Rating {
  return {
    id: row.id,
    productId: row.product_id,
    vendorId: row.vendor_id,
    buyerId: row.buyer_id,
    buyerName: row.users?.name ?? "Anonymous",
    stars: row.stars,
    comment: row.comment ?? "",
    createdAt: row.created_at,
  }
}

export function RatingsProvider({ children }: { children: React.ReactNode }) {
  const [ratings, setRatings] = useState<Rating[]>([])
  const [loaded, setLoaded] = useState(false)

  const fetchRatings = async () => {
    const { data, error } = await supabase
      .from("ratings")
      .select("*, users(name)")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Failed to fetch ratings:", error.message)
      setRatings([])
    } else {
      setRatings((data as any[]).map(mapRowToRating))
    }
    setLoaded(true)
  }

  useEffect(() => {
    fetchRatings()
  }, [])

  // ADD A NEW RATING
  const addRating = async (rating: Omit<Rating, "id" | "createdAt">) => {
    const { data, error } = await supabase
      .from("ratings")
      .insert({
        product_id: rating.productId,
        vendor_id: rating.vendorId,
        buyer_id: rating.buyerId,
        stars: rating.stars,
        comment: rating.comment,
      })
      .select("*, users(name)")
      .single()

    if (error || !data) {
      console.error("Failed to add rating:", error?.message)
      return
    }

    const newRating = mapRowToRating(data as any)
    setRatings((prev) => [newRating, ...prev])
  }

  const getProductRatings = (productId: string) => {
    return ratings.filter((r) => r.productId === productId)
  }

  const getProductAverage = (productId: string) => {
    const productRatings = ratings.filter((r) => r.productId === productId)
    if (productRatings.length === 0) return 0
    const sum = productRatings.reduce((acc, r) => acc + r.stars, 0)
    return sum / productRatings.length
  }

  const getVendorAverage = (vendorId: string) => {
    const vendorRatings = ratings.filter((r) => r.vendorId === vendorId)
    if (vendorRatings.length === 0) return 0
    const sum = vendorRatings.reduce((acc, r) => acc + r.stars, 0)
    return sum / vendorRatings.length
  }

  const hasUserRated = (productId: string, buyerId: string) => {
    return ratings.some(
      (r) => r.productId === productId && r.buyerId === buyerId
    )
  }

  return (
    <RatingsContext.Provider
      value={{
        ratings,
        addRating,
        getProductRatings,
        getProductAverage,
        getVendorAverage,
        hasUserRated,
        refetchRatings: fetchRatings,
        loaded,
      }}
    >
      {children}
    </RatingsContext.Provider>
  )
}

export function useRatings() {
  const context = useContext(RatingsContext)
  if (!context) {
    throw new Error("useRatings must be used within a RatingsProvider")
  }
  return context
}