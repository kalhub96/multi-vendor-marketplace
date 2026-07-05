"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { Product, Rating } from "@/types"
import { initialRatings } from "@/data/ratings"
import { constants } from "buffer"
import { create } from "domain"

type RatingsContextType = {
    ratings: Rating[]
    addRating: (rating: Omit<Rating, "id" | "createdAt">) => void
    getProductRatings: (ProductId: string) => Rating []
    getProductAverage: (productId: string) => number
    getVendorAverage: (vendorId: string) => number
    hasUserRated: (productId: string, buyerId: string) => boolean
    loaded: boolean
}

const RatingsContext = createContext<RatingsContextType | null>(null)

export function RatingsProvider({ children }: { children: React.ReactNode}) {
    const [ratings, setRatings] = useState<Rating[]>([])
    const [loaded, setLoaded] = useState(false)

    useEffect(() =>{
        try{
            const stored = localStorage.getItem("ratings")
            if (stored){
                setRatings(JSON.parse(stored))
            } else {
                setRatings(initialRatings)
                localStorage.setItem("ratings",JSON.stringify(initialRatings))
            }
        } catch {
            setRatings(initialRatings)
        }
        setLoaded(true)
    }, [])

    useEffect(() => {
        if (loaded){
            localStorage.setItem("ratings", JSON.stringify(ratings))
        }
    }, [ratings, loaded])

    const addRating = (rating: Omit<Rating, "id" | "createdAt">) => {
        const newRating = {
            ...rating,
            id: `rating_${Date.now()}`,
            createdAt: new Date().toISOString(),
        }
        setRatings((prev) => [...prev,newRating])
    }

    const getProductRatings = (productId: string) => {
        return ratings.filter((r) => r.productId === productId)
    }

    const getProductAverage = (productId: string) => {
        const productRatings = ratings.filter((r) => r.productId === productId)
        if (productRatings.length === 0) return 0
        const sum = productRatings.reduce((acc, r) => acc + r.stars, 0)
        return sum/productRatings.length
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
            loaded,
        }}>
            {children}
        </RatingsContext.Provider>
    )
}

export function useRatings() {
    const context = useContext(RatingsContext)
    if(!context) {
        throw new Error("useRatings must be used within a RatingsProvide")
    } 
    return context
}