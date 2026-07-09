"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { Product } from "@/types"
import { products as initialProducts } from "@/data/products"

type ProductsContextType = {
    products: Product[]
    addProduct: (product: Product) => void
    deleteProduct: (product: string) => void
    loaded: boolean
}

const ProductsContext = createContext<ProductsContextType | null>(null)

export function ProductsProvider({ children }: { children: React.ReactNode}) {
    const [ products, setProducts ] = useState<Product[]>([])
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        try{
            const stored = localStorage.getItem("products")
            if (stored) {
                setProducts(JSON.parse(stored))
            } else{
                setProducts(initialProducts)
                localStorage.setItem("products", JSON.stringify(initialProducts))
            }
        } catch{
            setProducts(initialProducts)
        }
        setLoaded(true)
    }, [])

    useEffect(() => {
        if (loaded) {
            localStorage.setItem("products", JSON.stringify(products))
        }
    }, [products, loaded])

    //ADD A NEW PRODUCT
    const addProduct = (product: Product) => {
        setProducts((prev) => [product, ...prev])
    }

    //DELETE A PRODUCT
    const deleteProduct = (productId: string) => {
        setProducts((prev) => prev.filter((p) => p.id !== productId))
    }
    return (
    <ProductsContext.Provider
      value={{ products, addProduct, deleteProduct, loaded }}
    >
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
    const context = useContext(ProductsContext)
    if (!context) {
        throw new Error("useProducts must be used within a ProductsProvider")
    }
    return context
}
