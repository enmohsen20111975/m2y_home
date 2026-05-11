# GLM Investment Platform - API Documentation

## Base URL
```
Production: https://invist.m2y.net/api
Local: http://localhost:3000/api
```

---

## Table of Contents

1. [Authentication](#authentication)
2. [Stocks API](#stocks-api)
3. [Expert Recommendations API](#expert-recommendations-api)
4. [Portfolio API](#portfolio-api)
5. [Watchlist API](#watchlist-api)
6. [Market Data API](#market-data-api)
7. [Predictions API](#predictions-api)
8. [Admin API](#admin-api)
9. [AI Analysis API](#ai-analysis-api)
10. [Subscription API](#subscription-api)
11. [Health & System API](#health--system-api)

---

## Authentication

### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name",
  "username": "username"
}
```

**Response:**
```json
{
  "success": true,
  "user": { "id": "...", "email": "user@example.com" }
}
```

### GET /api/auth/config
Get authentication configuration.

---

## Stocks API

### GET /api/stocks
Get all stocks list.

**Query Parameters:**
- `query` (optional): Search query
- `sector` (optional): Filter by sector
- `limit` (optional): Number of results (default: 500)

**Response:**
```json
{
  "stocks": [
    {
      "ticker": "COMI",
      "name": "Commercial International Bank",
      "name_ar": "البنك التجاري الدولي",
      "sector": "Banks",
      "current_price": 25.50,
      "previous_close": 25.00,
      "change": 0.50,
      "change_percent": 2.0,
      "volume": 1000000,
      "market_cap": 50000000000,
      "pe_ratio": 5.2,
      "egx30_member": true
    }
  ],
  "total": 458
}
```

### GET /api/stocks/[ticker]
Get single stock details.

**Response:**
```json
{
  "ticker": "COMI",
  "name": "Commercial International Bank",
  "name_ar": "البنك التجاري الدولي",
  "current_price": 25.50,
  "previous_close": 25.00,
  "high_price": 26.00,
  "low_price": 24.50,
  "volume": 1000000,
  "sector": "Banks"
}
```

### GET /api/stocks/[ticker]/history
Get stock price history.

**Query Parameters:**
- `period` (optional): Time period (1d, 1w, 1m, 3m, 1y)
- `limit` (optional): Number of data points

### GET /api/stocks/[ticker]/recommendation
Get AI recommendation for a stock.

### GET /api/stocks/[ticker]/professional-analysis
Get professional analysis for a stock.

### GET /api/stocks/search
Search stocks.

**Query Parameters:**
- `q`: Search query

---

## Expert Recommendations API

### GET /api/expert-recommendations
Get all expert recommendations.

**Query Parameters:**
- `status` (optional): Filter by status (PENDING, HIT_TARGET, STOPPED, CLOSED)
- `expert_name` (optional): Filter by expert name
- `ticker` (optional): Filter by stock symbol
- `limit` (optional): Number of results (default: 100)

**Response:**
```json
{
  "success": true,
  "recommendations": [
    {
      "id": "uuid",
      "stock_symbol": "COMI",
      "expert_name": "خبير 1",
      "action": "BUY",
      "entry_price": 25.50,
      "target_price": 28.00,
      "stop_loss": 24.00,
      "recommendation_date": "2024-01-15",
      "status": "PENDING",
      "hit_target": false,
      "hit_stop_loss": false,
      "profit_loss_percent": null
    }
  ],
  "expertStats": [
    {
      "expert_name": "خبير 1",
      "total_recommendations": 10,
      "successful_recommendations": 7,
      "success_rate": 70.0,
      "avg_return": 5.5
    }
  ]
}
```

### POST /api/expert-recommendations
Create a new expert recommendation.

**Request Body:**
```json
{
  "stock_symbol": "COMI",
  "expert_name": "خبير 1",
  "action": "BUY",
  "entry_price": 25.50,
  "target_price": 28.00,
  "stop_loss": 24.00,
  "recommendation_date": "2024-01-15",
  "notes": "ملاحظات إضافية"
}
```

**Required Fields:**
- `stock_symbol`
- `expert_name`
- `action` (BUY or SELL)
- `entry_price`

### PUT /api/expert-recommendations
Update an existing recommendation.

**Request Body:**
```json
{
  "id": "uuid",
  "status": "HIT_TARGET",
  "final_price": 28.50,
  "profit_loss_percent": 11.76,
  "hit_target": true
}
```

### DELETE /api/expert-recommendations?id={uuid}
Delete a recommendation.

### POST /api/expert-recommendations/import
Import multiple recommendations.

**Request Body:**
```json
{
  "recommendations": [
    {
      "stock_symbol": "COMI",
      "expert_name": "خبير 1",
      "action": "BUY",
      "entry_price": 25.50,
      "target_price": 28.00
    }
  ]
}
```

### GET /api/expert-recommendations/experts
Get list of all experts with their statistics.

---

## Portfolio API

### GET /api/portfolio
Get user's portfolio positions.

**Response:**
```json
{
  "success": true,
  "positions": [
    {
      "id": "uuid",
      "stock_symbol": "COMI",
      "stock_name": "البنك التجاري الدولي",
      "shares": 100,
      "avg_cost": 24.00,
      "current_price": 25.50,
      "market_value": 2550.00,
      "cost_basis": 2400.00,
      "unrealized_pnl": 150.00,
      "unrealized_pnl_percent": 6.25
    }
  ],
  "summary": {
    "total_positions": 5,
    "total_cost_basis": 10000.00,
    "total_market_value": 11000.00,
    "total_unrealized_pnl": 1000.00,
    "total_unrealized_pnl_percent": 10.0
  }
}
```

### POST /api/portfolio
Add a position to portfolio.

**Request Body:**
```json
{
  "stock_symbol": "COMI",
  "shares": 100,
  "avg_cost": 24.00,
  "entry_date": "2024-01-15",
  "notes": "ملاحظات"
}
```

**Required Fields:**
- `stock_symbol`
- `shares`
- `avg_cost`

### DELETE /api/portfolio?id={uuid}
Remove a position from portfolio.

---

## Watchlist API

### GET /api/watchlist
Get user's watchlist.

**Response:**
```json
{
  "success": true,
  "items": [
    {
      "id": 1,
      "stock_id": 123,
      "ticker": "COMI",
      "name": "Commercial International Bank",
      "name_ar": "البنك التجاري الدولي",
      "current_price": 25.50,
      "previous_close": 25.00,
      "price_change": 2.0,
      "sector": "Banks",
      "alert_price_above": 28.00,
      "alert_price_below": 23.00,
      "notes": "مراقبة للشراء"
    }
  ],
  "total": 10
}
```

### POST /api/watchlist
Add stock to watchlist.

**Request Body:**
```json
{
  "ticker": "COMI",
  "alert_price_above": 28.00,
  "alert_price_below": 23.00,
  "notes": "مراقبة للشراء"
}
```

### DELETE /api/watchlist/{id}
Remove stock from watchlist.

---

## Market Data API

### GET /api/market/gold
Get gold and silver prices.

**Response:**
```json
{
  "success": true,
  "source": "database",
  "prices": {
    "karats": [
      { "key": "24", "name_ar": "عيار 24", "price_per_gram": 4250, "change": 50 },
      { "key": "21", "name_ar": "عيار 21", "price_per_gram": 3718, "change": 43 },
      { "key": "18", "name_ar": "عيار 18", "price_per_gram": 3187, "change": 37 }
    ],
    "ounce": { "price": 132200, "change": 1500 },
    "silver": { "price_per_gram": 45, "change": 0.5 }
  }
}
```

### GET /api/market/currency
Get currency exchange rates.

**Response:**
```json
{
  "success": true,
  "central_bank_rate": 50.5,
  "currencies": [
    { "code": "USD", "name_ar": "دولار أمريكي", "buy_rate": 50.5, "sell_rate": 50.7, "is_major": true },
    { "code": "EUR", "name_ar": "يورو", "buy_rate": 54.8, "sell_rate": 55.0, "is_major": true },
    { "code": "GBP", "name_ar": "جنيه إسترليني", "buy_rate": 63.5, "sell_rate": 63.8, "is_major": true },
    { "code": "SAR", "name_ar": "ريال سعودي", "buy_rate": 13.5, "sell_rate": 13.6, "is_major": false }
  ]
}
```

### GET /api/market/overview
Get market overview data.

### GET /api/market/indices
Get market indices.

### GET /api/market/live-data
Get live market data.

### POST /api/market/sync
Sync market data from external sources.

### GET /api/market/status
Get market status (open/closed).

---

## Predictions API

### GET /api/predictions
Get AI predictions.

**Query Parameters:**
- `status` (optional): Filter by status (ACTIVE, EXPIRED, HIT_TARGET, MISSED)
- `ticker` (optional): Filter by stock symbol
- `limit` (optional): Number of results (default: 50)
- `offset` (optional): Pagination offset

**Response:**
```json
{
  "success": true,
  "predictions": [
    {
      "id": "uuid",
      "ticker": "COMI",
      "prediction_type": "BUY",
      "confidence": 75,
      "entry_price": 25.00,
      "target_price": 28.00,
      "stop_loss": 23.00,
      "technical_score": 70,
      "fundamental_score": 80,
      "status": "ACTIVE",
      "prediction_date": "2024-01-15"
    }
  ],
  "stats": {
    "active": 25
  }
}
```

### POST /api/predictions
Create a new prediction.

**Request Body:**
```json
{
  "ticker": "COMI",
  "prediction_type": "BUY",
  "confidence": 75,
  "entry_price": 25.00,
  "target_price": 28.00,
  "stop_loss": 23.00,
  "technical_score": 70,
  "fundamental_score": 80
}
```

### PUT /api/predictions
Update a prediction.

### DELETE /api/predictions?id={uuid}
Delete a prediction.

---

## Admin API

**Note: Admin APIs require authentication with admin privileges.**

### GET /api/admin/stats
Get platform statistics.

### GET /api/admin/users
Get all registered users.

**Response:**
```json
{
  "success": true,
  "count": 150,
  "users": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "name": "User Name",
      "subscription_tier": "premium",
      "is_active": true,
      "last_login": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### GET /api/admin/recommendations
Get all recommendations for admin review.

### POST /api/admin/sync-vps
Sync data from VPS server.

### GET /api/admin/export-data
Export platform data.

### POST /api/admin/import-data
Import platform data.

### GET /api/admin/monitor
Get system monitoring data.

---

## AI Analysis API

### POST /api/ai-analysis
Get AI analysis for a stock.

**Request Body:**
```json
{
  "ticker": "COMI",
  "analysis_type": "technical"
}
```

### GET /api/ai-proxy
Proxy to AI services.

### POST /api/v2/recommend
Get AI recommendation.

### GET /api/v2/stock/[symbol]/analysis
Get comprehensive stock analysis.

---

## Subscription API

### GET /api/subscription/plans
Get available subscription plans.

**Response:**
```json
{
  "plans": [
    { "id": "free", "name": "Free", "price": 0, "features": ["basic"] },
    { "id": "plus", "name": "Plus", "price": 99, "features": ["basic", "alerts"] },
    { "id": "premium", "name": "Premium", "price": 199, "features": ["basic", "alerts", "ai"] }
  ]
}
```

### GET /api/subscription/current
Get current user's subscription status.

### POST /api/subscription/activate
Activate a subscription.

### POST /api/subscription/start-trial
Start a free trial.

### POST /api/subscribe/[plan]
Subscribe to a plan.

---

## Health & System API

### GET /api/health
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### GET /api/init-db
Initialize database.

### GET /api/system/db-health
Check database health.

### GET /api/keepalive
Keep-alive endpoint for preventing sleep.

---

## Finance API

### GET /api/finance/assets
Get user's financial assets.

### POST /api/finance/assets
Add a financial asset.

### GET /api/finance/obligations
Get user's financial obligations.

### POST /api/finance/obligations
Add a financial obligation.

### GET /api/finance/reports
Get financial reports.

### GET /api/finance/transactions
Get transaction history.

---

## Payment API (PayMob)

### POST /api/paymob/create-payment
Create a payment request.

**Request Body:**
```json
{
  "amount": 199,
  "currency": "EGP",
  "plan": "premium"
}
```

### GET /api/paymob/callback
Payment callback endpoint.

---

## Crypto API

### GET /api/crypto
Get cryptocurrency prices.

### GET /api/crypto/[id]
Get specific cryptocurrency details.

### GET /api/crypto/ohlc
Get OHLC data for charts.

---

## Backtesting API

### POST /api/backtest
Run a backtest on a trading strategy.

**Request Body:**
```json
{
  "strategy": "ma_crossover",
  "ticker": "COMI",
  "start_date": "2023-01-01",
  "end_date": "2024-01-01"
}
```

### GET /api/backtesting
Get backtesting results.

---

## Cron Jobs

### GET /api/cron/scheduled
Run scheduled tasks.

### GET /api/cron/verify-predictions
Verify and update prediction statuses.

### GET /api/cron/auto-sync
Auto-sync data from external sources.

---

## Error Responses

All APIs follow a standard error format:

```json
{
  "success": false,
  "error": "Error message in English",
  "error_ar": "رسالة الخطأ بالعربية"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (missing/invalid parameters)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (e.g., duplicate entry)
- `500` - Internal Server Error

---

## Authentication Headers

For authenticated requests, include:

```
Authorization: Bearer <token>
```

Or use session cookies with NextAuth.js.

---

## Rate Limits

- Default: 100 requests per minute
- Admin endpoints: 1000 requests per minute
- Health/Keepalive: Unlimited

---

## Notes

1. All prices are in EGP (Egyptian Pounds) unless specified otherwise.
2. Stock tickers are case-insensitive.
3. Dates should be in ISO 8601 format.
4. All endpoints return JSON responses.
5. Arabic text is returned in UTF-8 encoding.

---

## Live Server

**Production URL:** https://invist.m2y.net

**API Base:** https://invist.m2y.net/api

**Admin Panel:** https://invist.m2y.net/admin

---

*Last Updated: January 2024*
