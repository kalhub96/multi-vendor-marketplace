export type UserRole = "buyer" | "vendor" | "admin"
export type UserStatus = "active" | "banned" | "suspended"

export type User = {
    id: string
    name: string
    email: string
    role: UserRole
    status: UserStatus
    createdAt: string
}

export type VerificationStatus = "unverified" | "pending" | "verified" | "rejected"

export type Vendor = {
  id: string
  userId: string
  storeName: string
  description: string
  logo: string
  verificationStatus: VerificationStatus
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

export type ShippingInfo = {
  fullName: string
  phone: string
  city: string
  address: string
}

export type PaymentMethod = "chapa" | "telebirr" | "cash_on_delivery"

export type Order = {
  id: string
  buyerId: string
  items: CartItem[]
  totalAmount: number
  status: OrderStatus
  shippingInfo: ShippingInfo
  paymentMethod: PaymentMethod
  createdAt: string
}

export type Rating = {
  id: string
  productId: string
  vendorId: string
  buyerId: string
  buyerName: string
  stars: number
  comment: string
  createdAt: string
}