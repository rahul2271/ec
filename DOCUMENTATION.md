# Full-Stack Affiliate Marketplace Platform Documentation

## Overview

This is a complete e-commerce platform with an advanced affiliate system, built with Next.js 16, Prisma, and PostgreSQL. The platform supports customers, affiliates, and admin users with comprehensive product management, affiliate tracking, and payout systems.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Architecture](#architecture)
3. [Key Features](#key-features)
4. [User Roles and Workflows](#user-roles-and-workflows)
5. [API Documentation](#api-documentation)
6. [Database Schema](#database-schema)
7. [Affiliate System Details](#affiliate-system-details)
8. [Setup Instructions](#setup-instructions)
9. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- pnpm (or npm/yarn)

### Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Generate Prisma client
npx prisma generate

# 3. Set up environment variables
cp .env.example .env.local

# 4. Create database and run migrations
npx prisma db push

# 5. Seed database with sample data
npx tsx scripts/seed.ts

# 6. Start development server
pnpm dev
```

Visit `http://localhost:3000` and log in with:
- **Admin**: `admin@example.com` / `password123`
- **Affiliate**: `affiliate1@example.com` / `password123`
- **Customer**: `customer1@example.com` / `password123`

---

## Architecture

### Tech Stack

- **Frontend**: Next.js 16 (React 19), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Server Components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with custom credentials provider
- **State Management**: SWR for data fetching

### Directory Structure

```
/app
  /(admin)           # Admin dashboard pages
  /(affiliate)       # Affiliate portal pages
  /(public)          # Public pages (homepage, shop, product details)
  /(shopper)         # Customer account pages
  /api               # API routes
    /admin           # Admin APIs
    /affiliates      # Affiliate APIs
    /auth            # Authentication APIs
    /products        # Product APIs
    /cart            # Shopping cart APIs
    /orders          # Order APIs
/components          # Reusable components
/lib                 # Utilities and configurations
/prisma              # Database schema and migrations
/scripts             # Database seeds and utilities
```

---

## Key Features

### For Customers

- Browse products with advanced filtering
- View detailed product pages with:
  - Image galleries with variant-specific images
  - Product specifications and features
  - Customer reviews and ratings
  - Related products
  - Variant selection (color, size, etc.)
- Shopping cart with persistent storage
- Secure checkout with address management
- Order history and tracking
- Wishlist functionality
- Review and rate products

### For Affiliates

- Generate unlimited referral links
- Track performance metrics:
  - Clicks on referral links
  - Conversions (completed orders)
  - Conversion rate
  - Earnings per link
- Shareable referral links with tracking codes
- Customizable referral URLs
- Request payouts with manual bank transfer details
- View payout history
- Dashboard with earnings overview
- Real-time analytics

### For Admins

- Manage affiliate applications:
  - Approve pending affiliates
  - Suspend or reactivate affiliates
  - Set custom commission rates
- Monitor affiliate performance
- Process and track payouts
- Create and manage products with:
  - Multiple variants and specifications
  - Rich descriptions
  - Image galleries
  - Category organization
- View sales analytics
- Manage user accounts
- Process orders and refunds

---

## User Roles and Workflows

### Workflow 1: Customer Journey

```
Register/Login
  ↓
Browse Products (Shop Page)
  ↓
View Product Details
  ├─ See variants, specs, reviews
  ├─ Add to cart
  └─ (Optional) Share via affiliate link
  ↓
Manage Cart
  ├─ Update quantities
  └─ Proceed to checkout
  ↓
Checkout
  ├─ Enter shipping address
  ├─ Review order
  └─ Complete payment
  ↓
Order Confirmation
  ├─ Track order status
  └─ Leave reviews
```

### Workflow 2: Affiliate Registration & Earning

```
Customer signs up as Affiliate
  ↓
Admin reviews application
  ├─ Approve → Status: ACTIVE
  └─ Reject → Status: INACTIVE
  ↓
Access Affiliate Dashboard
  ├─ View earnings
  ├─ View pending payouts
  └─ Manage referral links
  ↓
Generate Referral Links
  ├─ Link to specific products
  ├─ Link to store homepage
  └─ Share via social media
  ↓
Track Performance
  ├─ Clicks on links
  ├─ Conversions from clicks
  └─ Earnings by link
  ↓
Request Payout
  ├─ Set amount (minimum $50)
  ├─ Choose payment method
  └─ Provide bank details
  ↓
Admin Processes Payout
  ├─ Review request
  ├─ Update status to PROCESSING
  └─ Mark COMPLETED when transferred
```

### Workflow 3: Admin Management

```
Access Admin Dashboard
  ↓
Review Affiliates
  ├─ Filter by status (PENDING, ACTIVE, SUSPENDED)
  ├─ Search by name/email
  └─ View performance metrics
  ↓
Manage Affiliate Status
  ├─ Approve pending affiliates
  ├─ Suspend suspicious accounts
  ├─ Reactivate suspended affiliates
  └─ Set commission rates per affiliate
  ↓
Process Payouts
  ├─ Review payout requests
  ├─ Verify bank details
  ├─ Approve and process
  └─ Track payout status
  ↓
Manage Products
  ├─ Create new products
  ├─ Add variants and specifications
  ├─ Upload image galleries
  ├─ Set pricing and inventory
  └─ Manage categories
  ↓
View Analytics
  ├─ Sales by period
  ├─ Top affiliates
  ├─ Customer acquisition cost
  └─ Revenue by channel
```

---

## API Documentation

### Authentication Endpoints

#### Sign In
```
POST /api/auth/[...nextauth]/route.ts
Body: { email: string, password: string }
Response: Session with user info and role
```

#### Sign Up
```
POST /api/auth/signup
Body: { email: string, password: string, name: string }
Response: { success: boolean, message: string }
```

### Product Endpoints

#### Get Product Details
```
GET /api/products/[id]
Response: {
  id, name, price, description, longDescription,
  images, variants, specifications, relatedProducts,
  reviews, rating, reviewCount, soldCount
}
```

#### List Products
```
GET /api/products?category=X&sort=Y&limit=Z
Response: Product[]
```

#### Create Product (Admin)
```
POST /api/admin/products
Body: {
  name, description, longDescription, price, cost,
  stock, category, brand, images, variants, specifications
}
Response: Product
```

### Affiliate Endpoints

#### Generate Referral Link
```
POST /api/affiliates/links
Body: { productId?: string, customUrl?: string }
Response: {
  id, trackingCode, shareUrl, product, commissionRate
}
```

#### Get Affiliate Links
```
GET /api/affiliates/links
Response: AffiliateLink[]
```

#### Get Affiliate Statistics
```
GET /api/affiliates/stats
Response: {
  totalEarnings, totalCommissions, totalPaid, pendingEarnings,
  totalClicks, totalConversions, conversionRate, activeLinks
}
```

#### Request Payout
```
POST /api/affiliates/payouts
Body: { amount, method, bankName, accountNumber, notes }
Response: { id, amount, status, message }
```

#### Get Payout History
```
GET /api/affiliates/payouts
Response: Payout[]
```

### Admin Endpoints

#### List All Affiliates
```
GET /api/admin/affiliates
Response: Affiliate[] with user details
```

#### Update Affiliate Status
```
PUT /api/admin/affiliates/[id]
Body: { status, action, notes, commissionRate }
Response: Updated Affiliate
```

#### Create Product
```
POST /api/admin/products
Body: Product data with variants and specs
Response: Product
```

#### Process Payout
```
PUT /api/admin/payouts/[id]
Body: { status, stripePayoutId, notes }
Response: Updated Payout
```

---

## Database Schema

### Key Models

#### User
- id, email, name, passwordHash, role (CUSTOMER, AFFILIATE, ADMIN, SUPERADMIN)
- isActive, createdAt, updatedAt

#### Affiliate
- id, userId, affiliateCode, commissionRate
- status (PENDING, ACTIVE, SUSPENDED, INACTIVE)
- bankAccountInfo (encrypted), totalEarnings, totalPaid

#### Product
- id, name, slug, description, longDescription
- price, cost, stock, category, brand
- images (array), rating, reviewCount, soldCount
- variants, specifications, relatedProducts

#### ProductVariant
- id, productId, name, sku, price, stock
- images, attributes (JSON: {color, size, etc})

#### ProductSpecification
- id, productId, name, value, order

#### AffiliateLink
- id, affiliateId, productId, trackingCode
- customUrl, clicks, conversions, createdAt

#### AffiliateClick
- id, affiliateLinkId, affiliateId
- ipAddress, userAgent, referer, createdAt

#### AffiliateConversion
- id, affiliateId, orderId, commission
- status (PENDING, CONFIRMED, PAID, REFUNDED)

#### Payout
- id, affiliateId, amount, status
- method (BANK_TRANSFER, PAYPAL, STRIPE)
- notes, createdAt, updatedAt

---

## Affiliate System Details

### Commission Structure

- **Default Commission Rate**: 10-15% per sale
- **Customizable per Affiliate**: Admins can set different rates for top performers
- **Earned on**: Order subtotal (before tax and shipping)
- **Conversion Time**: Commissions earned when order is confirmed
- **Payout Terms**: Minimum $50, processed within 5-7 business days

### Referral Link System

**Link Format**:
```
https://yourdomain.com/product/[slug]?ref=[TRACKING_CODE]
https://yourdomain.com/?ref=[TRACKING_CODE]
```

**Tracking Code Structure**: `AFF-[4-CHAR]-[11-RANDOM-CHARS]`

**How It Works**:
1. Affiliate generates link in dashboard
2. Link is shared with audience
3. Tracking code in URL identifies the source
4. When customer completes purchase, commission is attributed
5. Affiliate earns based on commission rate

### Commission Calculation

```
Commission = Order Subtotal × Affiliate Commission Rate
Example: $100 order × 15% = $15 commission
```

### Payout Process

1. Affiliate requests payout from dashboard
2. System calculates pending earnings (unconfirmed conversions excluded)
3. Payout request created with status: PENDING
4. Admin reviews request and bank details
5. Admin processes payment (manual transfer recommended)
6. Payout status updated to COMPLETED
7. Affiliate sees in payout history

### Fraud Prevention

- Track clicks by IP address to detect bot activity
- Monitor conversion rate (flags if > 50%)
- Admin review on all payout requests
- Affiliate status controls (can suspend suspicious accounts)
- Order validation before commission is confirmed

---

## Setup Instructions

### 1. Environment Variables

Create `.env.local`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/affiliate_db"

# Auth
NEXTAUTH_SECRET="your-secret-key-generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Optional: Stripe (for payments)
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

### 2. Database Setup

```bash
# Create database
createdb affiliate_db

# Push schema
npx prisma db push

# Seed with sample data
npx tsx scripts/seed.ts
```

### 3. Running the Application

```bash
# Development
pnpm dev

# Production build
pnpm build
pnpm start
```

### 4. First Login

After seeding, use these test accounts:

| Role      | Email                   | Password    | Commission |
|-----------|-------------------------|-------------|-----------|
| Admin     | admin@example.com       | password123 | N/A       |
| Affiliate | affiliate1@example.com  | password123 | 15%       |
| Affiliate | affiliate2@example.com  | password123 | 12%       |
| Customer  | customer1@example.com   | password123 | N/A       |
| Customer  | customer2@example.com   | password123 | N/A       |

---

## Key Pages and Routes

### Customer Routes
- `/` - Homepage
- `/shop` - Product listing
- `/product/[id]` - Product details with affiliate links
- `/cart` - Shopping cart
- `/checkout` - Order checkout
- `/(shopper)/account` - User account

### Affiliate Routes
- `/affiliate/dashboard` - Main affiliate dashboard
- `/affiliate/links` - Manage referral links
- `/affiliate/payouts` - Payout history and requests
- `/affiliate/request-payout` - Request new payout

### Admin Routes
- `/admin/dashboard` - Admin overview
- `/admin/products` - Manage products
- `/admin/users` - Manage users
- `/admin/orders` - Manage orders
- `/admin/affiliates` - Manage affiliates
- `/admin/payouts` - Process payouts

### Public Routes
- `/auth/signin` - Login page
- `/auth/signup` - Registration page
- `/about`, `/blog`, `/contact`, `/privacy`, `/terms` - CMS pages

---

## Advanced Features

### Product Variants

Create multiple versions of the same product:

```json
{
  "name": "Premium Headphones",
  "variants": [
    {
      "name": "Black - Large",
      "attributes": { "color": "Black", "size": "Large" },
      "price": 299.99,
      "stock": 50
    },
    {
      "name": "Silver - Medium",
      "attributes": { "color": "Silver", "size": "Medium" },
      "price": 279.99,
      "stock": 30
    }
  ]
}
```

### Product Specifications

Display key product features:

```json
{
  "specifications": [
    { "name": "Material", "value": "100% Cotton" },
    { "name": "Weight", "value": "250g" },
    { "name": "Battery", "value": "30 hours" },
    { "name": "Warranty", "value": "2 years" }
  ]
}
```

### Related Products

Link similar or complementary products:

```
Product A → [Related Product B (similar)]
         → [Related Product C (accessory)]
         → [Related Product D (alternative)]
```

---

## Troubleshooting

### "Prisma client not found" Error

```bash
npx prisma generate
```

### Database Connection Issues

- Check `DATABASE_URL` in `.env.local`
- Ensure PostgreSQL is running
- Verify database exists: `psql -l`

### Auth Issues

- Clear browser cookies
- Check `NEXTAUTH_SECRET` is set
- Verify user email exists in database

### Affiliate Links Not Tracking

- Verify affiliate account status is ACTIVE
- Check that tracking code is present in URL
- Ensure cookie tracking is enabled
- Check browser console for errors

### Commission Calculations Wrong

- Verify affiliate commission rate in database
- Check order status (only confirmed orders count)
- Review conversion status (PENDING vs CONFIRMED)

---

## Performance Optimization

### Database Queries
- Use select to fetch only needed fields
- Index frequently queried columns (email, slugs, codes)
- Implement pagination for large result sets

### Caching
- Cache product listings (5-10 minutes)
- Cache affiliate stats (1-2 minutes)
- Use SWR for client-side caching

### Images
- Compress product images (WebP format)
- Use responsive image sizes
- Implement lazy loading

---

## Security Best Practices

1. **Password Security**
   - Use bcrypt for hashing
   - Enforce strong passwords (8+ chars, mix of types)
   - Implement rate limiting on login attempts

2. **Authorization**
   - Check user role on every admin/affiliate endpoint
   - Validate affiliate status before allowing actions
   - Use session-based authentication

3. **Data Protection**
   - Encrypt sensitive data (bank details)
   - Use HTTPS in production
   - Implement CORS restrictions

4. **Fraud Prevention**
   - Monitor conversion rates by affiliate
   - Track click source IP addresses
   - Review unusual payout requests
   - Implement CAPTCHA on signup

---

## Monitoring and Analytics

### Key Metrics to Track

1. **Sales Metrics**
   - Total revenue
   - Average order value
   - Conversion rate

2. **Affiliate Metrics**
   - Active affiliates
   - Total clicks generated
   - Click-to-conversion rate
   - Top performing affiliates

3. **Product Metrics**
   - Best sellers
   - Low stock items
   - Products by category

4. **Financial Metrics**
   - Commission paid
   - Pending payouts
   - Revenue after commission

---

## Support & Maintenance

### Regular Maintenance Tasks

- Weekly: Check affiliate stats, monitor conversions
- Monthly: Review payout requests, analyze affiliate performance
- Quarterly: Optimize commission rates, audit fraud

### Common Admin Tasks

1. **Approve New Affiliates**
   ```
   Admin Dashboard → Affiliates → Review PENDING → Approve
   ```

2. **Process Payouts**
   ```
   Admin Dashboard → Payouts → Review Request → Process
   ```

3. **Create Product**
   ```
   Admin Dashboard → Products → New → Add Details → Publish
   ```

---

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Guide](https://nextjs.org/docs)
- [NextAuth.js Docs](https://next-auth.js.org)
- [Tailwind CSS](https://tailwindcss.com)

---

**Last Updated**: March 2026
**Version**: 1.0.0
