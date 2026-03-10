import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// PUT - Update affiliate status
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { status, action, notes, commissionRate } = body;

    const affiliate = await prisma.affiliate.findUnique({
      where: { id: params.id },
    });

    if (!affiliate) {
      return NextResponse.json(
        { error: "Affiliate not found" },
        { status: 404 }
      );
    }

    // Update affiliate
    const updatedAffiliate = await prisma.affiliate.update({
      where: { id: params.id },
      data: {
        ...(status && { status }),
        ...(commissionRate && { commissionRate }),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    // Log admin action
    console.log(
      `[ADMIN] ${action || "Update"} affiliate ${params.id} | Status: ${status || affiliate.status} | Admin: ${session.user?.id}`
    );

    return NextResponse.json({
      ...updatedAffiliate,
      message: `Affiliate ${action || "updated"} successfully`,
    });
  } catch (error) {
    console.error("Error updating affiliate:", error);
    return NextResponse.json(
      { error: "Failed to update affiliate" },
      { status: 500 }
    );
  }
}
