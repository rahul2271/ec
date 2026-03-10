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

    const payouts = await prisma.payout.findMany({
      where: { affiliateId: affiliate.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ payouts });
  } catch (error) {
    console.error("Error fetching payouts:", error);
    return NextResponse.json(
      { error: "Failed to fetch payouts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { amount, method, bankName, accountNumber, notes } = body;

    // Validate amount
    if (!amount || amount <= 0 || amount < 50) {
      return NextResponse.json(
        { message: "Minimum payout amount is $50" },
        { status: 400 }
      );
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

    // Calculate pending earnings
    const completedPayouts = await prisma.payout.findMany({
      where: {
        affiliateId: affiliate.id,
        status: "COMPLETED",
      },
    });

    const totalPaidAmount = completedPayouts.reduce((sum, p) => sum + p.amount, 0);
    const pendingEarnings = Math.max(0, affiliate.totalEarnings - totalPaidAmount);

    if (amount > pendingEarnings) {
      return NextResponse.json(
        { message: "Payout amount exceeds available earnings" },
        { status: 400 }
      );
    }

    // Create payout request
    const payout = await prisma.payout.create({
      data: {
        affiliateId: affiliate.id,
        amount,
        method: method || "BANK_TRANSFER",
        status: "PENDING",
        notes:
          notes ||
          `${method || "BANK_TRANSFER"} payout request for $${amount}`,
      },
    });

    // Log for admin notification
    console.log(
      `[PAYOUT REQUEST] New payout request ID: ${payout.id} | Affiliate: ${affiliate.id} | Amount: $${amount}`
    );

    return NextResponse.json(
      {
        id: payout.id,
        amount: payout.amount,
        status: payout.status,
        method: payout.method,
        message: "Payout request submitted successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating payout request:", error);
    return NextResponse.json(
      { error: "Failed to create payout request" },
      { status: 500 }
    );
  }
}
