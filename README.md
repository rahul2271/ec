# Affiliate Marketplace Platform

A full-stack e-commerce platform with advanced affiliate system, product management, and analytics built with Next.js 16, React 19, and Prisma.

## Features

### Core E-Commerce
- Advanced product catalog with variants and specifications
- Product image galleries with variant-specific images
- Customer reviews and ratings system
- Shopping cart with persistent storage
- Secure checkout with address management
- Order tracking and history
- Wishlist functionality

### Affiliate System
- **Easy Link Generation**: Create unlimited referral links with unique tracking codes
- **Performance Tracking**: Real-time click and conversion metrics
- **Commission Earnings**: Automatic calculation of affiliate commissions (10-15% per sale)
- **Payout Management**: Request and track payouts with multiple payment methods
- **Analytics Dashboard**: Detailed performance metrics and earnings breakdown
- **Referral Links**: Shareable links with social sharing capability

### Admin Dashboard
- Affiliate approval and management workflow
- Commission rate customization per affiliate
- Product creation with variants and specifications
- Payout processing and history
- Sales analytics and reporting
- User management

## Tech Stack

- **Frontend**: Next.js 16, React 19.2, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Components**: Pre-built UI components from shadcn
- **Package Manager**: pnpm

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- pnpm (or npm)

### Installation

```bash
# 1. Clone and install
git clone <repo>
cd <project>
pnpm install

# 2. Generate Prisma client
npx prisma generate

# 3. Setup environment
cp .env.example .env.local
# Edit .env.local with your database URL

# 4. Create database and schema
npx prisma db push

# 5. Seed sample data
npx tsx scripts/seed.ts

# 6. Start development
pnpm dev
```

Visit `http://localhost:3000`

## Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | password123 |
| Affiliate 1 | affiliate1@example.com | password123 |
| Affiliate 2 | affiliate2@example.com | password123 |
| Customer 1 | customer1@example.com | password123 |
| Customer 2 | customer2@example.com | password123 |

## Project Structure

```
/app
├── (admin)              # Admin dashboard
├── (affiliate)          # Affiliate portal
├── (public)             # Public pages
├── (shopper)            # Customer account
└── api/                 # API routes
    ├── admin/           # Admin APIs
    ├── affiliates/      # Affiliate APIs
    ├── auth/            # Authentication
    ├── products/        # Product APIs
    ├── cart/            # Cart APIs
    └── orders/          # Order APIs

/components             # Reusable UI components
/lib                    # Database & utilities
/prisma                 # Schema & migrations
/scripts                # Database seeds
```

## Key Pages

### Public Routes
- `/` - Homepage
- `/shop` - Product listing
- `/product/[id]` - Product details with affiliate links
- `/auth/signin` - Login
- `/auth/signup` - Registration

### Customer Routes
- `/cart` - Shopping cart
- `/checkout` - Order checkout
- `/(shopper)/account` - User account

### Affiliate Routes
- `/affiliate/dashboard` - Overview and stats
- `/affiliate/links` - Manage referral links
- `/affiliate/payouts` - Payout requests and history
- `/affiliate/request-payout` - Request new payout

### Admin Routes
- `/admin/dashboard` - Admin overview
- `/admin/products` - Product management
- `/admin/users` - User management
- `/admin/orders` - Order management
- `/admin/affiliates` - Affiliate management
- `/admin/payouts` - Payout processing

## Database Schema

### Key Models
- **User**: Authentication and role-based access
- **Product**: Core product with variants and specs
- **ProductVariant**: Color, size, and other options
- **ProductSpecification**: Key product features
- **Affiliate**: Affiliate accounts and commission settings
- **AffiliateLink**: Referral links with tracking
- **AffiliateConversion**: Tracked commissions
- **Order**: Customer orders
- **Payout**: Affiliate payouts

Full schema in `prisma/schema.prisma`

## Affiliate Workflow

### How Affiliates Earn

```
1. Affiliate signs up and is approved by admin
2. Generates referral link from dashboard
3. Shares link: domain.com/product/[slug]?ref=[TRACKING_CODE]
4. Customer clicks link and makes purchase
5. Sale is attributed to affiliate
6. Commission calculated (subtotal × commission rate)
7. Affiliate can request payout when balance > $50
8. Admin processes payout
9. Payment transferred to affiliate's bank
```

### Commission Structure
- **Default Rate**: 10-15% of order subtotal
- **Customizable**: Different rates per affiliate
- **Tracking**: Unique tracking codes for each link
- **Payout**: Minimum $50, 5-7 business days processing

## API Routes

### Affiliate APIs
```
POST   /api/affiliates/links              # Generate referral link
GET    /api/affiliates/links              # List affiliate links
GET    /api/affiliates/stats              # Get performance stats
POST   /api/affiliates/payouts            # Request payout
GET    /api/affiliates/payouts            # View payout history
```

### Admin APIs
```
GET    /api/admin/affiliates              # List all affiliates
PUT    /api/admin/affiliates/[id]         # Update affiliate status
POST   /api/admin/payouts/[id]            # Process payout
POST   /api/admin/products                # Create product
```

### Product APIs
```
GET    /api/products                      # List products
GET    /api/products/[id]                 # Get product details
POST   /api/products                      # Create product (admin)
```

## Configuration

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:pass@localhost/db"

# Authentication
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Optional: Stripe Integration
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

## Development

### Running Tests
```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e
```

### Database Migrations
```bash
# Create migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Seed database
npx tsx scripts/seed.ts
```

### Code Quality
```bash
# Format code
pnpm format

# Lint
pnpm lint
```

## Production Deployment

### Vercel Deployment

```bash
# 1. Push to GitHub
git push

# 2. Import in Vercel dashboard
# 3. Set environment variables
# 4. Deploy

# Run migrations
npx prisma db push
```

### Production Checklist
- [ ] Secure NEXTAUTH_SECRET
- [ ] Production DATABASE_URL
- [ ] HTTPS enabled
- [ ] Email service configured
- [ ] Payment processing active
- [ ] Error tracking setup
- [ ] Database backups enabled

## Documentation

- **SETUP_GUIDE.md** - Quick start guide
- **DOCUMENTATION.md** - Comprehensive documentation
- **SCHEMAS_AND_WORKFLOWS.md** - Database schema details
- **API_REFERENCE.md** - Complete API documentation

## Support

### Troubleshooting

**"Prisma client not found"**
```bash
npx prisma generate
```

**Database connection error**
- Verify DATABASE_URL in .env.local
- Ensure PostgreSQL is running
- Check database exists

**Authentication issues**
- Clear browser cookies
- Verify NEXTAUTH_SECRET
- Check user exists in database

### Common Tasks

**Approve affiliate**
1. Visit `/admin/affiliates`
2. Find pending affiliate
3. Click "Approve"

**Create product**
1. Visit `/admin/products`
2. Click "New Product"
3. Fill details and variants
4. Publish

**Process payout**
1. Visit `/admin/payouts`
2. Review request
3. Click "Process"
4. Update status when complete

## Performance

- Optimized queries with Prisma select
- Database indexing on frequently queried fields
- Client-side caching with SWR
- Image optimization with Next.js Image
- CSS-in-JS with Tailwind CSS

## Security

- Password hashing with bcrypt
- Session-based authentication
- Role-based access control
- Input validation and sanitization
- CORS configuration
- SQL injection prevention via Prisma

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature/name`
5. Open pull request

## License

MIT License - see LICENSE file for details

## Support & Contact

For questions or support:
- Check documentation in `DOCUMENTATION.md`
- Review API routes in `/app/api`
- Check sample data in `scripts/seed.ts`
- Open an issue on GitHub

---

**Built with Next.js 16 | React 19 | Tailwind CSS | Prisma**

Made with for affiliate marketers and e-commerce platforms.
