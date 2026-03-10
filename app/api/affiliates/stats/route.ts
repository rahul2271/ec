import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

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

    // Get stats
    const links = await prisma.affiliateLink.findMany({
      where: { affiliateId: affiliate.id },
    });

    const conversions = await prisma.affiliateConversion.findMany({
      where: { affiliateId: affiliate.id },
    });

    const payouts = await prisma.payout.findMany({
      where: {
        affiliateId: affiliate.id,
        status: "COMPLETED",
      },
    });

    const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);
    const totalConversions = conversions.length;
    const conversionRate =
      totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;
    const pendingEarnings =
      affiliate.totalEarnings - payouts.reduce((sum, p) => sum + p.amount, 0);

    return NextResponse.json({
      totalEarnings: affiliate.totalEarnings,
      totalCommissions: affiliate.totalCommissions,
      totalPaid: affiliate.totalPaid,
      pendingEarnings: Math.max(0, pendingEarnings),
      totalClicks,
      totalConversions,
      conversionRate: parseFloat(conversionRate.toFixed(2)),
      activeLinks: links.filter((l) => l.clicks > 0).length,
    });
  } catch (error) {
    console.error("Error fetching affiliate stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch affiliate stats" },
      { status: 500 }
    );
  }
}
