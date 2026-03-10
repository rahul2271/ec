import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all orders
    const orders = await prisma.order.findMany({
      include: { items: true },
    });

    // Get all users
    const users = await prisma.user.findMany();

    // Get all affiliates
    const affiliates = await prisma.affiliate.findMany();

    // Calculate stats
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const totalOrders = orders.length;
    const totalUsers = users.length;
    const totalAffiliates = affiliates.length;

    // Orders by status
    const ordersByStatus = {
      PENDING: orders.filter((o) => o.status === "PENDING").length,
      CONFIRMED: orders.filter((o) => o.status === "CONFIRMED").length,
      SHIPPED: orders.filter((o) => o.status === "SHIPPED").length,
      DELIVERED: orders.filter((o) => o.status === "DELIVERED").length,
      CANCELLED: orders.filter((o) => o.status === "CANCELLED").length,
    };

    // Top products
    const productStats = new Map();
    orders.forEach((order) => {
      order.items.forEach((item) => {
        const key = item.productId;
        if (!productStats.has(key)) {
          productStats.set(key, { count: 0, revenue: 0 });
        }
        const stat = productStats.get(key);
        stat.count += item.quantity;
        stat.revenue += item.total;
      });
    });

    const topProducts = Array.from(productStats.entries())
      .map(([id, stat]) => ({ productId: id, ...stat }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return NextResponse.json({
      totalRevenue: totalRevenue.toFixed(2),
      totalOrders,
      totalUsers,
      totalAffiliates,
      ordersByStatus,
      topProducts,
      averageOrderValue: (totalRevenue / totalOrders).toFixed(2),
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
