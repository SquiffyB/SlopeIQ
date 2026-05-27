const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  const sig = event.headers['stripe-signature'];
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_SERVICE_KEY || '');

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
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

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};
