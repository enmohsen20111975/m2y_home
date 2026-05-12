import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { db } from '@/lib/db';

const SHARED_SECRET = process.env.SHARED_SECRET || '';

/**
 * POST /api/payment/webhook
 * Webhook endpoint for m2y.net to notify about payment status
 *
 * Expected JWT payload from m2y.net:
 * {
 *   user_id: string,
 *   plan: string,
 *   payment_status: 'success' | 'failed',
 *   amount: number,
 *   billing_period: 'monthly' | 'yearly',
 *   transaction_id?: string,
 *   payment_method?: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      console.error('[Payment Webhook] No token provided');
      return NextResponse.json(
        { success: false, error: 'Token is required' },
        { status: 400 }
      );
    }

    if (!SHARED_SECRET) {
      console.error('[Payment Webhook] SHARED_SECRET not configured');
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Verify JWT token from m2y.net
    let decoded: {
      user_id: string;
      plan: string;
      payment_status: string;
      amount?: number;
      billing_period?: string;
      transaction_id?: string;
      payment_method?: string;
    };

    try {
      decoded = jwt.verify(token, SHARED_SECRET) as typeof decoded;
    } catch (jwtError) {
      console.error('[Payment Webhook] JWT verification failed:', jwtError);
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const { user_id, plan, payment_status, billing_period = 'monthly', payment_method = 'paymob' } = decoded;

    console.log('[Payment Webhook] Received:', {
      user_id,
      plan,
      payment_status,
      billing_period,
      payment_method
    });

    // Find the subscription plan
    const subscriptionPlan = await db.subscriptionPlan.findUnique({
      where: { id: plan },
    });

    if (!subscriptionPlan) {
      console.error('[Payment Webhook] Plan not found:', plan);
      return NextResponse.json(
        { success: false, error: 'Plan not found' },
        { status: 404 }
      );
    }

    if (payment_status === 'success') {
      // Calculate subscription duration
      const startDate = new Date();
      const expiresAt = new Date();

      if (billing_period === 'yearly') {
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);
      } else {
        expiresAt.setMonth(expiresAt.getMonth() + 1);
      }

      // Create or update subscription
      await db.userSubscription.upsert({
        where: { user_id },
        create: {
          user_id,
          plan_id: subscriptionPlan.id,
          status: 'active',
          started_at: startDate,
          expires_at: expiresAt,
          payment_method: payment_method,
          auto_renew: false,
        },
        update: {
          plan_id: subscriptionPlan.id,
          status: 'active',
          started_at: startDate,
          expires_at: expiresAt,
          payment_method: payment_method,
        },
      });

      // Update user's subscription tier
      const tier = subscriptionPlan.name;
      await db.user.update({
        where: { id: user_id },
        data: { subscription_tier: tier },
      });

      console.log(`[Payment Webhook] Subscription activated for user ${user_id}, plan ${plan}`);

      return NextResponse.json({
        success: true,
        message: 'Subscription activated successfully',
        subscription: {
          plan: subscriptionPlan.name,
          plan_name_ar: subscriptionPlan.name_ar,
          expires_at: expiresAt.toISOString(),
        }
      });
    } else {
      // Payment failed
      console.log(`[Payment Webhook] Payment failed for user ${user_id}, plan ${plan}`);

      return NextResponse.json({
        success: false,
        message: 'Payment was not successful'
      });
    }
  } catch (error) {
    console.error('[Payment Webhook] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/payment/webhook
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Payment webhook endpoint is active',
    timestamp: new Date().toISOString()
  });
}
