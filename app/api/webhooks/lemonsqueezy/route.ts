import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createHmac, timingSafeEqual } from 'crypto';

// Use service role for admin operations (bypass RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

/**
 * Verify webhook signature from Lemon Squeezy
 */
function verifySignature(payload: string, signature: string): boolean {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  
  if (!secret) {
    console.error('❌ LEMONSQUEEZY_WEBHOOK_SECRET not configured');
    return false;
  }

  try {
    const hmac = createHmac('sha256', secret);
    const digest = hmac.update(payload).digest('hex');
    
    return timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(digest)
    );
  } catch (error) {
    console.error('❌ Signature verification error:', error);
    return false;
  }
}

/**
 * Find user by email in Supabase Auth
 */
async function findUserByEmail(email: string) {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    
    if (error) {
      console.error('❌ Error listing users:', error);
      return null;
    }

    const user = data.users.find(u => u.email?.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      console.log(`⚠️  User not found for email: ${email}`);
    }
    
    return user;
  } catch (error) {
    console.error('❌ Error finding user:', error);
    return null;
  }
}

/**
 * Lemon Squeezy Webhook Handler
 */
export async function POST(request: NextRequest) {
  try {
    console.log('📥 Webhook received');

    // Get raw body for signature verification
    const body = await request.text();
    const signature = request.headers.get('x-signature');

    // Verify signature
    if (!signature) {
      console.error('❌ Missing X-Signature header');
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    if (!verifySignature(body, signature)) {
      console.error('❌ Invalid signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    console.log('✅ Signature verified');

    // Parse webhook payload
    const payload = JSON.parse(body);
    const { meta, data } = payload;
    const eventName = meta.event_name;

    console.log('📌 Event:', eventName);

    // Extract common fields
    const attributes = data.attributes;
    const customerEmail = attributes.user_email || attributes.customer_email;
    const subscriptionId = String(attributes.subscription_id || data.id);
    const customerId = String(attributes.customer_id || '');
    const orderId = String(attributes.order_id || data.id);
    const status = attributes.status;
    const variantName = attributes.variant_name || attributes.first_order_item?.variant_name || '';

    console.log('📧 Customer email:', customerEmail);
    console.log('🔑 Subscription ID:', subscriptionId);

    if (!customerEmail) {
      console.error('❌ No customer email in webhook payload');
      return NextResponse.json({ error: 'No customer email' }, { status: 400 });
    }

    // Find user in Supabase
    const user = await findUserByEmail(customerEmail);
    
    if (!user) {
      console.error(`❌ User not found for email: ${customerEmail}`);
      // Return 200 to avoid retries, but log the error
      return NextResponse.json({ 
        received: true, 
        warning: 'User not found - they may need to sign up first' 
      });
    }

    console.log('👤 User found:', user.id);

    // Determine plan type from variant name
    let planType: 'monthly' | 'annual' = 'monthly';
    const variantLower = variantName.toLowerCase();
    if (variantLower.includes('annual') || 
        variantLower.includes('yearly') || 
        variantLower.includes('year')) {
      planType = 'annual';
    }

    console.log('📦 Plan type:', planType);

    // Handle different webhook events
    switch (eventName) {
      case 'order_created':
      case 'subscription_created':
      case 'subscription_payment_success': {
        console.log('💳 Processing subscription activation...');
        
        const { error } = await supabaseAdmin
          .from('subscriptions')
          .upsert({
            user_id: user.id,
            customer_id: customerId,
            subscription_id: subscriptionId,
            order_id: orderId,
            status: 'active',
            plan_type: planType,
            amount: attributes.total || attributes.subtotal || 0,
            currency: attributes.currency || 'USD',
            current_period_start: attributes.created_at || new Date().toISOString(),
            current_period_end: attributes.renews_at || null,
            lemon_squeezy_data: data,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          });

        if (error) {
          console.error('❌ Database error:', error);
          return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        console.log(`✅ Subscription activated for ${user.email}`);
        break;
      }

      case 'subscription_updated': {
        console.log('🔄 Processing subscription update...');
        
        const updateData: any = {
          status: status === 'active' || status === 'on_trial' ? 'active' : status,
          lemon_squeezy_data: data,
          updated_at: new Date().toISOString()
        };

        if (attributes.renews_at) {
          updateData.current_period_end = attributes.renews_at;
        }

        const { error } = await supabaseAdmin
          .from('subscriptions')
          .update(updateData)
          .eq('subscription_id', subscriptionId);

        if (error) {
          console.error('❌ Database error:', error);
          return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        console.log(`✅ Subscription updated for ${user.email}`);
        break;
      }

      case 'subscription_cancelled':
      case 'subscription_expired': {
        console.log('❌ Processing subscription cancellation...');
        
        const { error } = await supabaseAdmin
          .from('subscriptions')
          .update({
            status: 'canceled',
            canceled_at: new Date().toISOString(),
            lemon_squeezy_data: data,
            updated_at: new Date().toISOString()
          })
          .eq('subscription_id', subscriptionId);

        if (error) {
          console.error('❌ Database error:', error);
          return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        console.log(`✅ Subscription canceled for ${user.email}`);
        break;
      }

      case 'subscription_payment_failed': {
        console.log('⚠️  Processing payment failure...');
        
        const { error } = await supabaseAdmin
          .from('subscriptions')
          .update({
            status: 'past_due',
            lemon_squeezy_data: data,
            updated_at: new Date().toISOString()
          })
          .eq('subscription_id', subscriptionId);

        if (error) {
          console.error('❌ Database error:', error);
        }

        console.log(`⚠️  Payment failed for ${user.email}`);
        break;
      }

      case 'subscription_payment_recovered': {
        console.log('✅ Processing payment recovery...');
        
        const { error } = await supabaseAdmin
          .from('subscriptions')
          .update({
            status: 'active',
            current_period_end: attributes.renews_at || null,
            lemon_squeezy_data: data,
            updated_at: new Date().toISOString()
          })
          .eq('subscription_id', subscriptionId);

        if (error) {
          console.error('❌ Database error:', error);
        }

        console.log(`✅ Payment recovered for ${user.email}`);
        break;
      }

      case 'subscription_paused': {
        console.log('⏸️  Processing subscription pause...');
        
        const { error } = await supabaseAdmin
          .from('subscriptions')
          .update({
            status: 'paused',
            lemon_squeezy_data: data,
            updated_at: new Date().toISOString()
          })
          .eq('subscription_id', subscriptionId);

        if (error) {
          console.error('❌ Database error:', error);
        }

        console.log(`⏸️  Subscription paused for ${user.email}`);
        break;
      }

      case 'subscription_resumed': {
        console.log('▶️  Processing subscription resume...');
        
        const { error } = await supabaseAdmin
          .from('subscriptions')
          .update({
            status: 'active',
            lemon_squeezy_data: data,
            updated_at: new Date().toISOString()
          })
          .eq('subscription_id', subscriptionId);

        if (error) {
          console.error('❌ Database error:', error);
        }

        console.log(`▶️  Subscription resumed for ${user.email}`);
        break;
      }

      default:
        console.log(`ℹ️  Unhandled event: ${eventName}`);
    }

    return NextResponse.json({ received: true, event: eventName });

  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Handle GET requests (for testing)
export async function GET() {
  return NextResponse.json({
    message: 'Lemon Squeezy webhook endpoint',
    status: 'active',
    configured: !!process.env.LEMONSQUEEZY_WEBHOOK_SECRET
  });
}

