export type UserRole = "buyer" | "vendor" | "admin"

export type User = {
    id: string
    name: string
    email: string
    role: UserRole
    createdAt: string
}

export type Vendor = {
    id: string
    userId: string
    storeName: string
    description: string
    logo: string
    createdAt: string
}

export type ProductCategory =

| "electronics"
| "clothing"
| "food"
| "books"
| "home"
| "other"

export type Product = {
    id: string
    name: string
    vendorId: string
    description: string
    price: number
    image: string
    category: ProductCategory
    stock: number
    createdAt: string
}

export type CartItem = {
  product: Product
  quantity: number
}

export type OrderStatus =
| "pending"
| "processing"
| "shipped"
| "delivered"
| "cancelled"

export type Order = {
  id: string
  buyerId: string
  items: CartItem[]
  totalAmount: number
  status: OrderStatus
  createdAt: string
}