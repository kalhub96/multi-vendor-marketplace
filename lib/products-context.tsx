"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "@/lib/supabase-client"
import { Product, ProductCategory } from "@/types"

type ProductsContextType = {
  products: Product[]
  addProduct: (product: Omit<Product, "id" | "createdAt">) => Promise<Product | null>
  deleteProduct: (productId: string) => Promise<void>
  refetchProducts: () => Promise<void>
  loaded: boolean
}

const ProductsContext = createContext<ProductsContextType | null>(null)

// CONVERT A DATABASE ROW INTO OUR APP'S Product TYPE
function mapRowToProduct(row: {
  id: string
  vendor_id: string
  name: string
  description: string | null
  price: number
  image: string | null
  category: string
  stock: number
  created_at: string
}): Product {
  return {
    id: row.id,
    vendorId: row.vendor_id,
    name: row.name,
    description: row.description ?? "",
    price: row.price,
    image: row.image ?? "",
    category: row.category as ProductCategory,
    stock: row.stock,
    createdAt: row.created_at,
  }
}

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loaded, setLoaded] = useState(false)

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Failed to fetch products:", error.message)
      setProducts([])
    } else {
      setProducts(data.map(mapRowToProduct))
    }
    setLoaded(true)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // ADD A NEW PRODUCT — INSERT INTO SUPABASE, THEN ADD TO LOCAL STATE
  const addProduct = async (
    product: Omit<Product, "id" | "createdAt">
  ): Promise<Product | null> => {
    const { data, error } = await supabase
      .from("products")
      .insert({
        vendor_id: product.vendorId,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        category: product.category,
        stock: product.stock,
      })
      .select()
      .single()

    if (error) {
      console.error("Failed to add product:", error.message)
      return null
    }

    const newProduct = mapRowToProduct(data)
    setProducts((prev) => [newProduct, ...prev])
    return newProduct
  }

  // DELETE A PRODUCT
  const deleteProduct = async (productId: string) => {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId)

    if (error) {
      console.error("Failed to delete product:", error.message)
      return
    }

    setProducts((prev) => prev.filter((p) => p.id !== productId))
  }

  return (
    <ProductsContext.Provider
      value={{
        products,
        addProduct,
        deleteProduct,
        refetchProducts: fetchProducts,
        loaded,
      }}
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