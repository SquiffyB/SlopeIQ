import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS };

  try {
    const authHeader = event.headers.authorization || event.headers.Authorization;
    const token = authHeader?.replace('Bearer ', '');
    if (!token) return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: 'Unauthorized' }) };

    const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_SERVICE_KEY || '');
    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: 'Unauthorized' }) };

    const { priceId, mode = 'subscription' } = JSON.parse(event.body || '{}');
    if (!priceId) return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Missing priceId' }) };

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { data: profile } = await supabase.from('profiles').select('stripe_customer_id, email').eq('id', user.id).single();

    let customerId = profile?.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({ email: profile?.email || user.email, metadata: { supabase_user_id: user.id } });
      customerId = customer.id;
      await supabase.from('profiles').update({ stripe_customer_id: customerId }).eq('id', user.id);
    }

    const origin = event.headers.origin || 'https://slopeiq.com';
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/dashboard/profile?upgraded=true`,
      cancel_url: `${origin}/pricing`,
      metadata: { supabase_user_id: user.id },
    });

    return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ url: session.url }) };
  } catch (err) {
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: err.message }) };
  }
};
