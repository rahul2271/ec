import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const trackingCode = searchParams.get('ref')
    const productId = searchParams.get('product')

    if (!trackingCode) {
      return NextResponse.json(
        { error: 'Missing tracking code' },
        { status: 400 }
      )
    }

    // Find affiliate link
    const affiliateLink = await prisma.affiliateLink.findUnique({
      where: { trackingCode },
    })

    if (!affiliateLink) {
      return NextResponse.json(
        { error: 'Invalid tracking code' },
        { status: 404 }
      )
    }

    // Record the click
    await prisma.affiliateClick.create({
      data: {
        affiliateLinkId: affiliateLink.id,
        affiliateId: affiliateLink.affiliateId,
        productId: productId || undefined,
      },
    })

    // Redirect to product or shop
    if (productId) {
      return NextResponse.redirect(
        new URL(`/product/${productId}?ref=${trackingCode}`, request.url)
      )
    } else {
      return NextResponse.redirect(
        new URL(`/shop?ref=${trackingCode}`, request.url)
      )
    }
  } catch (error) {
    console.error('Click tracking error:', error)
    return NextResponse.json(
      { error: 'Tracking failed' },
      { status: 500 }
    )
  }
}
