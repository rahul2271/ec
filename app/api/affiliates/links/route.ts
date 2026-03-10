import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const generateTrackingCode = () => {
  return `AFF-${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
};

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { productId, customUrl } = body;

    // Get affiliate
    const affiliate = await prisma.affiliate.findUnique({
      where: { userId: session.user.id },
      select: {
        id: true,
        affiliateCode: true,
        status: true,
        commissionRate: true,
      },
    });

    if (!affiliate) {
      return NextResponse.json(
        { error: "Affiliate account not found" },
        { status: 404 }
      );
    }

    if (affiliate.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Affiliate account is not active" },
        { status: 403 }
      );
    }

    // Generate unique tracking code
    const trackingCode = generateTrackingCode();

    // Get product if specified
    let product = null;
    if (productId) {
      product = await prisma.product.findUnique({
        where: { id: productId },
        select: { id: true, name: true, price: true, slug: true },
      });

      if (!product) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }
    }

    // Create affiliate link
    const link = await prisma.affiliateLink.create({
      data: {
        affiliateId: affiliate.id,
        productId: productId || null,
        trackingCode,
        customUrl,
      },
    });

    // Build share URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const shareUrl = product
      ? `${baseUrl}/product/${product.slug}?ref=${trackingCode}`
      : `${baseUrl}/?ref=${trackingCode}`;

    return NextResponse.json(
      {
        id: link.id,
        trackingCode: link.trackingCode,
        shareUrl,
        product,
        commissionRate: affiliate.commissionRate,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating affiliate link:", error);
    return NextResponse.json(
      { error: "Failed to create affiliate link" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const affiliate = await prisma.affiliate.findUnique({
      where: { userId: session.user.id },
    });

    if (!affiliate) {
      return NextResponse.json(
        { error: "Affiliate account not found" },
        { status: 404 }
      );
    }

    const links = await prisma.affiliateLink.findMany({
      where: { affiliateId: affiliate.id },
      include: {
        product: {
          select: { id: true, name: true, price: true, slug: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Add shareUrl for each link
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const enrichedLinks = links.map((link) => ({
      ...link,
      shareUrl: link.product
        ? `${baseUrl}/product/${link.product.slug}?ref=${link.trackingCode}`
        : `${baseUrl}/?ref=${link.trackingCode}`,
    }));

    return NextResponse.json(enrichedLinks);
  } catch (error) {
    console.error("Error fetching affiliate links:", error);
    return NextResponse.json(
      { error: "Failed to fetch affiliate links" },
      { status: 500 }
    );
  }
}
