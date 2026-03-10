import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get affiliate data for current user
    const affiliate = await prisma.affiliate.findUnique({
      where: { userId: session.user.id },
      include: {
        affiliateLinks: {
          include: {
            product: {
              select: { id: true, name: true, price: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        clicks: {
          orderBy: { createdAt: "desc" },
          take: 100,
        },
        conversions: {
          include: {
            order: true,
          },
          orderBy: { createdAt: "desc" },
          take: 50,
        },
        payouts: {
          orderBy: { createdAt: "desc" },
          take: 20,
        },
      },
    });

    if (!affiliate) {
      return NextResponse.json(
        { error: "Affiliate account not found" },
        { status: 404 }
      );
    }

    // Calculate statistics
    const totalClicks = affiliate.clicks.length;
    const totalConversions = affiliate.conversions.length;
    const conversionRate =
      totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(2) : 0;
    const totalEarnings = affiliate.conversions.reduce(
      (sum, c) => sum + c.commission,
      0
    );
    const totalPaid = affiliate.payouts
      .filter((p) => p.status === "COMPLETED")
      .reduce((sum, p) => sum + p.amount, 0);

    return NextResponse.json({
      affiliate,
      stats: {
        totalClicks,
        totalConversions,
        conversionRate,
        totalEarnings: totalEarnings.toFixed(2),
        totalPaid: totalPaid.toFixed(2),
        pendingEarnings: (totalEarnings - totalPaid).toFixed(2),
      },
    });
  } catch (error) {
    console.error("Error fetching affiliate data:", error);
    return NextResponse.json(
      { error: "Failed to fetch affiliate data" },
      { status: 500 }
    );
  }
}
