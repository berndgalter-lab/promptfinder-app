# PromptFinder Environment Variables Setup Guide

## Required Environment Variables

Copy these to your `.env.local` file:

### Supabase Configuration
```bash
# Get these from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# IMPORTANT: Service Role Key (needed for webhooks)
# Get from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api
# This key bypasses Row Level Security - keep it secret!
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Lemon Squeezy Configuration
```bash
# Get these from: https://app.lemonsqueezy.com/settings/webhooks
LEMONSQUEEZY_WEBHOOK_SECRET=your_webhook_signing_secret

# Optional: Lemon Squeezy API Key (for future features)
# Get from: https://app.lemonsqueezy.com/settings/api
LEMONSQUEEZY_API_KEY=your_lemon_squeezy_api_key
```

### Deployment URL
```bash
# In production: https://yourdomain.com
# In development: http://localhost:3000
# For testing webhooks locally, use ngrok: https://ngrok.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## Setup Instructions

### 1. Supabase Setup

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings → API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **Keep this secret!**

### 2. Run Database Migration

Execute the SQL migration in Supabase SQL Editor:
```bash
supabase/migrations/005_subscriptions.sql
```

Or manually in Supabase Dashboard → SQL Editor → New Query → Paste and Run

### 3. Lemon Squeezy Webhook Setup

1. Go to [Lemon Squeezy Dashboard](https://app.lemonsqueezy.com)
2. Navigate to **Settings → Webhooks**
3. Click **"+ Create Webhook"**
4. Configure:
   - **Callback URL**: `https://yourdomain.com/api/webhooks/lemonsqueezy`
   - **Signing Secret**: Copy this → `LEMONSQUEEZY_WEBHOOK_SECRET`
   - **Events to Subscribe**:
     - ✅ `order_created`
     - ✅ `subscription_created`
     - ✅ `subscription_updated`
     - ✅ `subscription_cancelled`
     - ✅ `subscription_expired`
     - ✅ `subscription_payment_failed`
     - ✅ `subscription_payment_success`
     - ✅ `subscription_payment_recovered`
     - ✅ `subscription_paused`
     - ✅ `subscription_resumed`

### 4. Testing Webhooks Locally

To test webhooks on your local machine:

1. Install [ngrok](https://ngrok.com): `npm install -g ngrok`
2. Start your Next.js dev server: `npm run dev`
3. In another terminal, run: `ngrok http 3000`
4. Copy the ngrok URL (e.g., `https://abc123.ngrok.io`)
5. Update Lemon Squeezy webhook URL to: `https://abc123.ngrok.io/api/webhooks/lemonsqueezy`
6. Make a test purchase in Lemon Squeezy test mode
7. Check webhook logs in Lemon Squeezy Dashboard and your terminal

### 5. Verify Setup

Test the webhook endpoint:
```bash
curl https://yourdomain.com/api/webhooks/lemonsqueezy
```

Should return:
```json
{
  "message": "Lemon Squeezy webhook endpoint",
  "status": "active",
  "configured": true
}
```

---

## Checkout URLs

### Monthly Plan ($19/month)
```
https://promptfinder.lemonsqueezy.com/buy/c534f3ab-80c2-4a53-86ff-69c05e62a79a
```

### Annual Plan ($190/year)
```
https://promptfinder.lemonsqueezy.com/buy/f7107575-9075-4e57-8440-7f511102db70
```

---

## Security Notes

⚠️ **NEVER commit `.env.local` to Git**

⚠️ **Keep `SUPABASE_SERVICE_ROLE_KEY` secret** - it bypasses all security rules

⚠️ **Use environment variables in production** - never hardcode secrets

✅ The `.env.local` file is already in `.gitignore`

---

## Troubleshooting

### Webhook not working?
1. Check Lemon Squeezy webhook logs
2. Verify `LEMONSQUEEZY_WEBHOOK_SECRET` is correct
3. Ensure `SUPABASE_SERVICE_ROLE_KEY` is set
4. Check API route logs: `app/api/webhooks/lemonsqueezy/route.ts`

### Subscription not activating?
1. Verify user exists in Supabase with matching email
2. Check webhook payload in Lemon Squeezy dashboard
3. Look for errors in server logs
4. Check `subscriptions` table in Supabase

### Testing subscriptions?
Use Lemon Squeezy test mode:
1. Enable test mode in Lemon Squeezy settings
2. Use test card: `4242 4242 4242 4242`
3. Any future date for expiry
4. Any 3-digit CVC

