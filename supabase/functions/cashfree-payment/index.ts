import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let action, data;
    
    // Handle GET requests (like payment_return) that don't have JSON body
    if (req.method === 'GET') {
      const url = new URL(req.url);
      action = url.searchParams.get('action');
      data = Object.fromEntries(url.searchParams.entries());
    } else {
      // Handle POST requests with JSON body
      const requestBody = await req.text();
      if (requestBody) {
        const parsedBody = JSON.parse(requestBody);
        action = parsedBody.action;
        data = parsedBody;
      } else {
        throw new Error('No request body provided');
      }
    }
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Use production credentials
    const clientId = Deno.env.get('CASHFREE_CLIENT_ID') ?? '';
    const clientSecret = Deno.env.get('CASHFREE_SECRET_KEY') ?? '';
    
    if (!clientId || !clientSecret) {
      console.error('Cashfree credentials not configured:', { 
        hasClientId: !!clientId, 
        hasClientSecret: !!clientSecret 
      });
      return new Response(JSON.stringify({
        success: false,
        error: 'Cashfree credentials not configured. Please contact support.'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Using production environment
    const cashfreeBaseUrl = 'https://api.cashfree.com/pg';

    if (action === 'create_order') {
      const { amount, sessionRequestId, userId, customerInfo } = data;
      
      console.log('Creating Cashfree order with production credentials:', { amount, sessionRequestId, userId, customerInfo });

      // Validate required fields
      if (!amount || !sessionRequestId || !userId) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Missing required fields: amount, sessionRequestId, or userId'
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Generate shorter unique order ID (max 50 chars for Cashfree)
      const timestamp = Date.now().toString().slice(-8);
      const shortSessionId = sessionRequestId.slice(0, 8);
      const orderId = `ORD_${shortSessionId}_${timestamp}`;
      
      console.log('Generated order ID:', orderId, 'Length:', orderId.length);
      
      if (orderId.length > 50) {
        console.error('Order ID too long:', orderId.length);
        return new Response(JSON.stringify({
          success: false,
          error: 'Order ID generation failed. Please try again.'
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      const orderRequest = {
        order_id: orderId,
        order_amount: parseFloat(amount.toString()),
        order_currency: 'INR',
        customer_details: {
          customer_id: userId.slice(0, 50),
          customer_name: customerInfo?.name || 'Student',
          customer_email: customerInfo?.email || 'student@example.com',
          customer_phone: customerInfo?.phone || '9999999999'
        },
        order_meta: {
          return_url: `https://nxdsszdobgbikrnqqrue.supabase.co/functions/v1/cashfree-payment?action=payment_return&order_id=${orderId}`,
          notify_url: `https://nxdsszdobgbikrnqqrue.supabase.co/functions/v1/cashfree-payment?action=webhook`
        }
      };

      console.log('Sending order request to Cashfree production:', orderRequest);

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

      const responseText = await response.text();
      console.log('Cashfree API response:', response.status, responseText);

      if (!response.ok) {
        console.error('Cashfree API error:', responseText);
        
        if (response.status === 401) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Payment gateway authentication failed. Please check production credentials.'
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        return new Response(JSON.stringify({
          success: false,
          error: `Payment gateway error: ${response.status}. Please try again or contact support.`
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      let orderData;
      try {
        orderData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse Cashfree response:', parseError);
        return new Response(JSON.stringify({
          success: false,
          error: 'Invalid response from payment gateway. Please try again.'
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log('Cashfree order created successfully:', orderData);

      // Store payment record first
      const { error: paymentError } = await supabase
        .from('payment_history')
        .insert({
          user_id: userId,
          session_request_id: sessionRequestId,
          amount: parseFloat(amount.toString()),
          payment_type: 'student_payment',
          payment_status: 'pending',
          payment_method: 'cashfree',
          transaction_id: orderId,
          gateway_response: orderData
        });

      if (paymentError) {
        console.error('Error storing payment record:', paymentError);
        return new Response(JSON.stringify({
          success: false,
          error: 'Failed to store payment record. Please try again.'
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Return the payment session ID for frontend to handle checkout
      return new Response(JSON.stringify({
        success: true,
        order_id: orderId,
        payment_session_id: orderData.payment_session_id,
        cf_order_id: orderData.cf_order_id
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'payment_return') {
      const order_id = data.order_id;
      console.log('Payment return for order:', order_id);
      
      if (!order_id) {
        return new Response(`
          <html>
            <head><title>Payment Error</title></head>
            <body>
              <h1>Payment Error</h1>
              <p>Invalid payment return request.</p>
              <script>
                setTimeout(() => {
                  window.close();
                }, 3000);
              </script>
            </body>
          </html>
        `, {
          headers: { 'Content-Type': 'text/html' }
        });
      }
      
      // Verify payment status
      const verifyResult = await verifyPayment(order_id, supabase, clientId, clientSecret, cashfreeBaseUrl);
      
      if (verifyResult.success && verifyResult.payment_status === 'PAID') {
        return new Response(`
          <html>
            <head><title>Payment Successful</title></head>
            <body>
              <div style="text-align: center; font-family: Arial, sans-serif; padding: 50px;">
                <h1 style="color: green;">✅ Payment Successful!</h1>
                <p>Your payment has been processed successfully.</p>
                <p>Your session request has been sent to the teacher for approval.</p>
                <p>You will receive a confirmation email shortly.</p>
                <p style="margin-top: 30px;">This window will close automatically...</p>
                <script>
                  setTimeout(() => {
                    window.close();
                    if (window.opener) {
                      window.opener.postMessage('payment_success', '*');
                      window.opener.location.href = '/student-dashboard?tab=sessions';
                    }
                  }, 3000);
                </script>
              </div>
            </body>
          </html>
        `, {
          headers: { 'Content-Type': 'text/html' }
        });
      } else {
        return new Response(`
          <html>
            <head><title>Payment Failed</title></head>
            <body>
              <div style="text-align: center; font-family: Arial, sans-serif; padding: 50px;">
                <h1 style="color: red;">❌ Payment Failed</h1>
                <p>Your payment could not be processed. Please try again.</p>
                <p style="margin-top: 30px;">This window will close automatically...</p>
                <script>
                  setTimeout(() => {
                    window.close();
                    if (window.opener) {
                      window.opener.postMessage('payment_failed', '*');
                    }
                  }, 3000);
                </script>
              </div>
            </body>
          </html>
        `, {
          headers: { 'Content-Type': 'text/html' }
        });
      }
    }

    if (action === 'verify_payment') {
      const { order_id } = data;
      const result = await verifyPayment(order_id, supabase, clientId, clientSecret, cashfreeBaseUrl);
      
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'webhook') {
      const webhookData = data;
      console.log('Received Cashfree webhook:', webhookData);

      const { error: webhookUpdateError } = await supabase
        .from('payment_history')
        .update({
          payment_status: webhookData.order_status === 'PAID' ? 'completed' : 'failed',
          gateway_response: webhookData,
          updated_at: new Date().toISOString()
        })
        .eq('transaction_id', webhookData.order_id);

      if (webhookUpdateError) {
        console.error('Error processing webhook:', webhookUpdateError);
        throw webhookUpdateError;
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      success: false,
      error: 'Invalid action'
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Cashfree payment error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'An unexpected error occurred. Please try again.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function verifyPayment(orderId: string, supabase: any, clientId: string, clientSecret: string, cashfreeBaseUrl: string) {
  console.log('Verifying payment for order:', orderId);

  const response = await fetch(`${cashfreeBaseUrl}/orders/${orderId}`, {
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
  console.log('Payment verification result:', orderData);

  // Update payment status
  const { error: updateError } = await supabase
    .from('payment_history')
    .update({
      payment_status: orderData.order_status === 'PAID' ? 'completed' : 'failed',
      gateway_response: orderData,
      updated_at: new Date().toISOString()
    })
    .eq('transaction_id', orderId);

  if (updateError) {
    console.error('Error updating payment status:', updateError);
    throw updateError;
  }

  // If payment is successful, update session request and make it ready for teacher approval
  if (orderData.order_status === 'PAID') {
    const { data: paymentRecord, error: paymentFetchError } = await supabase
      .from('payment_history')
      .select('session_request_id')
      .eq('transaction_id', orderId)
      .single();

    if (!paymentFetchError && paymentRecord) {
      const { error: sessionUpdateError } = await supabase
        .from('session_requests')
        .update({
          payment_status: 'completed',
          status: 'pending', // Ready for teacher approval
          updated_at: new Date().toISOString()
        })
        .eq('id', paymentRecord.session_request_id);

      if (sessionUpdateError) {
        console.error('Error updating session request:', sessionUpdateError);
      } else {
        console.log('Session request updated to pending status for teacher approval');
      }
    }
  }

  return {
    success: true,
    payment_status: orderData.order_status,
    order_data: orderData
  };
}
