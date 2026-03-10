import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// Simple in-memory settings storage (in production, use database)
let settings = {
  storeName: "My Store",
  storeEmail: "support@mystore.com",
  affiliateCommissionDefault: 10,
  minPayoutAmount: 50,
  storeDescription: "",
  supportEmail: "support@mystore.com",
};

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    settings = {
      ...settings,
      ...body,
    };

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
