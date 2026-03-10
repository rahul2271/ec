# Quick Setup Guide

## 5-Minute Quick Start

### Step 1: Install & Configure
```bash
# Install dependencies
pnpm install

# Generate Prisma client
npx prisma generate

# Copy and configure environment
cp .env.example .env.local
# Edit .env.local with your database URL
```

### Step 2: Database
```bash
# Create and push schema
npx prisma db push

# Seed with sample data
npx tsx scripts/seed.ts
```

### Step 3: Run
```bash
pnpm dev
```

Visit http://localhost:3000

---

## Test Accounts

Use these to explore the platform:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | password123 |
| Affiliate | affiliate1@example.com | password123 |
| Customer | customer1@example.com | password123 |

---

## System Overview

### Three User Types

**Customers**
- Browse and purchase products
- Leave reviews
- Build wishlists

**Affiliates**
- Generate referral links
- Track clicks and commissions
- Request payouts

**Admins**
- Approve/suspend affiliates
- Manage products
- Process payouts

---

## Key Workflows

### Customer Buys via Affiliate Link
```
1. Affiliate shares: domain.com/product/item?ref=AFF-XXXX
2. Customer clicks link
3. Link tracked in database
4. Customer completes purchase
5. Affiliate earns 10-15% commission
6. Affiliate requests payout when balance > $50
7. Admin processes payout
```

### Affiliate Gets Approved
```
1. New affiliate signs up
2. Admin approves in /admin/affiliates
3. Affiliate status changes to ACTIVE
4. Affiliate can now generate links
5. Commissions earned on referred sales
```

---

## What's Included

### Database Features
- ✅ Product variants (color, size, etc)
- ✅ Product specifications
- ✅ Related products
- ✅ Customer reviews
- ✅ Affiliate tracking (clicks & conversions)
- ✅ Commission calculation
- ✅ Payout management

### Pages Built
- ✅ Product listing with filters
- ✅ Product details with gallery
- ✅ Affiliate dashboard
- ✅ Affiliate payout requests
- ✅ Admin affiliate management
- ✅ Admin product management
- ✅ Shopping cart
- ✅ Checkout
- ✅ Auth pages (signin/signup)

### API Routes
- ✅ Product API (list, get, create)
- ✅ Affiliate links API
- ✅ Affiliate stats API
- ✅ Payout request API
- ✅ Admin affiliate management API
- ✅ Cart API
- ✅ Order API

---

## Customization Examples

### Change Commission Rate
```typescript
// In /app/api/admin/affiliates/[id]/route.ts
await prisma.affiliate.update({
  where: { id: affiliateId },
  data: { commissionRate: 0.20 } // 20%
});
```

### Change Minimum Payout
```typescript
// In /app/api/affiliates/payouts/route.ts
const MIN_PAYOUT = 50; // Change this
```

### Add New Product Field
```prisma
// In prisma/schema.prisma
model Product {
  // ... existing fields
  seoTitle String?    // New field
  seoDescription String?
}
```

---

## Common Issues

### "Cannot find module @prisma/client"
```bash
npx prisma generate
```

### Database connection error
- Check DATABASE_URL in .env.local
- Ensure PostgreSQL is running
- Create database: `createdb affiliate_db`

### Auth not working
- Check NEXTAUTH_SECRET is set
- Clear browser cookies
- Verify user exists in database

### Affiliate links not tracking
- Verify affiliate status is ACTIVE
- Check URL has tracking code: `?ref=AFF-XXXX`
- Check affiliate account approved by admin

---

## Next Steps

1. **Customize Branding**
   - Update colors in `app/globals.css`
   - Modify logo in `components/header.tsx`
   - Update company info in footer

2. **Add Your Products**
   - Visit `/admin/products`
   - Click "New Product"
   - Add details, variants, specifications

3. **Create Affiliate Accounts**
   - Use `/auth/signup` to register new affiliates
   - Go to `/admin/affiliates` and approve them
   - They can now generate links!

4. **Set Up Payment Processing**
   - Integrate Stripe for customer payments
   - Configure bank transfer for affiliate payouts
   - Add webhook handlers

5. **Connect Email Service**
   - Setup email for order confirmations
   - Notify affiliates of new payouts
   - Send payout receipts

---

## File Structure Quick Reference

```
Key files to customize:

components/header.tsx          - Navigation & logo
app/(public)/page.tsx          - Homepage
app/(public)/shop/page.tsx     - Product listing
app/(public)/product/[id]/page.tsx - Product details
app/(affiliate)/dashboard/page.tsx - Affiliate dashboard
app/(admin)/products/page.tsx   - Admin products
lib/db.ts                      - Database client
prisma/schema.prisma           - Database schema
scripts/seed.ts                - Sample data
```

---

## Deployment

### Deploy to Vercel

```bash
# 1. Push code to GitHub
git push

# 2. Import project in Vercel dashboard
# 3. Set environment variables in Vercel
# 4. Deploy

# Run migrations in production
npx prisma db push
```

### Production Checklist

- [ ] Set secure NEXTAUTH_SECRET
- [ ] Update DATABASE_URL for production
- [ ] Configure NEXT_PUBLIC_APP_URL
- [ ] Enable HTTPS
- [ ] Setup email service
- [ ] Test affiliate links
- [ ] Verify payment processing
- [ ] Monitor payout requests
- [ ] Set up error tracking

---

## Support

For issues or questions:
1. Check DOCUMENTATION.md for detailed info
2. Review API routes in `/app/api`
3. Check database schema in `prisma/schema.prisma`
4. Review test accounts for example workflows

---

**Happy Building!** 🚀
