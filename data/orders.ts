import { Order } from "@/types"

export const orders: Order[] = [
  {
    id: "order_1",
    buyerId: "user_1",
    items: [
      {
        product: {
          id: "product_1",
          vendorId: "vendor_1",
          name: "Wireless Headphones",
          description: "Premium sound quality with noise cancellation",
          price: 99.99,
          image: "/products/headphones.jpg",
          category: "electronics",
          stock: 50,
          createdAt: "2024-01-10",
        },
        quantity: 1,
      },
    ],
    totalAmount: 15998.40,
    status: "delivered",
    createdAt: "2024-02-01",
  },
  {
    id: "order_2",
    buyerId: "user_1",
    items: [
      {
        product: {
          id: "product_2",
          vendorId: "vendor_1",
          name: "Mechanical Keyboard",
          description: "RGB backlit mechanical keyboard for professionals",
          price: 149.99,
          image: "/products/keyboard.jpg",
          category: "electronics",
          stock: 30,
          createdAt: "2024-01-11",
        },
        quantity: 2,
      },
    ],
    totalAmount: 47996.80,
    status: "shipped",
    createdAt: "2024-02-05",
  },
  {
    id: "order_3",
    buyerId: "user_1",
    items: [
      {
        product: {
          id: "product_7",
          vendorId: "vendor_1",
          name: "Ethiopian Coffee Beans",
          description: "Premium Yirgacheffe single origin coffee beans",
          price: 12.99,
          image: "/products/coffee.jpg",
          category: "food",
          stock: 200,
          createdAt: "2024-01-16",
        },
        quantity: 3,
      },
    ],
    totalAmount: 6235.20,
    status: "processing",
    createdAt: "2024-02-10",
  },
  {
    id: "order_4",
    buyerId: "user_1",
    items: [
      {
        product: {
          id: "product_5",
          vendorId: "vendor_1",
          name: "Wireless Mouse",
          description: "Ergonomic wireless mouse with long battery life",
          price: 59.99,
          image: "/products/mouse.jpg",
          category: "electronics",
          stock: 60,
          createdAt: "2024-01-14",
        },
        quantity: 1,
      },
    ],
    totalAmount: 9598.40,
    status: "pending",
    createdAt: "2024-02-12",
  },
]