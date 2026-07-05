import { Rating } from "@/types"

export const initialRatings: Rating[] = [
    {
        id: "rating_1",
        productId: "product_1",
        vendorId: "vendor_1",
        buyerId: "user_1",
        buyerName: "John Buyer",
        stars: 5,
        comment: "Amazing headphones! The noise cancellation is top notch.",
        createdAt: "2024-20-12",
    },

    {
        id: "rating_2",
        productId: "product_2",
        vendorId: "vendor_1",
        buyerId: "user_1",
        buyerName: "John Buyer",
        stars: 4,
        comment: "Great keyboard, very satisfying to type on. RGB is beautiful.",
        createdAt: "2024-02-02",
    },

    {
        id: "rating_3",
        productId: "product_7",
        vendorId: "vendor_1",
        buyerId: "user_1",
        buyerName: "John Buyer",
        stars: 5,
        comment: "Best Ethiopian coffee I've ever had. Rich and aromatic!",
        createdAt: "2024-02-12",
  },

  {
        id: "rating_4",
        productId: "product_5",
        vendorId: "vendor_1",
        buyerId: "user_1",
        buyerName: "John Buyer",
        stars: 4,
        comment: "Very comfortable mouse, battery lasts forever.",
        createdAt: "2024-02-14",
  },
]