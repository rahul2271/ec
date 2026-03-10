# E-Commerce & Affiliate Platform - Setup Guide

## Overview

This is a full-featured e-commerce platform with integrated affiliate network, built with Next.js 16, Neon PostgreSQL, Auth.js, and Stripe payments.

## Quick Start

### 1. Environment Variables

Create a `.env.local` file in the project root with the following:

```env
# Database
DATABASE_URL=your_neon_postgres_connection_string

# Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Stripe (get from Stripe dashboard)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 2. Generate Prisma Client

```bash
npm run db:generate
```

### 3. Push Database Schema

```bash
npm run db:push
```

Or run the complete setup:

```bash
npm run db:setup
```

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Project Structure

### Route Groups

- **`(public)`** - Public-facing pages (home, shop, product details, about, contact, etc.)
- **`(shopper)`** - Customer portal (cart, checkout, account, orders)
- **`(affiliate)`** - Affiliate dashboard (links, payouts, analytics)
- **`(admin)`** - Admin dashboard (products, users, orders, analytics)

### Key Files

- `lib/auth.ts` - Auth.js configuration
- `lib/db.ts` - Prisma client singleton
- `middleware.ts` - Route protection middleware
- `prisma/schema.prisma` - Database schema
- `app/api/` - API routes for backend operations

## Features

### Shopper Portal
- Browse and search products
- Add items to cart
- Checkout with Stripe
- View order history
- User account management

### Affiliate Portal
- Generate affiliate links
- Track clicks and conversions
- Monitor earnings in real-time
- Request payouts
- View analytics dashboard

### Admin Dashboard
- Manage products (create, edit, delete)
- View all orders and update status
- Manage users and roles
- View platform analytics
- Monitor affiliate performance

### Payment Processing
- Stripe Checkout integration
- Automatic order creation on successful payment
- Webhook handlers for payment events

### Affiliate Tracking
- Click tracking on affiliate links
- Automatic commission calculation (10% by default)
- Conversion tracking
- Real-time earnings updates

## Database Schema

### Main Tables

- **User** - User accounts with roles (USER, AFFILIATE, ADMIN, SUPERADMIN)
- **Product** - Product catalog with inventory
- **Order** - Customer orders
- **OrderItem** - Items in orders
- **CartItem** - Shopping cart items
- **Affiliate** - Affiliate program participants
- **AffiliateLink** - Tracking links created by affiliates
- **Click** - Click tracking records
- **Payout** - Payout requests and history
- **Page** - CMS pages (Terms, Privacy, About, Blog)
- **BlogPost** - Blog articles

## Authentication

Uses Auth.js with credentials provider:
- Email/password authentication
- JWT session strategy
- Role-based access control (RBAC)
- Session duration: 30 days

### Default Roles

- **USER** - Regular customer
- **AFFILIATE** - Affiliate program member
- **ADMIN** - Platform administrator
- **SUPERADMIN** - Full system access

## API Endpoints

### Products
- `GET /api/products` - List all products
- `GET /api/products/[id]` - Get product details
- `POST /api/admin/products` - Create product (admin)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `DELETE /api/cart/[id]` - Remove item from cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user's orders

### Affiliates
- `POST /api/affiliates` - Register as affiliate
- `POST /api/affiliates/links` - Create tracking link
- `GET /api/affiliates/payouts` - Get payout history

### Admin
- `GET /api/users` - List all users
- `GET /api/admin/analytics` - Get platform analytics

## Deployment

### To Vercel

1. Push code to GitHub repository
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

The `build` script automatically generates Prisma client before building.

## Testing

### Create Test Accounts

Sign up on `/auth/signup`:
- Customer: email@customer.com, password123456
- Affiliate: aff@example.com, password123456
- Admin: admin@example.com, password123456

Then update roles in database:
```sql
UPDATE "User" SET role = 'AFFILIATE' WHERE email = 'aff@example.com';
UPDATE "User" SET role = 'ADMIN' WHERE email = 'admin@example.com';
```

## Troubleshooting

### Prisma Client Not Generated

If you see "Can't resolve '.prisma/client'" error:
```bash
npm run db:generate
```

### Database Connection Issues

Verify DATABASE_URL in `.env.local` is correct and the Neon database is accessible.

### Authentication Not Working

1. Ensure `NEXTAUTH_SECRET` is set
2. Check `NEXTAUTH_URL` matches your domain
3. Verify cookies are enabled in browser

## Support

For issues or questions, check the implementation files or documentation comments throughout the codebase.
