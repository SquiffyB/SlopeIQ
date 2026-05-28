import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export const config = { api: { bodyParser: false } };

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  const sig = req.headers['stripe-signature'];
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_SERVICE_KEY || '');

  let stripeEvent;
  try {
    const rawBody = await getRawBody(req);
    stripeEvent = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const session = stripeEvent.data.object;

  switch (stripeEvent.type) {
    case 'checkout.session.completed': {
      const userId = session.metadata?.supabase_user_id;
      if (userId) {
        await supabase.from('profiles').update({ tier: 'pro', stripe_subscription_id: session.subscription }).eq('id', userId);
      }
      break;
    }
    case 'customer.subscription.deleted':
    case 'customer.subscription.paused': {
      const customerId = session.customer;
      if (customerId) {
        const { data } = await supabase.from('profiles').select('id').eq('stripe_customer_id', customerId).single();
        if (data) await supabase.from('profiles').update({ tier: 'free' }).eq('id', data.id);
      }
      break;
    }
    case 'customer.subscription.resumed': {
      const customerId = session.customer;
      if (customerId) {
        const { data } = await supabase.from('profiles').select('id').eq('stripe_customer_id', customerId).single();
        if (data) await supabase.from('profiles').update({ tier: 'pro' }).eq('id', data.id);
      }
      break;
    }
  }

  return res.status(200).json({ received: true });
}
