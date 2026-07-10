import { User, Vendor } from "@/types"

export const users: User[] = [
{
    id: "user_1",
    name: "John Buyer",
    email: "john@example.com",
    role: "buyer",
    status: "active",
    createdAt: "2024-01-01",
},

{
    id: "user_2",
    name: "Sarah Vendor",
    email: "sarah@example.com",
    role: "vendor",
    status: "active",
    createdAt: "2024-01-02",
},

{
    id: "user_3",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    status: "active",
    createdAt: "2024-01-03",
},
]

export const vendors: Vendor[] = [
    {
        id: "vendor_1",
        userId: "user_2",
        storeName: "Sarah's Electronics",
        description: "Best electronics at the best prices",
        logo: "/vendors/sarah-store.png",
        createdAt: "2024-01-02",
    },
]