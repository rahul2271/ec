// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/db";

// export async function GET(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const product = await prisma.product.findUnique({
//       where: { id: params.id },
//       include: {
//         reviews: {
//           include: {
//             user: {
//               select: { id: true, name: true },
//             },
//           },
//           take: 10,
//           orderBy: { createdAt: "desc" },
//         },
//         affiliateLinks: {
//           where: { isActive: true },
//           select: { id: true, trackingCode: true },
//         },
//       },
//     });

//     if (!product) {
//       return NextResponse.json(
//         { error: "Product not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(product);
//   } catch (error) {
//     console.error("Error fetching product:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch product" },
//       { status: 500 }
//     );
//   }
// }


import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // 1. Type params as a Promise
) {
  try {
    // 2. Await the params to safely unwrap the ID
    const resolvedParams = await params;
    const productId = resolvedParams.id;

    const product = await prisma.product.findUnique({
      where: { id: productId }, // 3. Use the unwrapped ID
      include: {
        reviews: {
          include: {
            user: {
              select: { id: true, name: true },
            },
          },
          take: 10,
          orderBy: { createdAt: "desc" },
        },
        affiliateLinks: {
          // 4. Removed the invalid `where: { isActive: true }` filter
          select: { id: true, trackingCode: true },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}