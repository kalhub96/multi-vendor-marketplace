# MultiMart

A full-stack, multi-vendor e-commerce marketplace built with Next.js, TypeScript, and Tailwind CSS. Buyers can browse and purchase from multiple independent vendors, vendors manage their own stores, and admins moderate the entire platform.

## Features

### Marketplace
- Product browsing with search and category filtering
- Product detail pages with image galleries, ratings, and reviews
- Rule-based "You Might Also Like" recommendations
- Shopping cart with per-user isolation
- Full checkout flow with simulated payment methods (Telebirr, Chapa, Cash on Delivery)
- Order history with cancellation support

### Accounts & Roles
- Buyer, Vendor, and Admin roles with role-based access
- Registration and login with instant session updates
- Editable user profiles
- Light / Dark / System theme toggle

### Vendor Tools
- Vendor dashboard with live stats (products, orders, revenue, rating)
- Product management with image upload
- Order management with status progression (pending → processing → shipped → delivered)

### Admin Tools
- Platform-wide dashboard with live statistics
- User moderation (ban, suspend, reactivate)
- Vendor and product oversight

### Design
- Fully responsive (mobile, tablet, desktop)
- Animated UI with Framer Motion (page transitions, hover effects, count-up stats)
- Toast notifications for key actions
- Loading skeletons for a smoother experience

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion
- **Notifications:** react-hot-toast
- **State Management:** React Context API (Auth, Cart, Products, Orders, Ratings, Users, Vendors, Theme)
- **Data Persistence:** localStorage (no backend database in v1.0 — see Roadmap)

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
git clone https://github.com/yourusername/multimart.git
cd multimart
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Buyer | john@example.com | any password |
| Vendor | sarah@example.com | any password |
| Admin | admin@example.com | any password |

## Project Structure