import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/db'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature') || ''

  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any
        
        if (session.payment_status === 'paid') {
          const userId = session.metadata?.userId

          if (!userId) {
            console.error('No userId in session metadata')
            break
          }

          // Update order status to CONFIRMED
          await prisma.order.updateMany({
            where: {
              userId: userId,
              status: 'PENDING',
            },
            data: {
              status: 'CONFIRMED',
            },
          })

          // Track affiliate conversion if present
          if (session.metadata?.affiliateCode) {
            const affiliateLink = await prisma.affiliateLink.findUnique({
              where: { trackingCode: session.metadata.affiliateCode },
            })

            if (affiliateLink) {
              const order = await prisma.order.findFirst({
                where: { userId },
                orderBy: { createdAt: 'desc' },
              })

              if (order) {
                const commissionRate = 0.1 // 10% default

                await prisma.affiliateConversion.create({
                  data: {
                    affiliateId: affiliateLink.affiliateId,
                    orderId: order.id,
                    commission: order.total * commissionRate,
                    status: 'COMPLETED',
                  },
                })
              }
            }
          }
        }
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as any

        // Find order by Stripe charge ID and update status
        // This is simplified - in production you'd need to track charge IDs
        console.log('Refund processed:', charge.id)
        break
      }

      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
