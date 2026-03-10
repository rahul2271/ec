import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const skip = parseInt(searchParams.get("skip") || "0");
    const take = parseInt(searchParams.get("take") || "20");
    const search = searchParams.get("search");

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      total,
      pages: Math.ceil(total / take),
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
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

    const contentType = request.headers.get("content-type") || "";

    let productData: any;

    if (contentType.includes("multipart/form-data")) {
      // Handle FormData with file uploads
      const formData = await request.formData();

      productData = {
        name: formData.get("name") as string,
        slug: formData.get("slug") as string,
        description: formData.get("description") as string,
        longDescription: formData.get("longDescription") as string,
        price: parseFloat(formData.get("price") as string),
        cost: formData.get("cost") ? parseFloat(formData.get("cost") as string) : null,
        stock: parseInt(formData.get("stock") as string),
        sku: formData.get("sku") as string,
        category: formData.get("category") as string,
        subcategory: formData.get("subcategory") as string || null,
        brand: formData.get("brand") as string || null,
        images: [] as string[],
      };

      // Handle image uploads
      const imageFiles = formData.getAll("images") as File[];
      for (const file of imageFiles) {
        if (file.size > 0) {
          // In production, upload to cloud storage
          // For now, store base64 (not recommended for production)
          const buffer = await file.arrayBuffer();
          const base64 = Buffer.from(buffer).toString("base64");
          productData.images.push(`data:${file.type};base64,${base64}`);
        }
      }
    } else {
      // Handle JSON request
      const body = await request.json();
      productData = {
        name: body.name,
        slug: body.slug || body.name.toLowerCase().replace(/\s+/g, "-"),
        description: body.description,
        longDescription: body.longDescription,
        price: parseFloat(body.price),
        cost: body.cost ? parseFloat(body.cost) : null,
        stock: parseInt(body.stock) || 0,
        sku: body.sku,
        category: body.category,
        subcategory: body.subcategory,
        brand: body.brand,
        images: body.images || [],
      };
    }

    if (!productData.name || !productData.price || !productData.category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name: productData.name,
        slug: productData.slug,
        description: productData.description,
        longDescription: productData.longDescription,
        price: productData.price,
        cost: productData.cost,
        stock: productData.stock,
        sku: productData.sku,
        category: productData.category,
        subcategory: productData.subcategory,
        brand: productData.brand,
        images: productData.images,
        active: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
