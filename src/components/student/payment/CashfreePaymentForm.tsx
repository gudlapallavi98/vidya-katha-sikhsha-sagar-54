import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }

  try {
    const { action, ...data } = await req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const clientId = Deno.env.get('CASHFREE_CLIENT_ID');
    const clientSecret = Deno.env.get('CASHFREE_SECRET_KEY');

    if (!clientId || !clientSecret) {
      throw new Error('Cashfree credentials not configured');
    }

    const cashfreeBaseUrl = 'https://api.cashfree.com/pg';
    const domain = 'https://etutorss.com';

    if (action === 'create_order') {
      const { amount, sessionRequestId, userId, customerInfo } = data;

      const orderId = `ORDER_${sessionRequestId}_${Date.now()}`.substring(0, 50);

      const orderRequest = {
        order_id: orderId,
        order_amount: amount,
        order_currency: 'INR',
        customer_details: {
          customer_id: userId,
          customer_name: customerInfo.name,
          customer_email: customerInfo.email,
          customer_phone: customerInfo.phone || '9999999999'
        },
        order_meta: {
          return_url: `${domain}/functions/v1/cashfree-payment?action=verify_payment&order_id=${orderId}`,
          notify_url: `${domain}/functions/v1/cashfree-payment?action=webhook`
        }
      };

      const response = await fetch(`${cashfreeBaseUrl}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': clientId,
          'x-client-secret': clientSecret,
          'x-api-version': '2023-08-01'
        },
        body: JSON.stringify(orderRequest)
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Cashfree API error:', errorData);
        throw new Error(`Cashfree API error: ${response.status}`);
      }

      const orderData = await response.json();

      const { error: paymentError } = await supabase.from('payment_history').insert({
        user_id: userId,
        session_request_id: sessionRequestId,
        amount: amount,
        payment_type: 'student_payment',
        payment_status: 'pending',
        payment_method: 'cashfree',
        transaction_id: orderId,
        gateway_response: orderData
      });

      if (paymentError) {
        console.error('Error storing payment record:', paymentError);
        throw paymentError;
      }

      return new Response(JSON.stringify({
        success: true,
        order_id: orderId,
        payment_session_id: orderData.payment_session_id,
        payment_url: orderData.payment_link
      }), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    if (action === 'verify_payment') {
      const { order_id } = data;

      const response = await fetch(`${cashfreeBaseUrl}/orders/${order_id}`, {
        method: 'GET',
        headers: {
          'x-client-id': clientId,
          'x-client-secret': clientSecret,
          'x-api-version': '2023-08-01'
        }
      });

      if (!response.ok) {
        throw new Error(`Payment verification failed: ${response.status}`);
      }

      const orderData = await response.json();

      await supabase.from('payment_history').update({
        payment_status: orderData.order_status === 'PAID' ? 'completed' : 'failed',
        gateway_response: orderData,
        updated_at: new Date().toISOString()
      }).eq('transaction_id', order_id);

      if (orderData.order_status === 'PAID') {
        const { data: paymentRecord } = await supabase
          .from('payment_history')
          .select('session_request_id')
          .eq('transaction_id', order_id)
          .single();

        if (paymentRecord) {
          await supabase.from('session_requests').update({
            payment_status: 'completed',
            status: 'pending',
            updated_at: new Date().toISOString()
          }).eq('id', paymentRecord.session_request_id);
        }
      }

      return new Response(JSON.stringify({
        success: true,
        payment_status: orderData.order_status,
        order_data: orderData
      }), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    if (action === 'webhook') {
      const webhookData = data;

      await supabase.from('payment_history').update({
        payment_status: webhookData.order_status === 'PAID' ? 'completed' : 'failed',
        gateway_response: webhookData,
        updated_at: new Date().toISOString()
      }).eq('transaction_id', webhookData.order_id);

      return new Response(JSON.stringify({
        success: true
      }), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    throw new Error('Invalid action');

  } catch (error) {
    console.error('Cashfree payment error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 400,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});
