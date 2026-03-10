import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Helper to generate random code
const generateCode = () => Math.random().toString(36).substring(2, 11).toUpperCase();

async function main() {
  console.log("🌱 Starting database seed...");

  try {
    // Clear existing data
    console.log("Clearing existing data...");
    await prisma.affiliateConversion.deleteMany();
    await prisma.affiliateClick.deleteMany();
    await prisma.affiliateLink.deleteMany();
    await prisma.payout.deleteMany();
    await prisma.affiliate.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.review.deleteMany();
    await prisma.wishlistItem.deleteMany();
    await prisma.relatedProduct.deleteMany();
    await prisma.productSpecification.deleteMany();
    await prisma.productVariant.deleteMany();
    await prisma.product.deleteMany();
    await prisma.address.deleteMany();
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();

    // Create users
    console.log("Creating users...");
    const hashedPassword = await bcrypt.hash("password123", 10);

    const adminUser = await prisma.user.create({
      data: {
        email: "admin@example.com",
        name: "Admin User",
        passwordHash: hashedPassword,
        role: "ADMIN",
        isActive: true,
      },
    });

    const affiliateUser1 = await prisma.user.create({
      data: {
        email: "affiliate1@example.com",
        name: "John Affiliate",
        passwordHash: hashedPassword,
        role: "AFFILIATE",
        isActive: true,
      },
    });

    const affiliateUser2 = await prisma.user.create({
      data: {
        email: "affiliate2@example.com",
        name: "Sarah Affiliate",
        passwordHash: hashedPassword,
        role: "AFFILIATE",
        isActive: true,
      },
    });

    const customerUser1 = await prisma.user.create({
      data: {
        email: "customer1@example.com",
        name: "Alice Customer",
        passwordHash: hashedPassword,
        role: "CUSTOMER",
        isActive: true,
      },
    });

    const customerUser2 = await prisma.user.create({
      data: {
        email: "customer2@example.com",
        name: "Bob Customer",
        passwordHash: hashedPassword,
        role: "CUSTOMER",
        isActive: true,
      },
    });

    // Create addresses
    console.log("Creating addresses...");
    const address1 = await prisma.address.create({
      data: {
        userId: customerUser1.id,
        street: "123 Main St",
        city: "New York",
        state: "NY",
        zip: "10001",
        country: "USA",
        isDefault: true,
      },
    });

    const address2 = await prisma.address.create({
      data: {
        userId: customerUser2.id,
        street: "456 Oak Ave",
        city: "Los Angeles",
        state: "CA",
        zip: "90001",
        country: "USA",
        isDefault: true,
      },
    });

    // Create products with variants and specs
    console.log("Creating products...");

    const productData = [
      {
        name: "Premium Wireless Headphones",
        category: "Electronics",
        subcategory: "Audio",
        brand: "AudioTech",
        description: "High-quality wireless headphones with noise cancellation",
        longDescription:
          "Experience premium sound quality with our advanced wireless headphones. Features include active noise cancellation, 30-hour battery life, premium materials, and intuitive touch controls. Perfect for music lovers and professionals.",
        price: 299.99,
        cost: 150,
        stock: 50,
        sku: "AUDIO-WH-001",
        images: [
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
          "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500",
        ],
        featured: true,
      },
      {
        name: "Professional Camera Kit",
        category: "Electronics",
        subcategory: "Photography",
        brand: "CameraMax",
        description: "Complete professional camera kit for photography enthusiasts",
        longDescription:
          "Professional-grade camera kit with 4K video, advanced autofocus, weather sealing, and dual SD card slots. Includes two premium lenses and accessories.",
        price: 1299.99,
        cost: 800,
        stock: 20,
        sku: "CAM-PRO-001",
        images: [
          "https://images.unsplash.com/photo-1609034227505-5876f6aa4e90?w=500",
          "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=500",
        ],
        featured: true,
      },
      {
        name: "Organic Cotton T-Shirt",
        category: "Clothing",
        subcategory: "Tops",
        brand: "EcoWear",
        description: "100% organic cotton comfortable t-shirt",
        longDescription:
          "Made from sustainable organic cotton, this t-shirt combines comfort with environmental responsibility. Available in multiple colors and sizes.",
        price: 49.99,
        cost: 15,
        stock: 200,
        sku: "SHIRT-ORG-001",
        images: [
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
          "https://images.unsplash.com/photo-1556821552-5f394c7dc5d5?w=500",
        ],
        featured: false,
      },
      {
        name: "Smart Watch Pro",
        category: "Electronics",
        subcategory: "Wearables",
        brand: "SmartTech",
        description: "Advanced smartwatch with health monitoring",
        longDescription:
          "Track your fitness, health metrics, and daily activities with our advanced smartwatch. Features include heart rate monitoring, sleep tracking, GPS, and 7-day battery life.",
        price: 399.99,
        cost: 200,
        stock: 75,
        sku: "WATCH-SM-001",
        images: [
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
          "https://images.unsplash.com/photo-1575311373937-040b3ff6ca56?w=500",
        ],
        featured: true,
      },
      {
        name: "Premium Coffee Maker",
        category: "Home & Kitchen",
        subcategory: "Kitchen Appliances",
        brand: "BrueHome",
        description: "High-end automatic coffee maker with temperature control",
        longDescription:
          "Brew the perfect cup of coffee every time with our programmable coffee maker. Features include temperature control, 24-hour scheduling, and custom brew strength settings.",
        price: 199.99,
        cost: 100,
        stock: 30,
        sku: "COFFEE-PM-001",
        images: [
          "https://images.unsplash.com/photo-1517668808822-9ebb02ae2a0e?w=500",
          "https://images.unsplash.com/photo-1559056199-641a0ac8b3f4?w=500",
        ],
        featured: false,
      },
    ];

    const products = [];
    for (const data of productData) {
      // Generate a URL-friendly slug from the product name
      // Example: "Premium Wireless Headphones" -> "premium-wireless-headphones"
      const generatedSlug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      const product = await prisma.product.create({
        data: {
          ...data,
          slug: generatedSlug, // <-- ADDED THIS LINE
          rating: Math.random() * 2 + 3.5, // 3.5-5.5 rating
          reviewCount: Math.floor(Math.random() * 100) + 10,
          soldCount: Math.floor(Math.random() * 500) + 50,
        },
      });
      products.push(product);
    }
    

    // Create product variants
    console.log("Creating product variants...");
    await prisma.productVariant.createMany({
      data: [
        {
          productId: products[0].id,
          name: "Black",
          sku: "AUDIO-WH-001-BLK",
          price: 299.99,
          stock: 20,
          attributes: { color: "Black" },
          images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"],
        },
        {
          productId: products[0].id,
          name: "Silver",
          sku: "AUDIO-WH-001-SLV",
          price: 299.99,
          stock: 15,
          attributes: { color: "Silver" },
          images: ["https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500"],
        },
        {
          productId: products[0].id,
          name: "Gold",
          sku: "AUDIO-WH-001-GLD",
          price: 329.99,
          stock: 15,
          attributes: { color: "Gold" },
          images: ["https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500"],
        },
        {
          productId: products[2].id,
          name: "Small - Black",
          sku: "SHIRT-ORG-001-S-BLK",
          stock: 50,
          attributes: { size: "S", color: "Black" },
          images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"],
        },
        {
          productId: products[2].id,
          name: "Medium - Black",
          sku: "SHIRT-ORG-001-M-BLK",
          stock: 60,
          attributes: { size: "M", color: "Black" },
          images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"],
        },
        {
          productId: products[2].id,
          name: "Large - White",
          sku: "SHIRT-ORG-001-L-WHT",
          stock: 45,
          attributes: { size: "L", color: "White" },
          images: ["https://images.unsplash.com/photo-1556821552-5f394c7dc5d5?w=500"],
        },
      ],
    });

    // Create product specifications
    console.log("Creating product specifications...");
    await prisma.productSpecification.createMany({
      data: [
        // Headphones specs
        { productId: products[0].id, name: "Driver Size", value: "40mm", order: 1 },
        { productId: products[0].id, name: "Frequency Response", value: "20Hz - 20kHz", order: 2 },
        { productId: products[0].id, name: "Battery Life", value: "30 hours", order: 3 },
        { productId: products[0].id, name: "Weight", value: "250g", order: 4 },
        { productId: products[0].id, name: "Connection", value: "Bluetooth 5.0", order: 5 },
        // Camera specs
        { productId: products[1].id, name: "Sensor", value: "Full Frame 45MP", order: 1 },
        { productId: products[1].id, name: "ISO Range", value: "100-25,600", order: 2 },
        { productId: products[1].id, name: "Video", value: "4K 120fps", order: 3 },
        { productId: products[1].id, name: "Weight", value: "738g", order: 4 },
        // T-Shirt specs
        { productId: products[2].id, name: "Material", value: "100% Organic Cotton", order: 1 },
        { productId: products[2].id, name: "Fit", value: "Regular Fit", order: 2 },
        { productId: products[2].id, name: "Care", value: "Machine Wash Cold", order: 3 },
        // Smartwatch specs
        { productId: products[3].id, name: "Display", value: "1.4\" AMOLED", order: 1 },
        { productId: products[3].id, name: "Battery", value: "7 days", order: 2 },
        { productId: products[3].id, name: "Water Resistance", value: "5 ATM", order: 3 },
        // Coffee Maker specs
        { productId: products[4].id, name: "Capacity", value: "12 Cups", order: 1 },
        { productId: products[4].id, name: "Temperature Control", value: "195-205°F", order: 2 },
        { productId: products[4].id, name: "Power", value: "1000W", order: 3 },
      ],
    });

    // Create related products
    console.log("Creating related products...");
    await prisma.relatedProduct.createMany({
      data: [
        {
          sourceId: products[0].id,
          relatedId: products[1].id,
          relationshipType: "accessory",
        },
        {
          sourceId: products[1].id,
          relatedId: products[0].id,
          relationshipType: "accessory",
        },
        {
          sourceId: products[2].id,
          relatedId: products[3].id,
          relationshipType: "similar",
        },
      ],
    });

    // Create reviews
    console.log("Creating reviews...");
    await prisma.review.createMany({
      data: [
        {
          productId: products[0].id,
          userId: customerUser1.id,
          rating: 5,
          title: "Amazing sound quality!",
          comment: "Best headphones I've ever owned. Excellent noise cancellation.",
        },
        {
          productId: products[0].id,
          userId: customerUser2.id,
          rating: 4,
          title: "Great product, minor issues",
          comment: "Sound is amazing but battery could be better.",
        },
        {
          productId: products[1].id,
          userId: customerUser1.id,
          rating: 5,
          title: "Professional grade camera",
          comment: "Perfect for my photography business. Highly recommend!",
        },
      ],
    });

    // Create affiliates
    console.log("Creating affiliates...");
    const affiliate1 = await prisma.affiliate.create({
      data: {
        userId: affiliateUser1.id,
        affiliateCode: generateCode(),
        commissionRate: 0.15, // 15%
        status: "ACTIVE",
        bankAccountInfo: JSON.stringify({
          bankName: "Example Bank",
          accountHolder: "John Affiliate",
          accountNumber: "**** **** **** 1234",
          routingNumber: "123456789",
        }),
        totalEarnings: 1250.0,
        totalCommissions: 1250.0,
        totalPaid: 800.0,
      },
    });

    const affiliate2 = await prisma.affiliate.create({
      data: {
        userId: affiliateUser2.id,
        affiliateCode: generateCode(),
        commissionRate: 0.12, // 12%
        status: "ACTIVE",
        bankAccountInfo: JSON.stringify({
          bankName: "Another Bank",
          accountHolder: "Sarah Affiliate",
          accountNumber: "**** **** **** 5678",
          routingNumber: "987654321",
        }),
        totalEarnings: 850.0,
        totalCommissions: 850.0,
        totalPaid: 500.0,
      },
    });

    // Create affiliate links
    console.log("Creating affiliate links...");
    const affiliateLink1 = await prisma.affiliateLink.create({
      data: {
        affiliateId: affiliate1.id,
        productId: products[0].id,
        trackingCode: `AFF-${affiliate1.id.substring(0, 4)}-${generateCode()}`,
        customUrl: "https://example.com/headphones",
        clicks: 125,
        conversions: 8,
      },
    });

    const affiliateLink2 = await prisma.affiliateLink.create({
      data: {
        affiliateId: affiliate1.id,
        trackingCode: `AFF-${affiliate1.id.substring(0, 4)}-${generateCode()}`,
        clicks: 200,
        conversions: 12,
      },
    });

    const affiliateLink3 = await prisma.affiliateLink.create({
      data: {
        affiliateId: affiliate2.id,
        productId: products[1].id,
        trackingCode: `AFF-${affiliate2.id.substring(0, 4)}-${generateCode()}`,
        clicks: 95,
        conversions: 5,
      },
    });

    // Create affiliate clicks
    console.log("Creating affiliate clicks...");
    await prisma.affiliateClick.createMany({
      data: [
        {
          affiliateLinkId: affiliateLink1.id,
          affiliateId: affiliate1.id,
          ipAddress: "192.168.1.1",
          userAgent: "Mozilla/5.0...",
        },
        {
          affiliateLinkId: affiliateLink1.id,
          affiliateId: affiliate1.id,
          ipAddress: "192.168.1.2",
          userAgent: "Mozilla/5.0...",
        },
        {
          affiliateLinkId: affiliateLink2.id,
          affiliateId: affiliate1.id,
          ipAddress: "192.168.1.3",
          userAgent: "Mozilla/5.0...",
        },
      ],
    });

    // Create orders
    console.log("Creating orders...");
    const order1 = await prisma.order.create({
      data: {
        orderNumber: `ORD-${Date.now()}-1`,
        userId: customerUser1.id,
        addressId: address1.id,
        status: "DELIVERED",
        subtotal: 299.99,
        tax: 24.0,
        shipping: 10.0,
        total: 333.99,
        affiliateId: affiliate1.id,
        affiliateCommission: 44.99,
      },
    });

    const order2 = await prisma.order.create({
      data: {
        orderNumber: `ORD-${Date.now()}-2`,
        userId: customerUser2.id,
        addressId: address2.id,
        status: "PROCESSING",
        subtotal: 1299.99,
        tax: 104.0,
        shipping: 15.0,
        total: 1418.99,
        affiliateId: affiliate2.id,
        affiliateCommission: 155.99,
      },
    });

    const order3 = await prisma.order.create({
      data: {
        orderNumber: `ORD-${Date.now()}-3`,
        userId: customerUser1.id,
        addressId: address1.id,
        status: "SHIPPED",
        subtotal: 99.98,
        tax: 8.0,
        shipping: 5.0,
        total: 112.98,
      },
    });

    // Create order items
    console.log("Creating order items...");
    await prisma.orderItem.createMany({
      data: [
        {
          orderId: order1.id,
          productId: products[0].id,
          quantity: 1,
          price: 299.99,
          total: 299.99,
        },
        {
          orderId: order2.id,
          productId: products[1].id,
          quantity: 1,
          price: 1299.99,
          total: 1299.99,
        },
        {
          orderId: order3.id,
          productId: products[2].id,
          quantity: 2,
          price: 49.99,
          total: 99.98,
        },
      ],
    });

    // Create affiliate conversions
    console.log("Creating affiliate conversions...");
    await prisma.affiliateConversion.createMany({
      data: [
        {
          affiliateId: affiliate1.id,
          orderId: order1.id,
          commission: 44.99,
          status: "PAID",
        },
        {
          affiliateId: affiliate2.id,
          orderId: order2.id,
          commission: 155.99,
          status: "CONFIRMED",
        },
      ],
    });

    // Create payouts
    console.log("Creating payouts...");
    await prisma.payout.createMany({
      data: [
        {
          affiliateId: affiliate1.id,
          amount: 800.0,
          status: "COMPLETED",
          method: "BANK_TRANSFER",
          notes: "Monthly payout for January",
        },
        {
          affiliateId: affiliate1.id,
          amount: 450.0,
          status: "PENDING",
          method: "BANK_TRANSFER",
          notes: "Monthly payout for February",
        },
        {
          affiliateId: affiliate2.id,
          amount: 500.0,
          status: "COMPLETED",
          method: "BANK_TRANSFER",
          notes: "Monthly payout for January",
        },
      ],
    });

    // Create wishlist items
    console.log("Creating wishlist items...");
    await prisma.wishlistItem.createMany({
      data: [
        {
          userId: customerUser1.id,
          productId: products[1].id,
        },
        {
          userId: customerUser2.id,
          productId: products[3].id,
        },
      ],
    });

    console.log("✅ Database seeded successfully!");
    console.log("\n📝 Test Accounts:");
    console.log("Admin: admin@example.com / password123");
    console.log("Affiliate 1: affiliate1@example.com / password123");
    console.log("Affiliate 2: affiliate2@example.com / password123");
    console.log("Customer 1: customer1@example.com / password123");
    console.log("Customer 2: customer2@example.com / password123");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
