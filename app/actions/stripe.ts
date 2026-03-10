'use server'

import { stripe } from '@/lib/stripe'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function startCheckoutSession(items: Array<{ productId: string; quantity: number }>) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  // Fetch products and build line items
  const lineItems: any[] = []
  let affiliateCode = ''

  for (const item of items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
    })

    if (!product) {
      throw new Error(`Product ${item.productId} not found`)
    }

    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: product.name,
          description: product.description || undefined,
        },
        unit_amount: Math.round(product.price * 100),
      },
      quantity: item.quantity,
    })
  }

  // Create Checkout Session
  const checkoutSession = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    redirect_on_completion: 'never',
    line_items: lineItems,
    mode: 'payment',
    customer_email: session.user.email || undefined,
    metadata: {
      userId: session.user.id,
      affiliateCode: affiliateCode,
    },
  })

  return checkoutSession.client_secret
}

export async function validateCheckoutSession(sessionId: string) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId)

  if (
    checkoutSession.payment_status === 'paid' &&
    checkoutSession.customer_email === session.user.email
  ) {
    return {
      success: true,
      sessionId: checkoutSession.id,
    }
  }

  return {
    success: false,
    error: 'Payment not completed',
  }
}
