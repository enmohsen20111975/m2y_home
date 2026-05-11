import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db';

const PAYMOB_HMAC_SECRET = process.env.PAYMOB_HMAC_SECRET || '';

// Paymob HMAC fields for transaction processed callback
const HMAC_FIELDS = [
  'amount_cents',
  'created_at',
  'currency',
  'error_occured',
  'has_parent_transaction',
  'id',
  'integration_id',
  'is_3d_secure',
  'is_auth',
  'is_capture',
  'is_refunded',
  'is_standalone_payment',
  'is_voided',
  'order.id',
  'order.merchant_order_id',
  'owner',
  'pending',
  'source_data.pan',
  'source_data.sub_type',
  'source_data.type',
  'success',
];

function verifyHmac(data: Record<string, unknown>, hmacSecret: string): boolean {
  try {
    const hmacString = HMAC_FIELDS.map(field => {
      const value = field.split('.').reduce((obj: Record<string, unknown> | unknown, key) => {
        if (obj && typeof obj === 'object') {
          return (obj as Record<string, unknown>)[key];
        }
        return '';
      }, data);
      return value ?? '';
    }).join('');

    const calculatedHmac = crypto
      .createHmac('sha512', hmacSecret)
      .update(hmacString)
      .digest('hex');

    const receivedHmac = data.hmac as string;
    return calculatedHmac === receivedHmac;
  } catch (error) {
    console.error('[Paymob HMAC Verification Error]', error);
    return false;
  }
}

function extractMerchantOrderId(data: Record<string, unknown>): string | null {
  try {
    const order = data.order as Record<string, unknown>;
    return order?.merchant_order_id as string || null;
  } catch {
    return null;
  }
}

function extractUserIdFromOrderId(merchantOrderId: string): string | null {
  try {
    const parts = merchantOrderId.split('-');
    // GLM-{userId}-{planId}-{timestamp}
    if (parts.length >= 4 && parts[0] === 'GLM') {
      return parts[1];
    }
    return null;
  } catch {
    return null;
  }
}

function extractPlanIdFromOrderId(merchantOrderId: string): string | null {
  try {
    const parts = merchantOrderId.split('-');
    // GLM-{userId}-{planId}-{timestamp}
    if (parts.length >= 4 && parts[0] === 'GLM') {
      return parts[2];
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * POST /api/paymob/callback
 * Handle Paymob transaction callback
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('[Paymob Callback] Received:', JSON.stringify(body, null, 2));

    // Verify HMAC for security
    if (PAYMOB_HMAC_SECRET && !verifyHmac(body, PAYMOB_HMAC_SECRET)) {
      console.error('[Paymob Callback] HMAC verification failed');
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 400 }
      );
    }

    const success = body.success === true || body.success === 'true';
    const pending = body.pending === true || body.pending === 'true';
    const merchantOrderId = extractMerchantOrderId(body);

    if (!merchantOrderId) {
      console.error('[Paymob Callback] No merchant order ID found');
      return NextResponse.json({ success: false, error: 'No order ID' }, { status: 400 });
    }

    const userId = extractUserIdFromOrderId(merchantOrderId);
    const planId = extractPlanIdFromOrderId(merchantOrderId);

    if (!userId || !planId) {
      console.error('[Paymob Callback] Could not extract user/plan from order ID');
      return NextResponse.json({ success: false, error: 'Invalid order format' }, { status: 400 });
    }

    if (success && !pending) {
      // Payment successful - update user subscription
      const plan = await db.subscriptionPlan.findUnique({
        where: { id: planId },
      });

      if (plan) {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1); // 1 month subscription

        // Update or create UserSubscription
        await db.userSubscription.upsert({
          where: { user_id: userId },
          create: {
            user_id: userId,
            plan_id: plan.id,
            status: 'active',
            started_at: startDate,
            expires_at: endDate,
            payment_method: 'paymob',
          },
          update: {
            plan_id: plan.id,
            status: 'active',
            started_at: startDate,
            expires_at: endDate,
            payment_method: 'paymob',
          },
        });

        // Update user's subscription tier
        const tier = plan.name === 'premium' ? 'premium' : plan.name === 'normal' ? 'normal' : 'free';
        await db.user.update({
          where: { id: userId },
          data: { subscription_tier: tier },
        });

        console.log(`[Paymob Callback] Subscription activated for user ${userId}, plan ${planId}`);
      }
    } else if (!success && !pending) {
      console.log(`[Paymob Callback] Payment failed for order ${merchantOrderId}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[POST /api/paymob/callback] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/paymob/callback
 * Handle redirect after payment
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const success = searchParams.get('success');
  const orderId = searchParams.get('order');

  // Redirect to subscription page with status
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const redirectUrl = success === 'true'
    ? `${baseUrl}/?payment=success&order=${orderId}`
    : `${baseUrl}/?payment=failed&order=${orderId}`;

  return NextResponse.redirect(redirectUrl);
}
