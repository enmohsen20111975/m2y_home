/**
 * Payment Result & Webhook Routes
 * Handles Paymob callbacks and redirects
 */

const express = require('express');
const router = express.Router();
const axios = require('axios');
const jwt = require('jsonwebtoken');
const paymobService = require('../services/paymob');
const pendingPayments = require('../services/pendingPayments');

const SHARED_SECRET = process.env.SHARED_SECRET || 'K4l3m3tL1c2h4a5n6g7e8f9i0o1p2q3r4s5t6u7v8w9x0y1z2a3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2';

/**
 * Send webhook notification to subdomain
 */
async function notifySubdomain(paymentData, paymentStatus) {
    const { source, user_id, plan, amount, payment_type, billing_period } = paymentData;
    
    // Determine webhook URL based on source
    const webhookUrls = {
        'invist': 'https://invist.m2y.net/api/payment/webhook',
        'engsuite': 'https://engsuite.m2y.net/api/payment/webhook',
        'glminvestment': 'https://invist.m2y.net/api/payment/webhook',
    };
    
    const webhookUrl = webhookUrls[source];
    if (!webhookUrl) {
        console.log(`[Webhook] No webhook URL for source: ${source}`);
        return;
    }
    
    // Create JWT token for subdomain
    const token = jwt.sign(
        {
            user_id,
            plan,
            payment_status: paymentStatus,
            amount,
            billing_period: billing_period || 'monthly',
            payment_method: payment_type,
            source,
            timestamp: Date.now()
        },
        SHARED_SECRET,
        { expiresIn: '5m' }
    );
    
    try {
        console.log(`[Webhook] Notifying ${source} at ${webhookUrl}`);
        const response = await axios.post(webhookUrl, { token }, {
            timeout: 10000,
            headers: { 'Content-Type': 'application/json' }
        });
        console.log(`[Webhook] ${source} responded:`, response.data);
    } catch (error) {
        console.error(`[Webhook] Failed to notify ${source}:`, error.message);
    }
}

/**
 * GET /payment/result
 * Paymob redirects user here after payment attempt
 * Query params: ?success=true&mid=ORDER_ID
 */
router.get('/payment/result', async (req, res) => {
    const { success, mid } = req.query;

    console.log(`[PaymentResult] Received: success=${success}, mid=${mid}`);

    if (!mid) {
        return res.status(400).render('error', {
            title: 'Invalid Request',
            message: 'Missing payment reference ID',
            error: null
        });
    }

    try {
        // Retrieve pending payment data
        const paymentData = await pendingPayments.get(mid);

        if (!paymentData) {
            console.warn(`[PaymentResult] No pending payment found for mid: ${mid}`);
            return res.status(404).render('error', {
                title: 'Payment Not Found',
                message: 'Payment session expired or invalid. Please try again.',
                error: null
            });
        }

        // Determine redirect URL
        const redirectUrl = success === 'true' || success === true
            ? paymentData.return_success
            : paymentData.return_fail;

        // Notify subdomain about payment result
        const paymentStatus = success === 'true' || success === true ? 'success' : 'failed';
        await notifySubdomain(paymentData, paymentStatus);

        // Cleanup: delete pending payment
        await pendingPayments.delete(mid);

        console.log(`[PaymentResult] Redirecting to: ${redirectUrl} (success=${success})`);

        // Redirect to subdomain
        res.redirect(302, redirectUrl);

    } catch (error) {
        console.error('[PaymentResult] Error:', error.message);
        res.status(500).render('error', {
            title: 'Payment Error',
            message: 'An error occurred processing your payment. Please try again.',
            error: { message: error.message }
        });
    }
});

/**
 * POST /api/paymob_card/processed
 * Paymob immediate notification when transaction is being processed
 */
router.post('/api/paymob_card/processed', async (req, res) => {
    console.log('[Webhook] Card processed notification received:', req.body);
    res.status(200).json({ received: true });
});

/**
 * POST /api/paymob_card/response
 * Paymob final response webhook (with HMAC verification)
 */
router.post('/api/paymob_card/response', async (req, res) => {
    try {
        // Verify HMAC signature
        const isValid = paymobService.verifyWebhookHMAC(req);
        if (!isValid) {
            console.error('[Webhook] Invalid HMAC signature for card response');
            return res.status(403).json({ error: 'Invalid signature' });
        }

        const { obj } = req.body; // Paymob sends { obj: { ... } }
        console.log('[Webhook] Card response received:', JSON.stringify(obj).substring(0, 200));

        // Extract order info and notify subdomain
        if (obj && obj.order && obj.order.id) {
            const paymentData = await pendingPayments.get(String(obj.order.id));
            if (paymentData) {
                const paymentStatus = obj.success === true ? 'success' : 'failed';
                await notifySubdomain(paymentData, paymentStatus);
            }
        }

        res.status(200).json({ received: true, processed: true });
    } catch (error) {
        console.error('[Webhook] Card response error:', error.message);
        res.status(500).json({ error: 'Processing failed' });
    }
});

/**
 * POST /api/paymob_poket/processed
 * Wallet processed notification
 */
router.post('/api/paymob_poket/processed', async (req, res) => {
    console.log('[Webhook] Wallet processed notification received:', req.body);
    res.status(200).json({ received: true });
});

/**
 * POST /api/paymob_poket/response
 * Wallet final response webhook (with HMAC verification)
 */
router.post('/api/paymob_poket/response', async (req, res) => {
    try {
        // Verify HMAC signature
        const isValid = paymobService.verifyWebhookHMAC(req);
        if (!isValid) {
            console.error('[Webhook] Invalid HMAC signature for wallet response');
            return res.status(403).json({ error: 'Invalid signature' });
        }

        const { obj } = req.body;
        console.log('[Webhook] Wallet response received:', JSON.stringify(obj).substring(0, 200));

        // Extract order info and notify subdomain
        if (obj && obj.order && obj.order.id) {
            const paymentData = await pendingPayments.get(String(obj.order.id));
            if (paymentData) {
                const paymentStatus = obj.success === true ? 'success' : 'failed';
                await notifySubdomain(paymentData, paymentStatus);
            }
        }

        res.status(200).json({ received: true, processed: true });
    } catch (error) {
        console.error('[Webhook] Wallet response error:', error.message);
        res.status(500).json({ error: 'Processing failed' });
    }
});

module.exports = router;
